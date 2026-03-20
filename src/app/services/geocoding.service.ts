import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs'; // Ajout de 'of' ici

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

  /**
   * Recherche des suggestions de villes pour l'autocomplétion
   * @param query Le texte tapé par l'utilisateur
   * @returns Un tableau de chaînes de caractères (ex: "Paris, Île-de-France, France")
   */
  rechercherVilles(query: string): Observable<string[]> {
    // Si la recherche est vide ou trop courte, on retourne immédiatement un tableau vide
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    const params = {
      name: query.trim(),
      count: '5', // On demande 5 suggestions pour ne pas surcharger l'interface
      language: 'fr',
      format: 'json'
    };

    return this.http.get<any>(this.GEOCODING_URL, { params }).pipe(
      map(response => {
        // Si l'API ne trouve rien, on renvoie un tableau vide
        if (!response.results) {
          return [];
        }

        // On transforme les résultats bruts en un joli texte formaté
        return response.results.map((r: any) => {
          const parts = [r.name];
          if (r.admin1) parts.push(r.admin1); // Ajoute la région ou le département si disponible
          if (r.country) parts.push(r.country); // Ajoute le pays
          return parts.join(', ');
        });
      })
    );
  }
}