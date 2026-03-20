/**
 * Service d'authentification
 * Gère la connexion, l'inscription, la déconnexion et le stockage du token JWT
 */

import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { FavoriteService } from './favorite.service';
import { ObservationService } from './observation.service';

/**
 * Interface pour la réponse d'inscription
 */
interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    createdAt: string;
  };
}

/**
 * Interface pour la réponse de connexion
 */
interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    createdAt: string;
  };
}

/**
 * Interface pour la réponse du profil
 */
interface ProfileResponse {
  user: {
    id: number;
    email: string;
    username: string;
    createdAt: string;
    stats: {
      favorites: number;
      observations: number;
      lists: number;
    };
  };
}

/**
 * Interface pour l'utilisateur
 */
export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
  stats?: {
    favorites: number;
    observations: number;
    lists: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * URL de base de l'API backend
   */
  private apiUrl = 'http://localhost:3000/api/auth';

  /**
   * Signal pour l'utilisateur connecté
   * Utilise les signals Angular pour la réactivité
   */
  currentUser = signal<User | null>(null);

  /**
   * Signal pour savoir si l'utilisateur est connecté
   */
  isAuthenticated = signal<boolean>(false);

  /**
   * Vérifier si on est dans le navigateur, car localStorage n'est pas disponible côté serveur
   */
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private favoriteService: FavoriteService,
    private observationService: ObservationService
  ) {
    // Injecter PLATFORM_ID pour détecter l'environnement
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);

    // Vérifier si un token existe au chargement du service (seulement côté client)
    if (this.isBrowser) {
      this.checkAuthStatus();
    }
  }

  /**
   * Vérifier si l'utilisateur est déjà connecté (token présent)
   */
  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      // Considérer l'utilisateur comme authentifié si un token existe
      // La vérification réelle sera faite lors des requêtes API
      this.isAuthenticated.set(true);

      // Essayer de récupérer le profil (optionnel)
      this.getProfile().subscribe({
        next: () => {
          // Le profil a été récupéré avec succès
          this.isAuthenticated.set(true);
          // Charger les favoris après la vérification du profil
          this.loadUserData();
        },
        error: (error) => {
          // Déconnecter SEULEMENT si le token est invalide (401)
          // Pas si c'est juste une erreur réseau
          if (error.status === 401) {
            this.logout();
          }
          // Sinon, garder l'utilisateur connecté
        }
      });
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   * @param email Email de l'utilisateur
   * @param username Nom d'utilisateur
   * @param password Mot de passe
   */
  register(email: string, username: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      email,
      username,
      password
    }).pipe(
      tap(response => {
        // Stocker le token dans le localStorage
        this.setToken(response.token);
        // Mettre à jour l'utilisateur courant
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
        // Charger les données utilisateur (favoris, observations)
        this.loadUserData();
      })
    );
  }

  /**
   * Connexion d'un utilisateur existant
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        // Stocker le token dans le localStorage
        this.setToken(response.token);
        // Mettre à jour l'utilisateur courant
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
        // Charger les données utilisateur (favoris, observations)
        this.loadUserData();
      })
    );
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/me`).pipe(
      tap(response => {
        // Mettre à jour l'utilisateur courant avec les stats
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  /**
   * Charger les données utilisateur (favoris, observations)
   * Appelé après login, register et checkAuthStatus
   */
  private loadUserData(): void {
    // Charger les favoris
    this.favoriteService.getFavorites().subscribe({
      next: () => {
        console.log('Favoris chargés avec succès');
      },
      error: (error) => {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    });

    // Charger les observations
    this.observationService.getObservations().subscribe({
      next: () => {
        console.log('Observations chargées avec succès');
      },
      error: (error) => {
        console.error('Erreur lors du chargement des observations:', error);
      }
    });
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    // Supprimer le token du localStorage
    this.removeToken();
    // Réinitialiser l'utilisateur courant
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    // Réinitialiser les favoris
    this.favoriteService.favorites.set([]);
    // Réinitialiser les observations
    this.observationService.observations.set([]);
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  /**
   * Stocker le token JWT dans le localStorage
   * @param token Token JWT
   */
  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Récupérer le token JWT depuis le localStorage
   * @returns Token JWT ou null
   */
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Supprimer le token JWT du localStorage
   */
  private removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
    }
  }
}
