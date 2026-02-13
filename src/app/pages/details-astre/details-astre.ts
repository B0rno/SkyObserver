import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-details-astre',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './details-astre.html',
  styleUrl: './details-astre.css',
})
export class DetailsAstre implements OnInit {
  astreId = signal('');
  
  // Données mockées
  astre = signal({
    nom: 'Soleil',
    description: 'Le Soleil est l\'étoile du Système solaire. C\'est une étoile naine jaune de 4,6 milliards d\'années.',
    image: '',
    type: 'Étoile',
    distance: '149.6 millions km',
    rayon: '696 340 km',
    masse: '1.989 × 10^30 kg'
  });

  // Villes où l'astre est observable
  villesObservables = signal([
    { nom: 'Le Mans', description: '24 heures du Mans', image: '' },
    { nom: 'Nantes', description: 'Visible ce soir', image: '' },
    { nom: 'Angers', description: 'Conditions optimales', image: '' },
    { nom: 'Tours', description: 'Partiellement nuageux', image: '' },
    { nom: 'Paris', description: 'Visible à l\'aube', image: '' },
    { nom: 'Lyon', description: 'Ciel dégagé', image: '' },
  ]);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.astreId.set(params['id']);
      // Ici on chargera les vraies données plus tard
    });
  }
}