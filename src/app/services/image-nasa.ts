import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageNasa {
  private apiUrl = 'https://images-api.nasa.gov/search';

  constructor(private http: HttpClient) {}

  searchImage(name: string): Observable<string> {
    return this.http
      .get<any>(`${this.apiUrl}?q=${name}&media_type=image`)
      .pipe(
        map(response => {
          const items = response.collection.items;

          // normalisation (insensible à la casse + espaces)
          const normalizedName = name.trim().toLowerCase();

          const match = items.find((item: any) => {
            const title = item.data[0]?.title?.trim().toLowerCase();
            return title === normalizedName;
          });

          return match?.links?.[0]?.href || '';
        })
      );
  }
}
