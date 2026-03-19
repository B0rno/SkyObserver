/**
 * Intercepteur HTTP d'authentification
 * Ajoute automatiquement le token JWT à toutes les requêtes HTTP
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Ajoute le header Authorization avec le token JWT si l'utilisateur est connecté
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injecter le service d'authentification
  const authService = inject(AuthService);

  // Récupérer le token JWT
  const token = authService.getToken();

  // Si un token existe, cloner la requête et ajouter le header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Continuer avec la requête (modifiée ou non)
  return next(req);
};
