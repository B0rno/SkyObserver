import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-map-astre',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './map-astre.html',
  styleUrl: './map-astre.css',
})

export class MapAstre {
  @Input() id: string = '1';
  @Input() nom: string = 'Astre';
  @Input() description: string = 'Description';
  @Input() image: string = '';
}