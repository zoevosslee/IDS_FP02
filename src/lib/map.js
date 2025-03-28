// src/lib/map.js
import mapboxgl from 'mapbox-gl';

export async function initMap(container) {
    mapboxgl.accessToken = 'pk.eyJ1IjoienZsMTIxNSIsImEiOiJjbTE4OG1lNnQwOG5lMmpxMnRwNGZnb3drIn0.U_npUNUZEOSOXVi5-SWgHw';

    const map = new mapboxgl.Map({
        container,
        style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=99e82fc4-ae1b-4d11-8f3e-1aebf67508f9',
        center: [-71.0589, 42.3601],
        zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load
    await new Promise(resolve => map.on('load', resolve));

    const res = await fetch('/boston_neighborhoods_timelapse_cleaned.geojson');
    const geojsonData = await res.json();

    // You can add source/layer here or return map + data
    return { map, geojsonData };
}
