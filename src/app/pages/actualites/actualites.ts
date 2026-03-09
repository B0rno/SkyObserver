// 1. On ajoute ChangeDetectorRef dans les imports depuis @angular/core
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  listeActualites: Actu[] = [];


    // Pour afficher la page directement
    constructor(
    private actuService: ActuService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.actuService.getDernieresActus().subscribe({
      next: (actusReelles) => {
        this.listeActualites = actusReelles;

        // force Angular à mettre à jour l'ecran
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur de chargement des actus", err)
    });
  }
}
