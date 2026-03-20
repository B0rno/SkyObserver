/**
 * Service de gestion des favoris
 * Permet d'ajouter, supprimer et lister les planètes favorites
 */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/**
 * Interface pour un favori
 */
export interface Favorite {
  id: number;
  userId: number;
  planetName: string;
  createdAt: string;
}

/**
 * Interface pour la réponse de liste des favoris
 */
interface FavoritesResponse {
  count: number;
  favorites: Favorite[];
}

/**
 * Interface pour la réponse d'ajout de favori
 */
interface AddFavoriteResponse {
  message: string;
  favorite: Favorite;
}

/**
 * Interface pour la réponse de vérification de favori
 */
interface CheckFavoriteResponse {
  isFavorite: boolean;
  favorite: Favorite | null;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  /**
   * URL de base de l'API backend
   */
  private apiUrl = 'http://localhost:3000/api/favorites';

  /**
   * Signal pour la liste des favoris
   * Permet une réactivité automatique dans les composants
   */
  favorites = signal<Favorite[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Récupérer tous les favoris de l'utilisateur connecté
   */
  getFavorites(): Observable<FavoritesResponse> {
    return this.http.get<FavoritesResponse>(this.apiUrl).pipe(
      tap(response => {
        // Mettre à jour le signal avec la liste des favoris
        this.favorites.set(response.favorites);
      })
    );
  }

  /**
   * Ajouter une planète aux favoris
   * @param planetName Nom de la planète
   */
  addFavorite(planetName: string): Observable<AddFavoriteResponse> {
    return this.http.post<AddFavoriteResponse>(this.apiUrl, { planetName }).pipe(
      tap(response => {
        // Ajouter le nouveau favori à la liste locale
        const currentFavorites = this.favorites();
        this.favorites.set([response.favorite, ...currentFavorites]);
      })
    );
  }

  /**
   * Supprimer un favori
   * @param favoriteId ID du favori à supprimer
   */
  deleteFavorite(favoriteId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${favoriteId}`).pipe(
      tap(() => {
        // Retirer le favori de la liste locale
        const currentFavorites = this.favorites();
        this.favorites.set(currentFavorites.filter(f => f.id !== favoriteId));
      })
    );
  }

  /**
   * Vérifier si une planète est en favori
   * @param planetName Nom de la planète
   */
  checkFavorite(planetName: string): Observable<CheckFavoriteResponse> {
    return this.http.get<CheckFavoriteResponse>(`${this.apiUrl}/check/${planetName}`);
  }

  /**
   * Vérifier localement si une planète est en favori (sans appel API)
   * Utile pour l'affichage rapide
   * @param planetName Nom de la planète
   */
  isFavoriteLocal(planetName: string): boolean {
    return this.favorites().some(f => f.planetName === planetName);
  }

  /**
   * Récupérer l'ID d'un favori par nom de planète (recherche locale)
   * @param planetName Nom de la planète
   */
  getFavoriteIdByPlanetName(planetName: string): number | null {
    const favorite = this.favorites().find(f => f.planetName === planetName);
    return favorite ? favorite.id : null;
  }
}
