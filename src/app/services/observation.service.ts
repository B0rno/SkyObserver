/**
 * Service de gestion des observations
 * Permet de créer, modifier, supprimer et lister les observations astronomiques
 */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/**
 * Interface pour une observation
 */
export interface Observation {
  id: number;
  userId: number;
  planetName: string;
  date: string;
  location: string;
  weather: string | null;
  notes: string | null;
  magnitude: number | null;
  altitude: number | null;
  azimuth: number | null;
  createdAt: string;
}

/**
 * Interface pour créer/modifier une observation
 */
export interface ObservationInput {
  planetName: string;
  date: string;
  location: string;
  weather?: string;
  notes?: string;
  magnitude?: number;
  altitude?: number;
  azimuth?: number;
}

/**
 * Interface pour la réponse de liste des observations
 */
interface ObservationsResponse {
  count: number;
  observations: Observation[];
}

/**
 * Interface pour la réponse d'une observation
 */
interface ObservationResponse {
  observation: Observation;
}

/**
 * Interface pour la réponse de création/modification
 */
interface ObservationActionResponse {
  message: string;
  observation: Observation;
}

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  /**
   * URL de base de l'API backend
   */
  private apiUrl = 'http://localhost:3000/api/observations';

  /**
   * Signal pour la liste des observations
   * Permet une réactivité automatique dans les composants
   */
  observations = signal<Observation[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les observations de l'utilisateur connecté
   */
  getObservations(): Observable<ObservationsResponse> {
    return this.http.get<ObservationsResponse>(this.apiUrl).pipe(
      tap(response => {
        // Mettre à jour le signal avec la liste des observations
        this.observations.set(response.observations);
      })
    );
  }

  /**
   * Récupérer une observation spécifique par son ID
   * @param observationId ID de l'observation
   */
  getObservationById(observationId: number): Observable<ObservationResponse> {
    return this.http.get<ObservationResponse>(`${this.apiUrl}/${observationId}`);
  }

  /**
   * Créer une nouvelle observation
   * @param observationData Données de l'observation
   */
  createObservation(observationData: ObservationInput): Observable<ObservationActionResponse> {
    return this.http.post<ObservationActionResponse>(this.apiUrl, observationData).pipe(
      tap(response => {
        // Ajouter la nouvelle observation à la liste locale
        const currentObservations = this.observations();
        this.observations.set([response.observation, ...currentObservations]);
      })
    );
  }

  /**
   * Modifier une observation existante
   * @param observationId ID de l'observation
   * @param observationData Données à modifier
   */
  updateObservation(
    observationId: number,
    observationData: Partial<ObservationInput>
  ): Observable<ObservationActionResponse> {
    return this.http.put<ObservationActionResponse>(
      `${this.apiUrl}/${observationId}`,
      observationData
    ).pipe(
      tap(response => {
        // Mettre à jour l'observation dans la liste locale
        const currentObservations = this.observations();
        const updatedObservations = currentObservations.map(obs =>
          obs.id === observationId ? response.observation : obs
        );
        this.observations.set(updatedObservations);
      })
    );
  }

  /**
   * Supprimer une observation
   * @param observationId ID de l'observation à supprimer
   */
  deleteObservation(observationId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${observationId}`).pipe(
      tap(() => {
        // Retirer l'observation de la liste locale
        const currentObservations = this.observations();
        this.observations.set(currentObservations.filter(obs => obs.id !== observationId));
      })
    );
  }

  /**
   * Filtrer les observations par planète (recherche locale)
   * @param planetName Nom de la planète
   */
  getObservationsByPlanet(planetName: string): Observation[] {
    return this.observations().filter(obs => obs.planetName === planetName);
  }

  /**
   * Filtrer les observations par date (recherche locale)
   * @param startDate Date de début (format ISO)
   * @param endDate Date de fin (format ISO)
   */
  getObservationsByDateRange(startDate: string, endDate: string): Observation[] {
    return this.observations().filter(obs => {
      const obsDate = new Date(obs.date);
      return obsDate >= new Date(startDate) && obsDate <= new Date(endDate);
    });
  }
}
