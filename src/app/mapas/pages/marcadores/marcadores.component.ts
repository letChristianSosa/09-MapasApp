import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marcador?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-97.10478913953057, 18.863117968685387];

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() {}
  ngOnDestroy(): void {
    this.mapa.off('style.load', () => {});
    this.mapa.off('dblclick', () => {});
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      projection: { name: 'globe' },
    });

    this.leerLocalStorage();

    this.mapa.on('style.load', () => {
      this.mapa.setFog({}); // Set the default atmosphere style
    });

    // Para sustituir el pin default por un elemento html
    // const htmlElement: HTMLElement = document.createElement('div');
    // htmlElement.innerHTML = 'Hola k ase';

    // Agrega un marcador al mapa

    // HardCodeado: =>
    // const marker = new mapboxgl.Marker({
    //   // element: htmlElement,
    // })
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);

    // Agrega un Marker al hacer doble click
    this.mapa.on('dblclick', (e) => {
      const color = '#xxxxxx'.replace(/x/g, (y) =>
        ((Math.random() * 16) | 0).toString(16)
      );
      const nuevoMarker = new mapboxgl.Marker({
        draggable: true,
        color,
      })
        .setLngLat(e.lngLat)
        .addTo(this.mapa);

      this.marcadores.push({ color, marcador: nuevoMarker });

      nuevoMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });

      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador(marcador: MarcadorColor) {
    this.mapa.flyTo({
      center: marcador.marcador!.getLngLat(),
    });
  }

  agregarMarcador() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const nuevoMarker = new mapboxgl.Marker({
      draggable: true,
      color,
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    this.marcadores.push({ color, marcador: nuevoMarker });
    this.guardarMarcadoresLocalStorage();
  }

  guardarMarcadoresLocalStorage() {
    const lnglatArr: MarcadorColor[] = [];

    this.marcadores.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marcador!.getLngLat();

      lnglatArr.push({
        color,
        centro: [lng, lat],
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lnglatArr));
  }

  leerLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return;
    }

    const lgnlatArr: MarcadorColor[] = JSON.parse(
      localStorage.getItem('marcadores')!
    );

    lgnlatArr.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color,
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });

      this.marcadores.push({ color: m.color, marcador: newMarker });
    });
  }

  borrarMarcador(i: number) {
    this.marcadores[i].marcador?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
