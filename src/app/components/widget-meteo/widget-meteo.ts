import { Component, Input, SimpleChanges, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-widget-meteo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './widget-meteo.html',
  styleUrl: './widget-meteo.css',
})
export class WidgetMeteo implements OnChanges {
  @Input() lat: string = '';
  @Input() lon: string = '';
  @Input() ville: string = '';

  temperature = signal<number>(0);
  condition = signal<string>('');
  icone = signal<string>('');
  bonneCondition = signal<boolean>(true);

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.lat && this.lon) {
      this.http.get<any>(
        'https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: this.lat,
            longitude: this.lon,
            current_weather: 'true'
          }
        }
      ).subscribe({
        next: (data: any) => {
          if (data.current_weather) {
            this.temperature.set(data.current_weather.temperature);
            this.condition.set(this.getConditionFromCode(data.current_weather.weathercode));
            this.icone.set(this.getIconFromCode(data.current_weather.weathercode));
            this.bonneCondition.set(data.current_weather.temperature > 10);
          }
        },
        error: () => {
          this.temperature.set(0);
          this.condition.set('Erreur météo');
          this.icone.set('bi-exclamation-triangle-fill');
          this.bonneCondition.set(false);
        }
      });
    }
  }



  getConditionFromCode(code: number): string {
    // Mapping simple, à compléter selon la doc Open-Meteo
    switch (code) {
      case 0: return 'Ciel clair';
      case 1: case 2: case 3: return 'Partiellement nuageux';
      case 45: case 48: return 'Brouillard';
      case 51: case 53: case 55: return 'Bruine';
      case 61: case 63: case 65: return 'Pluie';
      case 71: case 73: case 75: return 'Neige';
      case 80: case 81: case 82: return 'Averses';
      case 95: return 'Orage';
      default: return 'Inconnu';
    }
  }

    getIconFromCode(code: number): string {
    // Mapping simple pour Bootstrap Icons ou autre
    switch (code) {
      case 0: return 'bi-sun-fill';
      case 1: case 2: case 3: return 'bi-cloud-sun-fill';
      case 45: case 48: return 'bi-cloud-fog2-fill';
      case 51: case 53: case 55: return 'bi-cloud-drizzle-fill';
      case 61: case 63: case 65: return 'bi-cloud-rain-fill';
      case 71: case 73: case 75: return 'bi-cloud-snow-fill';
      case 80: case 81: case 82: return 'bi-cloud-drizzle-fill';
      case 95: return 'bi-cloud-lightning-fill';
      default: return 'bi-question-circle-fill';
    }
  }
}
