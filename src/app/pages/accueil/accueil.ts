import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'; // Ajoute Inject et PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Ajoute cet import
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { LocalisationSearch } from '../../components/localisation-search/localisation-search';
import { MapActualite } from '../../components/map-actualite/map-actualite';
import { WidgetMeteo } from '../../components/widget-meteo/widget-meteo';
import { MeteoService, MeteoData } from '../../services/meteo.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [NavBarComponent, LocalisationSearch, MapActualite, WidgetMeteo],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {

  meteo: MeteoData = {
    temperature: 0,
    condition: 'Chargement...',
    icone: 'bi-hourglass',
    bonneCondition: false
  };

  actualites = [
    {
      id: '1',
      titre: 'Éclipse lunaire visible ce soir',
      date: '10 Février',
      image: 'assets/img/eclipse.webp'
    },
    {
      id: '2',
      titre: 'Mars au plus proche de la Terre',
      date: '8 Février',
      image: 'assets/img/mars.webp'
    }
  ];

  constructor(
    private router: Router,
    private meteoService: MeteoService,
    @Inject(PLATFORM_ID) private platformId: Object // On injecte l'information sur la plateforme (Serveur ou Navigateur)
  ) {}

  ngOnInit() {
    // On vérifie si le code s'exécute dans le navigateur !
    if (isPlatformBrowser(this.platformId)) {
      this.chargerMeteo();
    } else {
      // Si on est sur le serveur (SSR), on ne fait rien pour éviter le crash (ETIMEDOUT)
      console.log('Rendu côté serveur : on attend le navigateur pour la météo.');
    }
  }

  chargerMeteo() {
    this.meteoService.getMeteoActuelle().subscribe({
      next: (donneesReelles) => {
        this.meteo = donneesReelles;
      },
      error: (erreur) => {
        console.error('Erreur lors de la récupération de la météo', erreur);
        this.meteo.condition = 'Erreur API';
        this.meteo.icone = 'bi-exclamation-triangle-fill';
      }
    });
  }

  onRecherche(ville: string) {
    this.router.navigate(['/vue-ciel'], {
      queryParams: { ville: ville }
    });
  }
}
