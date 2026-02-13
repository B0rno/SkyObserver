import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapAstre } from '../../components/map-astre/map-astre';

@Component({
  selector: 'app-glossaire',
  standalone: true,
  imports: [FormsModule, NavBarComponent, MapAstre],
  templateUrl: './glossaire.html',
  styleUrl: './glossaire.css',
})
export class Glossaire {
  recherche = '';

  // Données mockées - tous les astres
  tousLesAstres = signal([
    { id: 'soleil', nom: 'Soleil', description: 'Notre étoile', image: '' },
    { id: 'mercure', nom: 'Mercure', description: 'Planète la plus proche du Soleil', image: '' },
    { id: 'venus', nom: 'Vénus', description: 'Étoile du berger', image: '' },
    { id: 'terre', nom: 'Terre', description: 'Notre planète', image: '' },
    { id: 'lune', nom: 'Lune', description: 'Satellite naturel de la Terre', image: '' },
    { id: 'mars', nom: 'Mars', description: 'Planète rouge', image: '' },
    { id: 'jupiter', nom: 'Jupiter', description: 'Plus grande planète', image: '' },
    { id: 'saturne', nom: 'Saturne', description: 'Planète aux anneaux', image: '' },
    { id: 'uranus', nom: 'Uranus', description: 'Géante de glace', image: '' },
    { id: 'neptune', nom: 'Neptune', description: 'Planète la plus éloignée', image: '' },
    { id: 'pluton', nom: 'Pluton', description: 'Planète naine', image: '' },
    { id: 'ceres', nom: 'Cérès', description: 'Planète naine', image: '' },
  ]);

  astresFiltres = computed(() => {
    const query = this.recherche.toLowerCase();
    if (!query) return this.tousLesAstres();
    return this.tousLesAstres().filter(a => 
      a.nom.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query)
    );
  });
}