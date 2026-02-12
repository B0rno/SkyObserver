import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-map-actualite',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './map-actualite.html',
  styleUrl: './map-actualite.css',
})
export class MapActualite {
  @Input() titre: string = 'Titre de l\'actualité';
  @Input() date: string = '12 Décembre';
  @Input() image: string = '';
  @Input() lien: string = '/actualites/1';
}