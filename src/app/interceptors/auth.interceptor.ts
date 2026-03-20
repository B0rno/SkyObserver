/**
 * Intercepteur HTTP d'authentification
 * Ajoute automatiquement le token JWT UNIQUEMENT aux requêtes vers le backend
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Ajoute le header Authorization avec le token JWT si :
 * - L'utilisateur est connecté
 * - La requête est destinée à notre backend (localhost:3000/api)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injecter le service d'authentification
  const authService = inject(AuthService);

  // Récupérer le token JWT
  const token = authService.getToken();

  // Vérifier si la requête est destinée à notre backend
  const isBackendRequest = req.url.includes('localhost:3000/api');

  // Si un token existe ET que c'est une requête backend, ajouter le header Authorization
  if (token && isBackendRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Continuer avec la requête (modifiée ou non)
  return next(req);
};
