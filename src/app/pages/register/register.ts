/**
 * Page d'inscription
 * Permet à un nouvel utilisateur de créer un compte
 */

import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  /**
   * Formulaire d'inscription avec validation
   */
  registerForm: FormGroup;

  /**
   * Message d'erreur à afficher
   */
  errorMessage = signal<string>('');

  /**
   * Indicateur de chargement pendant la requête
   */
  isLoading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Créer le formulaire avec validation
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validateur personnalisé pour vérifier que les mots de passe correspondent
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Soumettre le formulaire d'inscription
   */
  onSubmit(): void {
    // Vérifier que le formulaire est valide
    if (this.registerForm.invalid) {
      this.errorMessage.set('Veuillez remplir tous les champs correctement');
      return;
    }

    // Afficher le loader
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Récupérer les valeurs du formulaire
    const { email, username, password } = this.registerForm.value;

    // Appeler le service d'authentification
    this.authService.register(email, username, password).subscribe({
      next: () => {
        // Inscription réussie, rediriger vers l'accueil
        this.router.navigate(['/']);
      },
      error: (error) => {
        // Afficher l'erreur
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.error || 'Erreur lors de l\'inscription. Veuillez réessayer.'
        );
      }
    });
  }

  /**
   * Getters pour accéder facilement aux contrôles du formulaire dans le template
   */
  get email() {
    return this.registerForm.get('email');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
