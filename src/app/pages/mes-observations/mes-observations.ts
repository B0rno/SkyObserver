/**
 * Page "Mes Observations"
 * Affiche la liste des observations astronomiques de l'utilisateur connecté
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ObservationService, Observation } from '../../services/observation.service';

@Component({
  selector: 'app-mes-observations',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mes-observations.html',
  styleUrl: './mes-observations.css',
})
export class MesObservations implements OnInit {
  /**
   * État de chargement
   */
  loading = true;

  /**
   * Message d'erreur si la récupération des observations échoue
   */
  errorMessage = '';

  /**
   * Filtre de recherche par planète ou lieu
   */
  searchFilter = '';

  constructor(
    public observationService: ObservationService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Récupérer les observations au chargement du composant
   */
  ngOnInit() {
    // Vérifier si les observations sont déjà chargées par auth.service
    if (this.observationService.observations().length > 0) {
      // Observations déjà présentes, pas besoin de recharger
      this.loading = false;
      this.cdr.detectChanges();
    } else {
      // Charger les observations si elles ne sont pas encore là
      this.loadObservations();
    }
  }

  /**
   * Charger la liste des observations depuis le backend
   */
  loadObservations() {
    this.loading = true;
    this.errorMessage = '';

    this.observationService.getObservations().subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des observations';
        this.cdr.detectChanges();
        console.error('Erreur:', error);
      }
    });
  }

  /**
   * Supprimer une observation
   * @param observation Observation à supprimer
   */
  deleteObservation(observation: Observation) {
    if (!confirm(`Supprimer l'observation de ${observation.planetName} du ${this.formatDate(observation.date)} ?`)) {
      return;
    }

    this.observationService.deleteObservation(observation.id).subscribe({
      next: () => {
        console.log(`Observation supprimée`);
      },
      error: (error) => {
        alert('Erreur lors de la suppression de l\'observation');
        console.error('Erreur:', error);
      }
    });
  }

  /**
   * Filtrer les observations par nom de planète ou lieu
   */
  get filteredObservations(): Observation[] {
    if (!this.searchFilter) {
      return this.observationService.observations();
    }
    const filter = this.searchFilter.toLowerCase();
    return this.observationService.observations().filter(obs =>
      obs.planetName.toLowerCase().includes(filter) ||
      obs.location.toLowerCase().includes(filter)
    );
  }

  /**
   * Formater une date au format français
   * @param dateString Date au format ISO
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
