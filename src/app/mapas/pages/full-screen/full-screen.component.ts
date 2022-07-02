import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
      #mapa {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class FullScreenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const map = new mapboxgl.Map({
      container: 'mapa', // container ID
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-97.10479, 18.86312],
      zoom: 18,
    });
  }
}
