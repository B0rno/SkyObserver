import { Component, OnInit, signal, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { GeocodingService, Coordonnees } from '../../services/geocoding.service';
import { AstronomyService, PlaneteVisible } from '../../services/astronomy.service';
import { WidgetMeteo } from '../../components/widget-meteo/widget-meteo';
import { MeteoService, MeteoData } from '../../services/meteo.service';


/**
 * Page d'affichage des planètes visibles
 *
 * Affiche la liste des planètes et astres visibles depuis une ville donnée
 * en fonction de la date et heure actuelles.
 *
 * Fonctionnalités :
 * - Géocodage de la ville pour obtenir les coordonnées GPS
 * - Calculs astronomiques pour déterminer les planètes visibles
 * - Séparation entre visibilité à l'œil nu et au télescope
 * - Affichage des informations détaillées (altitude, azimut, heures de lever/coucher)
 *
 * Récupère le nom de la ville depuis les query parameters de la route
 */
@Component({
  selector: 'app-planetes-visibles',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink, WidgetMeteo],
  templateUrl: './planetes-visibles.html',
  styleUrl: './planetes-visibles.css',
})
export class PlanetesVisibles implements OnInit {
  /** Nom de la ville pour laquelle calculer la visibilité des planètes */
  ville = signal<string>('');

  /** Coordonnées GPS (latitude, longitude, altitude) de la ville */
  coordonnees = signal<Coordonnees | null>(null);

  /** Liste complète de toutes les planètes visibles au-dessus de l'horizon */
  planetes = signal<PlaneteVisible[]>([]);

  /** Planètes visibles à l'œil nu (magnitude < 6 et altitude > 10°) */
  planetesOeilNu = signal<PlaneteVisible[]>([]);

  /** Planètes visibles uniquement au télescope (magnitude > 6 ou altitude < 10°) */
  planetesTelescope = signal<PlaneteVisible[]>([]);

  /** Indique si les données sont en cours de chargement */
  loading = signal<boolean>(true);

  /** Message d'erreur à afficher en cas de problème */
  error = signal<string>('');

  /**
   * @param route - Service pour accéder aux paramètres de la route
    * @param meteoService - Service pour récupérer les données météo
   * @param geocodingService - Service pour convertir une ville en coordonnées GPS
   * @param astronomyService - Service pour calculer la visibilité des planètes
   */
  constructor(
    private route: ActivatedRoute,
    private meteoService: MeteoService,
    private geocodingService: GeocodingService,
    private astronomyService: AstronomyService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Initialisation du composant
   * Récupère le nom de la ville depuis les query parameters (?ville=...)
   * et lance le chargement des données astronomiques
   */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const villeParam = params['ville'];
      if (villeParam) {
        this.ville.set(villeParam);
        localStorage.setItem('derniere_ville', villeParam);
        this.chargerPlanetes(villeParam);
        this.chargerMeteo(villeParam);
      } else {
        this.error.set('Aucune ville spécifiée');
        this.loading.set(false);
      }
    });
  }

  /**
   * Charge les planètes visibles pour une ville donnée
   *
   * Processus en 2 étapes :
   * 1. Géocodage : convertit le nom de la ville en coordonnées GPS
   * 2. Calculs astronomiques : détermine les planètes visibles depuis ces coordonnées
   *
   * Sépare ensuite les résultats entre visibilité à l'œil nu et au télescope
   *
   * @param ville - Nom de la ville pour laquelle calculer la visibilité
   */
  chargerPlanetes(ville: string) {
    this.loading.set(true);
    this.error.set('');

    // Étape 1 : Obtenir les coordonnées GPS de la ville via l'API de géocodage
    this.geocodingService.getCoordonnees(ville).subscribe({
      next: (coords) => {
        this.coordonnees.set(coords);

        // Étape 2 : Calculer les planètes visibles avec l'altitude pour plus de précision
        const planetes = this.astronomyService.getPlanetesVisibles(coords.latitude, coords.longitude, coords.altitude);
        this.planetes.set(planetes);

        // Séparer les planètes selon leur mode de visibilité
        this.planetesOeilNu.set(planetes.filter(p => p.visibleOeilNu));
        this.planetesTelescope.set(planetes.filter(p => p.visibleTelescope));

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données:', err);
        this.error.set('Impossible de charger les données pour cette ville');
        this.loading.set(false);
      }
    });
  }

  /**
   * Convertit un azimut en degrés en direction cardinale
   *
   * Divise le cercle (360°) en 8 directions cardinales
   * 0° = Nord, 90° = Est, 180° = Sud, 270° = Ouest
   *
   * @param azimuth - Angle en degrés (0-360) depuis le Nord dans le sens horaire
   * @returns Direction cardinale (ex: "Nord", "Sud-Est", "Ouest")
   */
  getDirectionCardinal(azimuth: number): string {
    const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
    const index = Math.round(azimuth / 45) % 8;
    return directions[index];
  }

  /**
   * Formate une date en heure locale française (format HH:mm)
   *
   * @param date - Date à formater
   * @returns Heure formatée (ex: "14:30", "08:05")
   */
  formatHeure(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Enlève les accents et met en minuscules pour l'URL
   */
  formatIdURL(nom: string): string {
    return nom.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

    /**
   * Données météo actuelles
   * Initialisées avec des valeurs par défaut
   */
  meteo: MeteoData = {
    temperature: 0,
    icone: 'bi-hourglass',
    condition : '',
    bonneCondition: false
  };

  /** Nom de la ville pour laquelle afficher la météo (même que villeActuelle) */
  villeActuelle: string = this.ville() || 'Le Mans ';


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
        this.cdr.detectChanges(); // Forcer la détection de changement pour mettre à jour le widget météo
      },
      error: (erreur) => {
        console.error('Erreur météo', erreur);
        // Afficher un message d'erreur si la ville n'est pas trouvée
        this.meteo.condition = 'Ville introuvable';
        this.meteo.icone = 'bi-x-circle';
        this.cdr.detectChanges();
      }
    });
  }
}
