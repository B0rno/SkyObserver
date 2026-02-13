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
    { id: 'soleil', nom: 'Soleil', description: 'Notre étoile', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg' },
    { id: 'mercure', nom: 'Mercure', description: 'Planète la plus proche du Soleil', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mercury_in_color_-_Prockter07_centered.jpg/1920px-Mercury_in_color_-_Prockter07_centered.jpg' },
    { id: 'venus', nom: 'Vénus', description: 'Étoile du berger', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/PIA23791-Venus-RealAndEnhancedContrastViews-20200608_%28cropped%29.jpg' },
    { id: 'terre', nom: 'Terre', description: 'Notre planète', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/The_Blue_Marble_%285052124705%29.jpg/500px-The_Blue_Marble_%285052124705%29.jpg' },
    { id: 'lune', nom: 'Lune', description: 'Satellite naturel de la Terre', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1920px-FullMoon2010.jpg' },
    { id: 'mars', nom: 'Mars', description: 'Planète rouge', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1920px-OSIRIS_Mars_true_color.jpg' },
    { id: 'jupiter', nom: 'Jupiter', description: 'Plus grande planète', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Jupiter_OPAL_2024.png/500px-Jupiter_OPAL_2024.png' },
    { id: 'saturne', nom: 'Saturne', description: 'Planète aux anneaux', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Saturn_with_auroras.jpg' },
    { id: 'uranus', nom: 'Uranus', description: 'Géante de glace', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Uranus_Voyager2_color_calibrated.png/500px-Uranus_Voyager2_color_calibrated.png' },
    { id: 'neptune', nom: 'Neptune', description: 'Planète la plus éloignée', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Neptune_Voyager2_color_calibrated.png/500px-Neptune_Voyager2_color_calibrated.png' },
    { id: 'pluton', nom: 'Pluton', description: 'Planète naine', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/500px-Pluto_in_True_Color_-_High-Res.jpg' },
    { id: 'ceres', nom: 'Cérès', description: 'Planète naine', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg/500px-Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg' },
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