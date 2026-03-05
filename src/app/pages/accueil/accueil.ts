import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { LocalisationSearch } from '../../components/localisation-search/localisation-search';
import { MapActualite } from '../../components/map-actualite/map-actualite';
import { WidgetMeteo } from '../../components/widget-meteo/widget-meteo';
import { MeteoService, MeteoData } from '../../services/meteo.service';

// 1. On importe le nouveau service d'actualités
import { ActuService, Actu } from '../../services/actu.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [NavBarComponent, LocalisationSearch, MapActualite, WidgetMeteo],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {

  villeActuelle: string = 'Paris';

  meteo: MeteoData = {
    temperature: 0,
    icone: 'bi-hourglass',
    condition : '',
    bonneCondition: false
  };

  // 2. On prépare un tableau vide que l'API va remplir
  actualites: Actu[] = [];

  constructor(
    private router: Router,
    private meteoService: MeteoService,
    private actuService: ActuService, // 3. On injecte le service ici
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // On lance la météo
      this.chargerMeteo(this.villeActuelle);

      // 4. On lance la récupération des actualités !
      this.actuService.getDernieresActus().subscribe({
        next: (actusReelles) => {
          this.actualites = actusReelles;
        },
        error: (err) => console.error("Erreur de chargement des actus", err)
      });
    }
  }

  chargerMeteo(ville: string) {
    this.meteo.condition = 'Recherche en cours...';
    this.meteo.icone = 'bi-hourglass-split';

    this.meteoService.getMeteoParVille(ville).subscribe({
      next: (donneesReelles) => {
        this.meteo = donneesReelles;
        this.villeActuelle = ville;
      },
      error: (erreur) => {
        console.error('Erreur météo', erreur);
        this.meteo.condition = 'Ville introuvable';
        this.meteo.icone = 'bi-x-circle';
      }
    });
  }

  onRecherche(villeTrouvee: string) {
    this.chargerMeteo(villeTrouvee);
  }

  onVoirPlus(): void {
    this.actuService.voirPlus();
    this.actuService.getDernieresActus().subscribe({
      next: (actusReelles) => {
        this.actualites = actusReelles;
      },
      error: (err) => console.error("Erreur de chargement des actus", err)
    });
  }
}
