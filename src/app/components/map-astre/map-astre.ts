import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

/**
 * Composant de carte d'astre (planète, lune, etc.)
 *
 * Affiche un astre sous forme de carte cliquable avec image, nom et description.
 * Redirige vers la page de détails de l'astre lors du clic.
 * Permet d'ajouter/retirer l'astre des favoris (si connecté).
 *
 * @example
 * <app-map-astre
 *   [id]="'mars'"
 *   [nom]="'Mars'"
 *   [description]="'La planète rouge'"
 *   [image]="'https://example.com/mars.jpg'">
 * </app-map-astre>
 */
@Component({
  selector: 'app-map-astre',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './map-astre.html',
  styleUrl: './map-astre.css',
})

export class MapAstre {
  /** Identifiant unique de l'astre utilisé pour la navigation vers la page de détails */
  @Input() id: string = '1';

  /** Nom de l'astre (ex: "Mars", "Jupiter", "Lune") */
  @Input() nom: string = 'Astre';

  /** Description courte de l'astre affichée dans la carte */
  @Input() description: string = 'Description';

  /** URL de l'image de l'astre (optionnelle - affiche un placeholder si vide) */
  @Input() image: string = '';

  constructor(
    public favoriteService: FavoriteService,
    public authService: AuthService
  ) {}

  /**
   * Vérifier si cette planète est dans les favoris
   */
  isFavorite(): boolean {
    return this.favoriteService.isFavoriteLocal(this.nom);
  }

  /**
   * Ajouter ou retirer la planète des favoris
   * @param event Événement de clic pour empêcher la redirection
   */
  toggleFavorite(event: Event): void {
    // Empêcher la redirection vers la page de détails
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.isAuthenticated()) {
      alert('Veuillez vous connecter pour ajouter des favoris');
      return;
    }

    if (this.isFavorite()) {
      // Retirer des favoris
      const favoriteId = this.favoriteService.getFavoriteIdByPlanetName(this.nom);
      if (favoriteId) {
        this.favoriteService.deleteFavorite(favoriteId).subscribe({
          next: () => {
            console.log(`${this.nom} retiré des favoris`);
          },
          error: (error) => {
            alert('Erreur lors de la suppression du favori');
            console.error('Erreur:', error);
          }
        });
      }
    } else {
      // Ajouter aux favoris
      this.favoriteService.addFavorite(this.nom).subscribe({
        next: () => {
          console.log(`${this.nom} ajouté aux favoris`);
        },
        error: (error) => {
          if (error.status === 400) {
            alert('Cette planète est déjà dans vos favoris');
          } else {
            alert('Erreur lors de l\'ajout du favori');
          }
          console.error('Erreur:', error);
        }
      });
    }
  }
}