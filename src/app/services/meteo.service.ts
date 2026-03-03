import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

export interface MeteoData {
  temperature: number;
  condition: string;
  icone: string;
  bonneCondition: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  constructor(private http: HttpClient) { }

  getMeteoParVille(ville: string): Observable<MeteoData> {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${ville}&count=1&language=fr`;

    return this.http.get<any>(geocodingUrl).pipe(
      switchMap(geoRes => {
        if (!geoRes.results || geoRes.results.length === 0) {
          throw new Error('Ville introuvable');
        }

        const lat = geoRes.results[0].latitude;
        const lon = geoRes.results[0].longitude;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        return this.http.get<any>(weatherUrl);
      }),
      map(weatherRes => {
        const current = weatherRes.current_weather;
        const conditionInfo = this.interpreterCodeMeteo(current.weathercode);

        return {
          temperature: Math.round(current.temperature),
          condition: conditionInfo.texte,
          icone: conditionInfo.icone,
          bonneCondition: conditionInfo.estClair && current.temperature > 5
        };
      })
    );
  }

  private interpreterCodeMeteo(code: number): { texte: string, icone: string, estClair: boolean } {
    if (code === 0) return { texte: 'Ciel Dégagé', icone: 'bi-sun-fill', estClair: true };
    if (code >= 1 && code <= 3) return { texte: 'Nuageux', icone: 'bi-cloud-sun-fill', estClair: false };
    if (code >= 45 && code <= 48) return { texte: 'Brouillard', icone: 'bi-cloud-haze-fill', estClair: false };
    if (code >= 51 && code <= 67) return { texte: 'Pluie', icone: 'bi-cloud-rain-fill', estClair: false };
    if (code >= 71 && code <= 77) return { texte: 'Neige', icone: 'bi-cloud-snow-fill', estClair: false };
    return { texte: 'Orage ou Averses', icone: 'bi-cloud-lightning-fill', estClair: false };
  }
}
