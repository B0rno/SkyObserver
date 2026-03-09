import { Component, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Composant de recherche de localisation avec autocomplétion
 *
 * Ce composant permet à l'utilisateur de rechercher une ville et affiche
 * des suggestions en temps réel pendant la saisie.
 *
 * @example
 * <app-localisation-search (recherche)="onVilleSelectionnee($event)"></app-localisation-search>
 */
@Component({
  selector: 'app-localisation-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './localisation-search.html',
  styleUrl: './localisation-search.css',
})

export class LocalisationSearch {
  /**
   * Event émis lorsqu'une ville est sélectionnée (soit par soumission du formulaire, soit par clic sur une suggestion)
   * Émet le nom de la ville sélectionnée
   */
  @Output() recherche = new EventEmitter<string>();

  /** Valeur actuelle du champ de recherche  */
  villeRecherche = '';

  /** Signal contenant la liste des suggestions de villes filtrées selon la saisie de l'utilisateur */
  suggestions = signal<string[]>([]);

  /**
   * Méthode appelée à chaque frappe dans le champ de recherche
   * Filtre les suggestions en fonction de la saisie utilisateur
   *
   * Note: Actuellement utilise des données en dur pour la démo.
   * TODO: Remplacer par un appel à l'API de géocodage (Open-Meteo Geocoding)
   */
  onInput() {
    // N'afficher les suggestions que si au moins 2 caractères ont été saisis
    if (this.villeRecherche.length > 1) {
      // Liste de villes en dur pour la démo (à remplacer par l'API)
      this.suggestions.set([
        'Le Mans, France',
        'Lens, France',
        'Les Sables-d\'Olonne, France'
      ].filter(v => v.toLowerCase().includes(this.villeRecherche.toLowerCase())));
    } else {
      // Vider les suggestions si moins de 2 caractères
      this.suggestions.set([]);
    }
  }

  /**
   * Méthode appelée lors de la soumission du formulaire (clic sur le bouton ou touche Entrée)
   * Émet la ville recherchée au composant parent et ferme la liste des suggestions
   */
  onSubmit() {
    if (this.villeRecherche) {
      this.recherche.emit(this.villeRecherche);
      this.suggestions.set([]);
    }
  }

  /**
   * Méthode appelée lors du clic sur une suggestion
   * Remplit le champ de recherche, ferme les suggestions et émet la ville sélectionnée
   *
   * @param ville - Nom de la ville sélectionnée dans les suggestions
   */
  selectSuggestion(ville: string) {
    this.villeRecherche = ville;
    this.suggestions.set([]);
    this.recherche.emit(ville);
  }
}
