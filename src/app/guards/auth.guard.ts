/**
 * Guard d'authentification
 * Protège les routes privées en vérifiant que l'utilisateur est connecté
 */

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Vérifie si l'utilisateur est authentifié avant d'accéder à une route
 * Si non authentifié, redirige vers la page de connexion
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier si l'utilisateur est connecté
  if (authService.isAuthenticated()) {
    // L'utilisateur est connecté, autoriser l'accès
    return true;
  } else {
    // L'utilisateur n'est pas connecté, rediriger vers la page de connexion
    // Conserver l'URL demandée pour rediriger après connexion
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};
