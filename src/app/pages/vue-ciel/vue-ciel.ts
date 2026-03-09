// 1. On ajoute Inject et PLATFORM_ID
import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// 2. On importe isPlatformBrowser
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapAstre } from '../../components/map-astre/map-astre';
import { WidgetMeteo } from '../../components/widget-meteo/widget-meteo';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-vue-ciel',
  standalone: true,
  imports: [CommonModule, NavBarComponent, MapAstre, WidgetMeteo, HttpClientModule],
  templateUrl: './vue-ciel.html',
  styleUrl: './vue-ciel.css',
})
export class VueCiel implements OnInit {
  ville = signal('');
  lat = '';
  lon = '';

  astresVisibles = [
    { id: 'soleil', nom: 'Soleil', description: 'Notre étoile', image: '' },
    { id: 'lune', nom: 'Lune', description: 'Satellite naturel', image: '' },
    { id: 'mars', nom: 'Mars', description: 'Planète rouge', image: '' },
    { id: 'venus', nom: 'Vénus', description: 'Étoile du berger', image: '' },
    { id: 'jupiter', nom: 'Jupiter', description: 'Géante gazeuse', image: '' },
    { id: 'saturne', nom: 'Saturne', description: 'Planète aux anneaux', image: '' },
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    // 3. On injecte l'outil qui permet de savoir où on est (Serveur ou Navigateur)
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['ville']) {
        this.ville.set(params['ville']);

        if (!params['lat'] || !params['lon']) {
          // 4. ON PROTÈGE L'APPEL ICI :
          // Si on est bien dans le navigateur web (Chrome/Firefox), on lance la requête
          if (isPlatformBrowser(this.platformId)) {
            this.trouverCoordonneesGPS(params['ville']);
          }
        }
      }

      if (params['lat'] && params['lon']) {
        this.lat = params['lat'];
        this.lon = params['lon'];
      }
    });
  }

  trouverCoordonneesGPS(nomComplet: string) {
    const nomRecherche = nomComplet.split(',')[0].trim();
    const urlGeocodage = `https://geocoding-api.open-meteo.com/v1/search?name=${nomRecherche}&count=1&language=fr`;

    this.http.get<any>(urlGeocodage).subscribe({
      next: (reponse) => {
        if (reponse.results && reponse.results.length > 0) {
          this.lat = reponse.results[0].latitude;
          this.lon = reponse.results[0].longitude;
        }
      },
      error: (err) => console.error("Impossible de trouver les GPS de la ville", err)
    });
  }

  sauvegarder() {
    alert('Observation sauvegardée !');
  }
}
