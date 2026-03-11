import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapAstre } from '../../components/map-astre/map-astre';
import { ImageNasa } from '../../services/image-nasa';

/**
 * Page glossaire des astres
 *
 * Affiche un catalogue d'astres (planètes, satellites, planètes naines)
 * avec :
 * - Barre de recherche en temps réel
 * - Images récupérées depuis l'API NASA
 * - Filtrage dynamique par nom ou description
 *
 * Utilise les signals Angular pour la réactivité
 */
@Component({
  selector: 'app-glossaire',
  standalone: true,
  imports: [FormsModule, NavBarComponent, MapAstre],
  templateUrl: './glossaire.html',
  styleUrl: './glossaire.css',
})
export class Glossaire {

  /**
   * @param imageNasa - Service pour récupérer les images depuis l'API NASA
   */
  constructor(private imageNasa:ImageNasa){
    this.loadImages();
  }

  /** Terme de recherche saisi par l'utilisateur (two-way binding avec ngModel) */
  recherche = '';

  /**
   * Signal contenant tous les astres du glossaire
   * Les images sont chargées dynamiquement depuis l'API NASA au démarrage
   */
  tousLesAstres = signal([
    { id: 'soleil', nom: 'Sun', description: 'Notre étoile', image: '' },
    { id: 'mercure', nom: 'Mercury', description: 'Planète la plus proche du Soleil', image: '' },
    { id: 'venus', nom: 'Venus', description: 'Étoile du berger', image: '' },
    { id: 'terre', nom: 'Earth', description: 'Notre planète', image: '' },
    { id: 'lune', nom: 'Moon', description: 'Satellite naturel de la Terre', image: '' },
    { id: 'mars', nom: 'Mars', description: 'Planète rouge', image: '' },
    { id: 'jupiter', nom: 'Jupiter', description: 'Plus grande planète', image: '' },
    { id: 'saturne', nom: 'Saturn', description: 'Planète aux anneaux', image: '' },
    { id: 'uranus', nom: 'Uranus', description: 'Géante de glace', image: '' },
    { id: 'neptune', nom: 'Neptune', description: 'Planète la plus éloignée', image: '' },
    { id: 'pluton', nom: 'Pluto', description: 'Planète naine', image: '' },
    { id: 'ceres', nom: 'Ceres', description: 'Planète naine', image: '' },
  ]);

  /**
   * Signal computed qui filtre automatiquement les astres selon la recherche
   * Se recalcule automatiquement quand `recherche` ou `tousLesAstres` change
   *
   * Filtre par :
   * - Nom de l'astre (insensible à la casse)
   * - Description de l'astre (insensible à la casse)
   *
   * @returns Liste filtrée des astres correspondant à la recherche
   */
  astresFiltres = computed(() => {
    const query = this.recherche.toLowerCase();
    if (!query) return this.tousLesAstres();
    return this.tousLesAstres().filter(a =>
      a.nom.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query)
    );
  });

  /**
   * Charge les images de tous les astres depuis l'API NASA
   * Appelé automatiquement lors de la construction du composant
   *
   * Pour chaque astre, effectue une recherche d'image par nom
   * et met à jour le signal tousLesAstres avec l'URL de l'image
   */
  loadImages() {
    this.tousLesAstres().forEach((astre, index) => {
      this.imageNasa.searchImage(astre.nom)
        .subscribe(imageUrl => {
          // Mise à jour immutable du signal avec spread operator
          this.tousLesAstres.update(astres => {
            astres[index].image = imageUrl;
            return [...astres]; // Crée un nouveau tableau pour déclencher la réactivité
          });

        });
    });
  }
}