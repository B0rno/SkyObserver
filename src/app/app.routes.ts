import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/accueil/accueil').then(m => m.Accueil)
  },
  {
    path: 'glossaire',
    loadComponent: () => import('./pages/glossaire/glossaire').then(m => m.Glossaire)
  },
  {
    path: 'actualites',
    loadComponent: () => import('./pages/actualites/actualites').then(m => m.Actualites)
  },
  {
    path: 'details-astre/:id',
    loadComponent: () => import('./pages/details-astre/details-astre').then(m => m.DetailsAstre)
  },
  {
    path: 'planetes-visibles',
    loadComponent: () => import('./pages/planetes-visibles/planetes-visibles').then(m => m.PlanetesVisibles)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'mes-favoris',
    loadComponent: () => import('./pages/mes-favoris/mes-favoris').then(m => m.MesFavoris),
    canActivate: [authGuard]
  },
  {
    path: 'mes-observations',
    loadComponent: () => import('./pages/mes-observations/mes-observations').then(m => m.MesObservations),
    canActivate: [authGuard]
  },
  {
    path: 'nouvelle-observation',
    loadComponent: () => import('./pages/nouvelle-observation/nouvelle-observation').then(m => m.NouvelleObservation),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];