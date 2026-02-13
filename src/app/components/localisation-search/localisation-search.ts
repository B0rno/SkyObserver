import { Component, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-localisation-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './localisation-search.html',
  styleUrl: './localisation-search.css',
})

export class LocalisationSearch {
  @Output() recherche = new EventEmitter<string>();
  
  villeRecherche = '';
  suggestions = signal<string[]>([]);

  onInput() {
    // Simuler des suggestions (à remplacer par l'API plus tard)
    if (this.villeRecherche.length > 1) {
      this.suggestions.set([
        'Le Mans, France',
        'Lens, France',
        'Les Sables-d\'Olonne, France'
      ].filter(v => v.toLowerCase().includes(this.villeRecherche.toLowerCase())));
    } else {
      this.suggestions.set([]);
    }
  }

  onSubmit() {
    if (this.villeRecherche) {
      this.recherche.emit(this.villeRecherche);
      this.suggestions.set([]);
    }
  }

  selectSuggestion(ville: string) {
    this.villeRecherche = ville;
    this.suggestions.set([]);
    this.recherche.emit(ville);
  }
}
