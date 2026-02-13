import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapActualite } from '../../components/map-actualite/map-actualite';

@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [RouterLink,NavBarComponent, MapActualite],
  templateUrl: './actualites.html',
  styleUrl: './actualites.css',
})
export class Actualites {

  
  // Données mockées
  listeActualites = [
    {
      id: '1',
      titre: 'Éclipse lunaire totale visible en France',
      description: 'Une éclipse lunaire exceptionnelle sera visible cette nuit...',
      date: '10 Février',
      image: 'assets/img/eclipse.webp'
    },
    {
      id: '2',
      titre: 'Mars au plus proche de la Terre',
      description: 'La planète rouge n\'a jamais été aussi proche depuis 15 ans...',
      date: '8 Février',
      image: 'assets/img/mars.webp'
    },
    {
      id: '3',
      titre: 'Découverte d\'une nouvelle exoplanète',
      description: 'Les astronomes ont découvert une planète potentiellement habitable...',
      date: '5 Février',
      image: 'assets/img/exoplanete.webp'
    },
    {
      id: '4',
      titre: 'Pluie de météores des Perséides',
      description: 'Ne manquez pas ce spectacle céleste annuel...',
      date: '2 Février',
      image: 'assets/img/meteores.webp'
    },
    {
      id: '5',
      titre: 'La Station Spatiale visible ce soir',
      description: 'L\'ISS passera au-dessus de la France vers 21h...',
      date: '30 Janvier',
      image: 'assets/img/iss.webp'
    },
  ];
}