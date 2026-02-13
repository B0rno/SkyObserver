import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { LocalisationSearch } from '../../components/localisation-search/localisation-search';
import { MapActualite } from '../../components/map-actualite/map-actualite';
import { WidgetMeteo } from '../../components/widget-meteo/widget-meteo';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [NavBarComponent, LocalisationSearch, MapActualite, WidgetMeteo],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})

export class Accueil {
  // Données mockées pour la météo
  meteo = {
    temperature: 18,
    condition: 'Ensoleillé',
    icone: 'bi-sun-fill',
    bonneCondition: true
  };

  // Données mockées pour les actualités
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

  constructor(private router: Router) {}

  onRecherche(ville: string) {
    this.router.navigate(['/vue-ciel'], {
      queryParams: { ville: ville }
    });
  }
}