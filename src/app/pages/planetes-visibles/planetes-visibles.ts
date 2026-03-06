import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { GeocodingService, Coordonnees } from '../../services/geocoding.service';
import { AstronomyService, PlaneteVisible } from '../../services/astronomy.service';

@Component({
  selector: 'app-planetes-visibles',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './planetes-visibles.html',
  styleUrl: './planetes-visibles.css',
})
export class PlanetesVisibles implements OnInit {
  ville = signal<string>('');
  coordonnees = signal<Coordonnees | null>(null);
  planetes = signal<PlaneteVisible[]>([]);
  planetesOeilNu = signal<PlaneteVisible[]>([]);
  planetesTelescope = signal<PlaneteVisible[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private geocodingService: GeocodingService,
    private astronomyService: AstronomyService
  ) {}

  ngOnInit() {
    // Récupérer le nom de la ville depuis les paramètres de route
    this.route.queryParams.subscribe(params => {
      const villeParam = params['ville'];
      if (villeParam) {
        this.ville.set(villeParam);
        this.chargerPlanetes(villeParam);
      } else {
        this.error.set('Aucune ville spécifiée');
        this.loading.set(false);
      }
    });
  }

  chargerPlanetes(ville: string) {
    this.loading.set(true);
    this.error.set('');

    //Obtenir les coordonnées de la ville
    this.geocodingService.getCoordonnees(ville).subscribe({
      next: (coords) => {
        this.coordonnees.set(coords);

        //Calculer les planètes visibles
        const planetes = this.astronomyService.getPlanetesVisibles(coords.latitude, coords.longitude);
        this.planetes.set(planetes);

        // Séparer les planètes visibles à l'œil nu et au télescope
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

  getDirectionCardinal(azimuth: number): string {
    const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
    const index = Math.round(azimuth / 45) % 8;
    return directions[index];
  }

  formatHeure(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
