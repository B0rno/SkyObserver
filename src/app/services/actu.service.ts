import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Le contrat pour nos actualités
export interface Actu {
  id: string;
  titre: string;
  date: string;
  image: string;
  lien: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActuService {

  constructor(private http: HttpClient) { }
  entier: number = 4;

  voirPlus(): void {
    this.entier += 6 ;
  }
  getDernieresActus(): Observable<Actu[]> {
    // L'API qui renvoie les 4 derniers articles
    const apiUrl = `https://api.spaceflightnewsapi.net/v4/articles/?limit=${this.entier}&search=astronomy`;

    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        return response.results.map((article: any) => {
          // On traduit la date complexe de l'API en une belle date en français (ex: "3 Mars")
          const dateObj = new Date(article.published_at);
          const dateFormatee = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

          return {
            id: article.id.toString(),
            titre: article.title,
            date: dateFormatee,
            image: article.image_url,
            lien: article.url
          };
        });
      })
    );
  }
}
