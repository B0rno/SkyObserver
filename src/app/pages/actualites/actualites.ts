import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';
import { MapActualite } from '../../components/map-actualite/map-actualite';
import { ActuService, Actu } from '../../services/actu.service';

@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [NavBarComponent, MapActualite],
  templateUrl: './actualites.html',
  styleUrl: './actualites.css',
})


export class Actualites implements OnInit {

  // 3. On crée un tableau vide qui va recevoir les vraies données
  listeActualites: Actu[] = [];

  constructor(private actuService: ActuService) {}

  ngOnInit() {
    this.actuService.getDernieresActus(10).subscribe({
      next: (actusReelles) => {
        this.listeActualites = actusReelles;
      },
      error: (err) => console.error("Erreur de chargement des actus", err)
    });
  }
}
