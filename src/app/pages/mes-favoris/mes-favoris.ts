/**
 * Page "Mes Favoris"
 * Affiche la liste des planètes favorites de l'utilisateur connecté
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService, Favorite } from '../../services/favorite.service';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-mes-favoris',
  imports: [CommonModule, RouterLink, NavBarComponent],
  templateUrl: './mes-favoris.html',
  styleUrl: './mes-favoris.css',
})
export class MesFavoris implements OnInit {
  /**
   * État de chargement
   */
  loading = true;

  /**
   * Message d'erreur si la récupération des favoris échoue
   */
  errorMessage = '';

  constructor(
    public favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Récupérer les favoris au chargement du composant
   */
  ngOnInit() {
    this.loadFavorites();
  }

  /**
   * Charger la liste des favoris depuis le backend
   */
  loadFavorites() {
    this.loading = true;
    this.errorMessage = '';

    this.favoriteService.getFavorites().subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges(); // Force la détection de changements
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des favoris';
        this.cdr.detectChanges(); // Force la détection de changements
        console.error('Erreur:', error);
      }
    });
  }

  /**
   * Supprimer un favori
   * @param favorite Favori à supprimer
   */
  removeFavorite(favorite: Favorite) {
    if (!confirm(`Retirer ${favorite.planetName} de vos favoris ?`)) {
      return;
    }

    this.favoriteService.deleteFavorite(favorite.id).subscribe({
      next: () => {
        // Le signal est automatiquement mis à jour par le service
        console.log(`${favorite.planetName} retiré des favoris`);
      },
      error: (error) => {
        alert('Erreur lors de la suppression du favori');
        console.error('Erreur:', error);
      }
    });
  }

}
