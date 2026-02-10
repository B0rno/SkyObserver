import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/accueil/accueil').then(m => m.Accueil)
      },
      {
        path: 'vue-ciel',
        loadComponent: () => import('./pages/vue-ciel/vue-ciel').then(m => m.VueCiel)
      },
      {
        path: 'glossaire',
        loadComponent: () => import('./pages/glossaire/glossaire').then(m => m.Glossaire)
      },
      {
        path: 'actualites',
        loadComponent: () => import('./pages/actualite/actualite').then(m => m.Actualite)
      },
      {
        path: 'details-astre/:id',
        loadComponent: () => import('./pages/details-astre/details-astre').then(m => m.DetailsAstre)
      },
      {
        path: '**',
        redirectTo: ''
      }
];
