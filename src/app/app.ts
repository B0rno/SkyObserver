import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar';
import { LocalisationSearch } from './components/localisation-search/localisation-search';
import { MapActualite } from './components/map-actualite/map-actualite';
import { MapAstre } from './components/map-astre/map-astre';
import { WidgetMeteo } from './components/widget-meteo/widget-meteo';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, MapActualite,MapAstre,WidgetMeteo,LocalisationSearch],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App {
  protected readonly title = signal('SkyObserver');
}