/**
 * Service d'authentification
 * Gère la connexion, l'inscription, la déconnexion et le stockage du token JWT
 */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Vérifier si un token existe au chargement du service
    this.checkAuthStatus();
  }

  /**
   * Vérifier si l'utilisateur est déjà connecté (token présent)
   */
  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      // Si un token existe, récupérer le profil utilisateur
      this.getProfile().subscribe({
        next: () => {
          // Le profil a été récupéré avec succès
          this.isAuthenticated.set(true);
        },
        error: () => {
          // Le token est invalide ou expiré
          this.logout();
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
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    // Supprimer le token du localStorage
    this.removeToken();
    // Réinitialiser l'utilisateur courant
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  /**
   * Stocker le token JWT dans le localStorage
   * @param token Token JWT
   */
  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Récupérer le token JWT depuis le localStorage
   * @returns Token JWT ou null
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Supprimer le token JWT du localStorage
   */
  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }
}
