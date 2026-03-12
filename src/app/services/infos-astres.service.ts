import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfosAstresService {
  private apiUrl = '/api-planetes/rest/bodies/';  
  
  private apiKey = environment.apiKey; 

  constructor(private http: HttpClient) { }

  getInfosAstre(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.get<any>(`${this.apiUrl}${id}`, { headers });
  }
}