import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { LocalisationSearch } from '../../components/localisation-search/localisation-search';
import { MapActualite } from '../../components/map-actualite/map-actualite';
import { WidgetMeteo } from '../../components/widget-meteo/widget-meteo';

// On importe le service d'actualités
import { ActuService, Actu } from '../../services/actu.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [NavBarComponent, LocalisationSearch, MapActualite, WidgetMeteo],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {

  // Tableau vide que l'API va remplir avec les actus
  actualites: Actu[] = [];

  constructor(
    private router: Router,
    private actuService: ActuService
  ) {}

  ngOnInit() {
    // On lance la récupération des actualités !
    this.actuService.getDernieresActus(4).subscribe({
      next: (actusReelles) => {
        this.actualites = actusReelles;
      },
      error: (err) => console.error("Erreur de chargement des actus", err)
    });
  }

  onRecherche(villeTrouvee: string) {
    if (villeTrouvee) {
      // On ordonne à Angular d'aller sur la page "/vue-ciel" et on lui passe le nom de la ville dans l'URL
      this.router.navigate(['/vue-ciel'], { queryParams: { ville: villeTrouvee } });
    }
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
