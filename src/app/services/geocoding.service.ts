import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Coordonnees {
  latitude: number;
  longitude: number;
  altitude: number;  // altitude en mètres
  ville: string;
  pays: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

  constructor(private http: HttpClient) { }

  /**
   * Convertit un nom de ville en coordonnées GPS via l'API Open-Meteo Geocoding
   */
  getCoordonnees(ville: string): Observable<Coordonnees> {
    const params = {
      name: ville,
      count: '1',
      language: 'fr',
      format: 'json'
    };

    return this.http.get<any>(this.GEOCODING_URL, { params }).pipe(
      map(response => {
        if (!response.results || response.results.length === 0) {
          throw new Error('Ville introuvable');
        }

        const result = response.results[0];
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          altitude: result.elevation || 0,  // altitude en mètres (0 par défaut si non disponible)
          ville: result.name,
          pays: result.country || ''
        };
      })
    );
  }
}
