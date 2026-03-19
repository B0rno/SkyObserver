import { Injectable } from '@angular/core';
import * as Astronomy from 'astronomy-engine';

export interface PlaneteVisible {
  nom: string;
  visibleOeilNu: boolean;
  visibleTelescope: boolean;
  altitude: number;  // en degrés au-dessus de l'horizon
  azimuth: number;   // direction en degrés (0=Nord, 90=Est, 180=Sud, 270=Ouest)
  magnitude: number; // luminosité (plus c'est petit, plus c'est lumineux)
  constellation: string;
  lever: Date;
  coucher: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AstronomyService {

  private readonly PLANETES = [
    { nom: 'Lune', body: Astronomy.Body.Moon, magnitudeLimite: -12.0 },
    { nom: 'Mercure', body: Astronomy.Body.Mercury, magnitudeLimite: 2.5 },
    { nom: 'Vénus', body: Astronomy.Body.Venus, magnitudeLimite: -4.0 },
    { nom: 'Mars', body: Astronomy.Body.Mars, magnitudeLimite: 2.0 },
    { nom: 'Jupiter', body: Astronomy.Body.Jupiter, magnitudeLimite: -2.0 },
    { nom: 'Saturne', body: Astronomy.Body.Saturn, magnitudeLimite: 1.0 },
    { nom: 'Uranus', body: Astronomy.Body.Uranus, magnitudeLimite: 5.5 },
    { nom: 'Neptune', body: Astronomy.Body.Neptune, magnitudeLimite: 8.0 },
    { nom: 'Pluton', body: Astronomy.Body.Pluto, magnitudeLimite: 14.0 }
  ];

  constructor() { }

  /**
   * Calcule les planètes visibles depuis une position donnée
   * @param latitude Latitude en degrés
   * @param longitude Longitude en degrés
   * @param altitude Altitude en mètres (optionnelle, 0 par défaut)
   * @param date Date d'observation (par défaut maintenant)
   */
  getPlanetesVisibles(latitude: number, longitude: number, altitude: number = 0, date: Date = new Date()): PlaneteVisible[] {
    const observer = new Astronomy.Observer(latitude, longitude, altitude);
    const planetes: PlaneteVisible[] = [];

    for (const planete of this.PLANETES) {
      try {
        // Position horizontale de la planète
        const equatorial = Astronomy.Equator(planete.body, date, observer, true, true);
        const horizontal = Astronomy.Horizon(date, observer, equatorial.ra, equatorial.dec, 'normal');

        // Magnitude (luminosité)
        const illumination = Astronomy.Illumination(planete.body, date);
        const magnitude = illumination.mag;

        // La planète est visible si elle est au-dessus de l'horizon (altitude > 0)
        if (horizontal.altitude > 0) {
          // Calcul des heures de lever et coucher
          const lever = this.calculerLever(planete.body, date, observer);
          const coucher = this.calculerCoucher(planete.body, date, observer);

          planetes.push({
            nom: planete.nom,
            visibleOeilNu: magnitude <= 6.0 && horizontal.altitude > 10, // visible à l'œil nu si magnitude < 6 et altitude > 10°
            visibleTelescope: magnitude > 6.0 || (magnitude <= 6.0 && horizontal.altitude <= 10),
            altitude: Math.round(horizontal.altitude * 10) / 10,
            azimuth: Math.round(horizontal.azimuth * 10) / 10,
            magnitude: Math.round(magnitude * 10) / 10,
            constellation: this.getConstellation(equatorial.ra, equatorial.dec),
            lever: lever,
            coucher: coucher
          });
        }
      } catch (error) {
        console.error(`Erreur lors du calcul pour ${planete.nom}:`, error);
      }
    }

    // Trier par altitude décroissante (les plus hautes dans le ciel en premier)
    return planetes.sort((a, b) => b.altitude - a.altitude);
  }

  /**
   * Calcule l'heure de lever d'un astre
   */
  private calculerLever(body: Astronomy.Body, date: Date, observer: Astronomy.Observer): Date {
    try {
      const searchDate = new Astronomy.AstroTime(date);
      const riseTime = Astronomy.SearchRiseSet(body, observer, 1, searchDate, 1);
      return riseTime ? riseTime.date : date;
    } catch {
      return date;
    }
  }

  /**
   * Calcule l'heure de coucher d'un astre
   */
  private calculerCoucher(body: Astronomy.Body, date: Date, observer: Astronomy.Observer): Date {
    try {
      const searchDate = new Astronomy.AstroTime(date);
      const setTime = Astronomy.SearchRiseSet(body, observer, -1, searchDate, 1);
      return setTime ? setTime.date : date;
    } catch {
      return date;
    }
  }

  /**
   * Détermine approximativement la constellation 
   * Dans une vraie implémentation, on utiliserait une table de correspondance RA/Dec -> Constellation
   */
  private getConstellation(ra: number, dec: number): string {
    // Implémentation simplifiée - retourne une constellation générique
    // Pour une vraie implémentation, il faudrait une bibliothèque de mapping RA/Dec vers constellations
    const constellations = [
      'Orion', 'Grande Ourse', 'Cassiopée', 'Pégase', 'Andromède',
      'Verseau', 'Poissons', 'Bélier', 'Taureau', 'Gémeaux',
      'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion',
      'Sagittaire', 'Capricorne'
    ];

    // Sélection basique combinant RA et déclinaison
    const index = Math.floor((Math.abs(dec) + ra / 24) * constellations.length / 90) % constellations.length;
    return constellations[index];
  }

  /**
   * Récupère les informations détaillées d'une planète spécifique
   */
  getInfosPlanete(nomPlanete: string, latitude: number, longitude: number, altitude: number = 0): PlaneteVisible | null {
    const planetes = this.getPlanetesVisibles(latitude, longitude, altitude);
    return planetes.find(p => p.nom === nomPlanete) || null;
  }
}
