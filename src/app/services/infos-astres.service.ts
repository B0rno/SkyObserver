import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfosAstresService {
  private apiUrl = '/api-planetes/rest/bodies/';  
  
  private apiKey = 'clé'; 

  constructor(private http: HttpClient) { }

  getInfosAstre(id: string): Observable<any> {
    // On configure l'en-tête d'autorisation Bearer
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`
    });

    // On passe les headers dans l'option de la requête GET
    return this.http.get<any>(`${this.apiUrl}${id}`, { headers });
  }
}