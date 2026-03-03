import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// L'interface pour structurer les données qu'on renvoie au composant
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
  // L'URL de l'API Open-Meteo (Ici, on cible Paris par défaut pour l'exemple)
  // current_weather=true demande la météo actuelle
  private apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current_weather=true';

  constructor(private http: HttpClient) { }

  getMeteoActuelle(): Observable<MeteoData> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // L'API Open-Meteo renvoie les données dans l'objet 'current_weather'
        const current = response.current_weather;

        // On récupère le code WMO pour déterminer la condition et l'icône
        const weatherCode = current.weathercode;
        const conditionInfo = this.interpreterCodeMeteo(weatherCode);

        // On construit notre objet avec les vraies données
        return {
          temperature: Math.round(current.temperature), // Arrondir la température
          condition: conditionInfo.texte,
          icone: conditionInfo.icone,
          // Règle arbitraire : c'est "bon" s'il ne pleut pas/neige pas et qu'il fait plus de 5°C
          bonneCondition: conditionInfo.estClair && current.temperature > 5
        };
      })
    );
  }

  // Fonction utilitaire pour traduire les codes WMO d'Open-Meteo en texte et icônes Bootstrap
  private interpreterCodeMeteo(code: number): { texte: string, icone: string, estClair: boolean } {
    // 0 = Ciel clair, 1-3 = Nuageux, 45-48 = Brouillard, 51+ = Pluie/Neige
    if (code === 0) {
      return { texte: 'Ciel Dégagé', icone: 'bi-sun-fill', estClair: true };
    } else if (code >= 1 && code <= 3) {
      return { texte: 'Nuageux', icone: 'bi-cloud-sun-fill', estClair: false };
    } else if (code >= 45 && code <= 48) {
      return { texte: 'Brouillard', icone: 'bi-cloud-haze-fill', estClair: false };
    } else if (code >= 51 && code <= 67) {
      return { texte: 'Pluie', icone: 'bi-cloud-rain-fill', estClair: false };
    } else if (code >= 71 && code <= 77) {
      return { texte: 'Neige', icone: 'bi-cloud-snow-fill', estClair: false };
    } else {
      return { texte: 'Orage ou Averses', icone: 'bi-cloud-lightning-fill', estClair: false };
    }
  }
}
