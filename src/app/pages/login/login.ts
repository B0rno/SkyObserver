/**
 * Page de connexion
 * Permet à un utilisateur existant de se connecter avec son email et mot de passe
 */

import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  /**
   * Formulaire de connexion avec validation
   */
  loginForm: FormGroup;

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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Soumettre le formulaire de connexion
   */
  onSubmit(): void {
    // Vérifier que le formulaire est valide
    if (this.loginForm.invalid) {
      this.errorMessage.set('Veuillez remplir tous les champs correctement');
      return;
    }

    // Afficher le loader
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Récupérer les valeurs du formulaire
    const { email, password } = this.loginForm.value;

    // Appeler le service d'authentification
    this.authService.login(email, password).subscribe({
      next: () => {
        // Connexion réussie, rediriger vers l'accueil
        this.router.navigate(['/']);
      },
      error: (error) => {
        // Afficher l'erreur
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.error || 'Erreur lors de la connexion. Vérifiez vos identifiants.'
        );
      }
    });
  }

  /**
   * Getter pour accéder facilement aux contrôles du formulaire dans le template
   */
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
