import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Composant de carte d'astre (planète, lune, etc.)
 *
 * Affiche un astre sous forme de carte cliquable avec image, nom et description.
 * Redirige vers la page de détails de l'astre lors du clic.
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
  imports: [RouterLink],
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
}