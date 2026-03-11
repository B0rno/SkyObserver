import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Composant widget météo pour l'observation astronomique
 *
 * Affiche les conditions météorologiques actuelles et indique si elles sont favorables
 * à l'observation astronomique (ciel dégagé, bonne visibilité, etc.).
 *
 * @example
 * <app-widget-meteo
 *   [ville]="'Paris'"
 *   [temperature]="18"
 *   [condition]="'Ciel dégagé'"
 *   [icone]="'bi-sun-fill'"
 *   [bonneCondition]="true">
 * </app-widget-meteo>
 */
@Component({
  selector: 'app-widget-meteo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-meteo.html',
  styleUrl: './widget-meteo.css',
})
export class WidgetMeteo {
  /** Nom de la ville pour laquelle afficher la météo */
  @Input() ville: string = 'Paris';

  /** Température actuelle en degrés Celsius */
  @Input() temperature: number = 20;

  /** Description de la condition météo (ex: "Ensoleillé", "Nuageux", "Pluvieux") */
  @Input() condition: string = 'Ensoleillé';

  /** Classe d'icône Bootstrap Icons représentant la météo (ex: "bi-sun-fill", "bi-cloud-fill") */
  @Input() icone: string = 'bi-sun-fill';

  /**
   * Indique si les conditions météo sont favorables à l'observation astronomique
   * true = bonnes conditions (ciel dégagé), false = conditions défavorables (nuages, pluie)
   */
  @Input() bonneCondition: boolean = true;
}
