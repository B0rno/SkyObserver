import { Component, signal } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapAstre } from '../../components/map-astre/map-astre';
import { InfosAstresService } from '../../services/infos-astres.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-glossaire',
  standalone: true,
  imports: [NavBarComponent, MapAstre],
  templateUrl: './glossaire.html',
  styleUrl: './glossaire.css',
})
export class Glossaire {
  
  astreSelectionne = signal<any>(null);

  constructor(private infosAstresService: InfosAstresService) {}

  tousLesAstres = signal([
    { id: 'soleil', nom: 'Soleil', image: '/assets/img/soleil.jpg' },
    { id: 'mercure', nom: 'Mercure', image: '/assets/img/mercure.jpg' },
    { id: 'venus', nom: 'Venus', image: '/assets/img/venus.jpg' },
    { id: 'terre', nom: 'Terre', image: '/assets/img/terre.jpg' },
    { id: 'lune', nom: 'Lune', image: '/assets/img/lune.jpg' },
    { id: 'mars', nom: 'Mars', image: '/assets/img/mars.jpg' },
    { id: 'jupiter', nom: 'Jupiter', image: '/assets/img/jupiter.jpg' },
    { id: 'saturne', nom: 'Saturne', image: '/assets/img/saturne.jpg' },
    { id: 'uranus', nom: 'Uranus', image: '/assets/img/uranus.jpg' },
    { id: 'neptune', nom: 'Neptune', image: '/assets/img/neptune.png' }, 
    { id: 'pluton', nom: 'Pluton', image: '/assets/img/pluton.jpg' },
  ]);

  // Quand on clique sur une planète
  afficherInfos(idAstre: string) {
    this.infosAstresService.getInfosAstre(idAstre).subscribe({
      next: (donnees) => {
        this.astreSelectionne.set(donnees); 
      },
      error: (err) => console.error("Erreur de récupération des infos", err)
    });
  }

  fermerModal() {
    this.astreSelectionne.set(null);
  }
}