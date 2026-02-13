import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapAstre } from '../../components/map-astre/map-astre';
import { WidgetMeteo } from '../../components/widget-meteo/widget-meteo';

@Component({
  selector: 'app-vue-ciel',
  standalone: true,
  imports: [CommonModule, NavBarComponent, MapAstre, WidgetMeteo],
  templateUrl: './vue-ciel.html',
  styleUrl: './vue-ciel.css',
})

export class VueCiel implements OnInit {
  ville = signal('Le Mans');
  
  // Données mockées météo
  meteo = {
    temperature: 18,
    condition: 'Ensoleillé',
    icone: 'bi-sun-fill',
    bonneCondition: true
  };

  // Données mockées astres visibles
  astresVisibles = [
    { id: 'soleil', nom: 'Soleil', description: 'Notre étoile', image: '' },
    { id: 'lune', nom: 'Lune', description: 'Satellite naturel', image: '' },
    { id: 'mars', nom: 'Mars', description: 'Planète rouge', image: '' },
    { id: 'venus', nom: 'Vénus', description: 'Étoile du berger', image: '' },
    { id: 'jupiter', nom: 'Jupiter', description: 'Géante gazeuse', image: '' },
    { id: 'saturne', nom: 'Saturne', description: 'Planète aux anneaux', image: '' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['ville']) {
        this.ville.set(params['ville']);
      }
    });
  }

  sauvegarder() {
    alert('Observation sauvegardée !');
  }
}