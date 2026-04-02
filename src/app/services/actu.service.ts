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

  /**
   * Récupère les dernières actualités astronomiques depuis l'API Spaceflight News
   *
   * @param limit - Nombre d'articles à récupérer (par défaut 12)
   * @returns Observable contenant un tableau d'actualités formatées
   */
  getDernieresActus(limit: number = 12): Observable<Actu[]> {
    // L'API qui renvoie les X derniers articles 
    const apiUrl = `https://api.spaceflightnewsapi.net/v4/articles/?limit=${limit}&search=space`;

    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        return response.results.map((article: any) => {
          // On traduit la date de l'API en une date en français (ex: "3 Mars")
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
