import { Component, Input } from '@angular/core';

/**
 * Composant de carte d'actualité 
 *
 * Affiche une actualité sous forme de carte avec image, date, titre et lien vers l'article complet.
 * Composant de présentation réutilisable qui reçoit toutes ses données via @Input.
 *
 * @example
 * <app-map-actualite
 *   [titre]="'Nouvelle découverte astronomique'"
 *   [date]="'15 Mars'"
 *   [image]="'https://example.com/image.jpg'"
 *   [lien]="'https://example.com/article'">
 * </app-map-actualite>
 */
@Component({
  selector: 'app-map-actualite',
  standalone: true,
  imports: [],
  templateUrl: './map-actualite.html',
  styleUrl: './map-actualite.css',
})
export class MapActualite {
  /** Titre de l'actualité affiché dans la carte */
  @Input() titre: string = 'Titre de l\'actualité';

  /** Date de publication formatée (ex: "12 Décembre", "3 Mars") */
  @Input() date: string = '12 Décembre';

  /** URL de l'image d'illustration de l'actualité */
  @Input() image: string = '';

  /** URL de l'article complet (s'ouvre dans un nouvel onglet) */
  @Input() lien: string = '#';
}
