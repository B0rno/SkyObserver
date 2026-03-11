import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { InfosAstresService } from '../../services/infos-astres.service';
import { NavBarComponent } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-details-astre',
  standalone: true,
  imports: [NavBarComponent, CommonModule], 
  templateUrl: './details-astre.html',
  styleUrl: './details-astre.css'
})
export class DetailsAstre implements OnInit {
  astre = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private infosService: InfosAstresService
  ) {}

 ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // On force l'ID en minuscules pour éviter les erreurs CORS/404
      const idPropre = id.toLowerCase(); 

      this.infosService.getInfosAstre(idPropre).subscribe({
        next: (data: any) => {
          this.astre.set(data);
          console.log("Données reçues :", data);
        },
      });
    }
  }
}