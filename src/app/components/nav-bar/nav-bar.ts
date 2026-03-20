import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

/**
 * Composant de barre de navigation
 *
 * Barre de navigation fixe en haut de la page avec :
 * - Logo cliquable redirigeant vers l'accueil
 * - Menu de navigation avec liens vers les différentes pages
 * - Détection du scroll pour changer le style de la navbar
 * - Menu mobile responsive avec toggle
 *
 * @example
 * <app-nav-bar></app-nav-bar>
 */
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBarComponent {
  /**
   * État du menu mobile (ouvert/fermé)
   * Utilisé pour afficher/masquer le menu en version mobile
   */
  menuOuvert = signal<boolean>(false);

  /**
   * Indique si l'utilisateur a scrollé la page
   * Utilisé pour appliquer un style différent à la navbar après un certain scroll
   */
  scrolled = signal<boolean>(false);

  /**
   * Constructeur avec injection du service d'authentification
   */
  constructor(public authService: AuthService) {}

  /**
   * Écouteur d'événement de scroll de la fenêtre
   * Détecte quand l'utilisateur scroll au-delà de 50px pour changer le style de la navbar
   * @HostListener permet d'écouter les événements du DOM directement dans le composant
   */
  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  /**
   * Bascule l'état d'ouverture/fermeture du menu mobile
   * Inverse la valeur du signal menuOuvert (true -> false, false -> true)
   */
  toggleMenu() {
    this.menuOuvert.update((v: boolean) => !v);
  }

  /**
   * Déconnexion de l'utilisateur
   * Appelle la méthode logout du service d'authentification
   */
  logout() {
    this.authService.logout();
  }
}