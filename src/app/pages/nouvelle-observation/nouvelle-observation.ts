/**
 * Page "Nouvelle Observation"
 * Formulaire de création d'une nouvelle observation astronomique
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ObservationService } from '../../services/observation.service';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-nouvelle-observation',
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './nouvelle-observation.html',
  styleUrl: './nouvelle-observation.css',
})
export class NouvelleObservation implements OnInit {
  /**
   * Formulaire réactif pour la création d'observation
   */
  observationForm!: FormGroup;

  /**
   * État de soumission du formulaire
   */
  isSubmitting = false;

  /**
   * Message d'erreur en cas d'échec
   */
  errorMessage = '';

  /**
   * Liste des planètes disponibles
   */
  planets = [
    { name: 'Mercure'},
    { name: 'Vénus'},
    { name: 'Mars'},
    { name: 'Jupiter'},
    { name: 'Saturne'},
    { name: 'Uranus'},
    { name: 'Neptune'},
    { name: 'Lune'}
  ];

  constructor(
    private fb: FormBuilder,
    private observationService: ObservationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialiser le formulaire avec validation
    this.observationForm = this.fb.group({
      planetName: ['', [Validators.required]],
      date: ['', [Validators.required]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      weather: [''],
      notes: [''],
      magnitude: [null],
      altitude: [null, [Validators.min(0), Validators.max(90)]],
      azimuth: [null, [Validators.min(0), Validators.max(360)]]
    });

    // Pré-remplir la date avec aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    this.observationForm.patchValue({ date: today });
  }

  /**
   * Soumettre le formulaire
   */
  onSubmit() {
    if (this.observationForm.invalid) {
      // Marquer tous les champs comme touched pour afficher les erreurs
      Object.keys(this.observationForm.controls).forEach(key => {
        this.observationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Préparer les données (convertir les valeurs vides en null)
    const formData = this.observationForm.value;
    const observationData = {
      planetName: formData.planetName,
      date: formData.date,
      location: formData.location,
      weather: formData.weather || undefined,
      notes: formData.notes || undefined,
      magnitude: formData.magnitude !== null && formData.magnitude !== '' ? Number(formData.magnitude) : undefined,
      altitude: formData.altitude !== null && formData.altitude !== '' ? Number(formData.altitude) : undefined,
      azimuth: formData.azimuth !== null && formData.azimuth !== '' ? Number(formData.azimuth) : undefined
    };

    this.observationService.createObservation(observationData).subscribe({
      next: () => {
        // Rediriger vers la page des observations
        this.router.navigate(['/mes-observations']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création de l\'observation';
        console.error('Erreur:', error);
      }
    });
  }

  /**
   * Annuler et retourner à la liste
   */
  onCancel() {
    this.router.navigate(['/mes-observations']);
  }

  /**
   * Vérifier si un champ est invalide et touché
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.observationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtenir le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const field = this.observationForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Ce champ est requis';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    if (field.errors['min']) return `Valeur minimale : ${field.errors['min'].min}`;
    if (field.errors['max']) return `Valeur maximale : ${field.errors['max'].max}`;

    return '';
  }
}
