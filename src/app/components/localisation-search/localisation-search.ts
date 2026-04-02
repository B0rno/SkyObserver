import { Component, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GeocodingService } from '../../services/geocoding.service';

/**
 * Composant de recherche de localisation avec autocomplétion
 *
 * Ce composant permet à l'utilisateur de rechercher une ville et affiche
 * des suggestions en temps réel pendant la saisie grâce à l'API Open-Meteo.
 */
@Component({
  selector: 'app-localisation-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './localisation-search.html',
  styleUrl: './localisation-search.css',
})
export class LocalisationSearch implements OnInit, OnDestroy {
  @Output() recherche = new EventEmitter<string>();

  /** Valeur actuelle du champ de recherche */
  villeRecherche = '';
  
  /** Liste des suggestions renvoyées par l'API */
  suggestions = signal<string[]>([]);

  /** Le "tuyau" dans lequel on va pousser le texte tapé par l'utilisateur */
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(private geocodingService: GeocodingService) {}

  ngOnInit() {
    // On écoute ce qui passe dans le tuyau de recherche
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300), // Magie 1: On attend 300ms après que l'utilisateur ait fini de taper
      distinctUntilChanged(), // Magie 2: On ignore si le texte est le même qu'il y a 300ms
      switchMap((query) => this.geocodingService.rechercherVilles(query)) // Magie 3: On annule l'ancienne requête API si une nouvelle arrive
    ).subscribe({
      next: (resultats) => {
        this.suggestions.set(resultats); // On met à jour l'affichage avec les villes trouvées
      },
      error: (err) => {
        console.error('Erreur lors de la recherche', err);
        this.suggestions.set([]);
      }
    });
  }

  ngOnDestroy() {
    // On nettoie la mémoire quand le composant est détruit
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  /**
   * Appelé à chaque fois que l'utilisateur tape une lettre
   */
  onInput() {
    // On pousse le nouveau texte dans le tuyau
    this.searchSubject.next(this.villeRecherche);
  }

  /**
   * Appelé quand l'utilisateur clique sur une ville dans la liste
   */
  selectSuggestion(villeComplete: string) {
    // L'API renvoie "Paris, Île-de-France, France". 
    // On ne garde que "Paris" (avant la première virgule) pour l'afficher proprement
    const nomVille = villeComplete.split(',')[0];
    
    this.villeRecherche = nomVille;
    this.suggestions.set([]); // On vide la liste pour la cacher
    this.onSubmit(); // On lance la recherche !
  }

  /**
   * Méthode appelée lors de la soumission du formulaire
   */
  onSubmit() {
    if (this.villeRecherche && this.villeRecherche.trim() !== '') {
      this.recherche.emit(this.villeRecherche.trim());
      this.suggestions.set([]); // On s'assure que la liste est fermée
    }
  }
}