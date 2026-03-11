import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapActualite } from '../../components/map-actualite/map-actualite';
import { ActuService, Actu } from '../../services/actu.service';

/**
 * Page d'affichage de toutes les actualités astronomiques
 *
 * Affiche une grille de cartes d'actualités récupérées depuis
 * l'API Spaceflight News.
 *
 * Utilise ChangeDetectorRef pour forcer la détection de changements
 * après le chargement des données depuis l'API.
 */
@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [NavBarComponent, MapActualite],
  templateUrl: './actualites.html',
  styleUrl: './actualites.css',
})
export class Actualites implements OnInit {

  /** Liste des actualités astronomiques à afficher */
  listeActualites: Actu[] = [];

  /**
   * @param actuService - Service pour récupérer les actualités depuis l'API
   * @param cdr - ChangeDetectorRef pour forcer la détection de changements Angular
   */
  constructor(
    private actuService: ActuService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Initialisation du composant
   * Charge les actualités depuis l'API Spaceflight News
   * et force la mise à jour de l'affichage avec detectChanges()
   */
  ngOnInit() {
    this.actuService.getDernieresActus().subscribe({
      next: (actusReelles) => {
        this.listeActualites = actusReelles;

        // Force Angular à mettre à jour l'écran immédiatement
        // Nécessaire dans certains cas pour garantir le rendu correct des données
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur de chargement des actus", err)
    });
  }
}
