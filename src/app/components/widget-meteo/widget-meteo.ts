import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-widget-meteo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-meteo.html',
  styleUrl: './widget-meteo.css',
})
export class WidgetMeteo {
  @Input() temperature: number = 20;
  @Input() condition: string = 'Ensoleillé';
  @Input() icone: string = 'bi-sun-fill';
  @Input() bonneCondition: boolean = true;
}