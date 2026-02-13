import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-details-actualite',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './details-actualite.html',
  styleUrl: './details-actualite.css',
})
export class DetailsActualite implements OnInit {
  actualiteId = signal('');
  
  // Données mockées
  actualite = signal({
    titre: 'Éclipse lunaire totale visible en France',
    description: 'Une éclipse lunaire exceptionnelle sera visible cette nuit. Ne manquez pas ce spectacle rare !',
    contenu: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    date: '10 Février 2025',
    image: 'assets/img/eclipse.webp'
  });

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.actualiteId.set(params['id']);
    });
  }
}