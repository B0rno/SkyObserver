import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapAstre } from '../../components/map-astre/map-astre';
import { InfosAstresService } from '../../services/infos-astres.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-glossaire',
  standalone: true,
  imports: [FormsModule, NavBarComponent, MapAstre],
  templateUrl: './glossaire.html',
  styleUrl: './glossaire.css',
})
export class Glossaire {
  recherche = '';
  
  // Nouveau signal : contiendra les infos de l'API (ou null si la modale est fermée)
  astreSelectionne = signal<any>(null);

  constructor(private infosAstresService: InfosAstresService) {}

  tousLesAstres = signal([
    { id: 'soleil', nom: 'Sun', description: 'Notre étoile', image: '/assets/img/soleil.jpg' },
    { id: 'mercure', nom: 'Mercury', description: 'Planète la plus proche du Soleil', image: '/assets/img/mercure.jpg' },
    { id: 'venus', nom: 'Venus', description: 'Étoile du berger', image: '/assets/img/venus.jpg' },
    { id: 'terre', nom: 'Earth', description: 'Notre planète', image: '/assets/img/terre.jpg' },
    { id: 'lune', nom: 'Moon', description: 'Satellite naturel de la Terre', image: '/assets/img/lune.jpg' },
    { id: 'mars', nom: 'Mars', description: 'Planète rouge', image: '/assets/img/mars.jpg' },
    { id: 'jupiter', nom: 'Jupiter', description: 'Plus grande planète', image: '/assets/img/jupiter.jpg' },
    { id: 'saturne', nom: 'Saturn', description: 'Planète aux anneaux', image: '/assets/img/saturne.jpg' },
    { id: 'uranus', nom: 'Uranus', description: 'Géante de glace', image: '/assets/img/uranus.jpg' },
    { id: 'neptune', nom: 'Neptune', description: 'Planète la plus éloignée', image: '/assets/img/neptune.png' }, 
    { id: 'pluton', nom: 'Pluto', description: 'Planète naine', image: '/assets/img/pluton.jpg' },
  ]);

  astresFiltres = computed(() => {
    const query = this.recherche.toLowerCase();
    if (!query) return this.tousLesAstres();
    return this.tousLesAstres().filter(a =>
      a.nom.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query)
    );
  });

  // Quand on clique sur une planète
  afficherInfos(idAstre: string) {
    this.infosAstresService.getInfosAstre(idAstre).subscribe({
      next: (donnees) => {
        // On remplit le signal avec les infos reçues, ce qui va ouvrir la modale !
        this.astreSelectionne.set(donnees); 
      },
      error: (err) => console.error("Erreur de récupération des infos", err)
    });
  }

  // Quand on clique sur la croix
  fermerModal() {
    this.astreSelectionne.set(null); // On vide le signal pour cacher la modale
  }
}