import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Hydratation SSR avec gestion des tâches asynchrones
    // Le délai de 100ms dans auth.service.loadUserData() évite les conflits
    //provideClientHydration(withEventReplay()), // Erreur NG0506, renvoie un warniing dans la console : "Hydration failed: Task was not completed within the expected time frame."
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};
