import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { LocalisationSearch } from '../../components/localisation-search/localisation-search';
import { MapActualite } from '../../components/map-actualite/map-actualite';
import { WidgetMeteo } from '../../components/widget-meteo/widget-meteo';
import { MeteoService, MeteoData } from '../../services/meteo.service';
import { ActuService, Actu } from '../../services/actu.service';

/**
 * Page d'accueil de l'application SkyObserver
 *
 * Page principale affichant :
 * - Barre de recherche de localisation
 * - Widget météo pour la ville sélectionnée
 * - Liste des dernières actualités astronomiques
 *
 */
@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [NavBarComponent, LocalisationSearch, MapActualite, WidgetMeteo],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {

  /** Ville actuellement sélectionnée pour afficher la météo */
  villeActuelle: string = 'Le Mans';

  /**
   * Données météo actuelles
   * Initialisées avec des valeurs par défaut (icône hourglass en attente)
   */
  meteo: MeteoData = {
    temperature: 0,
    icone: 'bi-hourglass',
    condition : '',
    bonneCondition: false
  };

  /** Liste des actualités astronomiques récupérées depuis l'API Spaceflight News */
  actualites: Actu[] = [];

  /**
   * @param router - Service de navigation Angular Router
   * @param meteoService - Service pour récupérer les données météo
   * @param actuService - Service pour récupérer les actualités astronomiques
   * @param platformId - Identifiant de la plateforme (browser/server) pour le SSR
   */
  constructor(
    private router: Router,
    private meteoService: MeteoService,
    private actuService: ActuService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Initialisation du composant
   * Charge la météo et les actualités uniquement côté client (isPlatformBrowser)
   * pour éviter les appels API inutiles lors du rendu serveur
   */
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Charger la météo pour la ville par défaut (Le Mans)
      this.chargerMeteo(this.villeActuelle);

      // Récupérer les 4 dernières actualités pour l'aperçu sur l'accueil
      this.actuService.getDernieresActus(4).subscribe({
        next: (actusReelles) => {
          this.actualites = actusReelles;
        },
        error: (err) => console.error("Erreur de chargement des actus", err)
      });
    }
  }

  /**
   * Charge les données météo pour une ville donnée
   * Affiche un état de chargement pendant la requête
   *
   * @param ville - Nom de la ville pour laquelle récupérer la météo
   */
  chargerMeteo(ville: string) {
    // Afficher un état de chargement
    this.meteo.condition = 'Recherche en cours...';
    this.meteo.icone = 'bi-hourglass-split';

    // Appel API pour récupérer la météo
    this.meteoService.getMeteoParVille(ville).subscribe({
      next: (donneesReelles) => {
        this.meteo = donneesReelles;
        this.villeActuelle = ville;
      },
      error: (erreur) => {
        console.error('Erreur météo', erreur);
        // Afficher un message d'erreur si la ville n'est pas trouvée
        this.meteo.condition = 'Ville introuvable';
        this.meteo.icone = 'bi-x-circle';
      }
    });
  }

  /**
   * Gestionnaire de l'événement de recherche de localisation
   * Appelé lorsqu'une ville est sélectionnée dans le composant LocalisationSearch
   *
   * Met à jour la météo et navigue vers la page des planètes visibles
   * en passant le nom de la ville en paramètre de requête
   *
   * @param villeTrouvee - Nom de la ville sélectionnée par l'utilisateur
   */
  onRecherche(villeTrouvee: string) {
    this.chargerMeteo(villeTrouvee);
    // Navigation vers la page des planètes visibles avec la ville en query param
    this.router.navigate(['/planetes-visibles'], { queryParams: { ville: villeTrouvee } });
  }

  /**
   * Navigue vers la page des actualités
   * Appelé lors du clic sur le bouton "Voir plus"
   *
   * Redirige l'utilisateur vers la page complète des actualités
   * qui affichera 12 actualités au lieu de 4
   */
  onVoirPlus(): void {
    this.router.navigate(['/actualites']);
  }
}