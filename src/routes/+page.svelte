<script>
  import YearToggle from '$lib/YearToggle.svelte';
  import LayerSidebar from '$lib/LayerSidebar.svelte';
  import '../app.css';
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import FeatureInfoPanel from '$lib/FeatureInfoPanel.svelte';

  let selectedFeature = null;

  function assignQuartiles(features, fieldName) {
  const values = features
    .map(f => f.properties[fieldName])
    .filter(v => typeof v === 'number' && !isNaN(v))
    .sort((a, b) => a - b);

  const q1 = d3.quantile(values, 0.25);
  const q2 = d3.quantile(values, 0.5);
  const q3 = d3.quantile(values, 0.75);

  for (let f of features) {
    const val = f.properties[fieldName];
    let quartile = null;

    if (val != null && !isNaN(val)) {
      if (val <= q1) quartile = 1;
      else if (val <= q2) quartile = 2;
      else if (val <= q3) quartile = 3;
      else quartile = 4;
    }

    f.properties.quartile = quartile;
  }
}

  
  let selectedYear = 2015;
  function handleYearChange(year) {
  selectedYear = year;

  if (map) {
    map.setLayoutProperty('education-2015', 'visibility', year === 2015 && educationVisible ? 'visible' : 'none');
    map.setLayoutProperty('education-2023', 'visibility', year === 2023 && educationVisible ? 'visible' : 'none');
  }
}


  mapboxgl.accessToken = "pk.eyJ1IjoienZsMTIxNSIsImEiOiJjbTkxZ2k3cjYwMHBhMnZwd2dneWZjeXhhIn0.KK0PwZsLffFl4_qtLg-efQ";

  let map;
  let educationVisible = true;

  function handleLayerToggle(event) {
  const { layer, visible } = event.detail;

  if (layer === 'education') {
    educationVisible = visible;
    if (map) {
      map.setLayoutProperty(`education-2015`, 'visibility', selectedYear === 2015 && visible ? 'visible' : 'none');
      map.setLayoutProperty(`education-2023`, 'visibility', selectedYear === 2023 && visible ? 'visible' : 'none');
    }
  }
}


function updateEducationVisibility() {
  if (!map) return;
  map.setLayoutProperty('education-2015', 'visibility', selectedYear === 2015 && educationVisible ? 'visible' : 'none');
  map.setLayoutProperty('education-2023', 'visibility', selectedYear === 2023 && educationVisible ? 'visible' : 'none');
}


  onMount(async () => {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-71.0589, 42.3601],
      zoom: 11
    
    });

    await new Promise(resolve => map.on('load', resolve));

    const data2023 = await d3.json('/data/education23.geojson');
const data2015 = await d3.json('/data/education15.geojson');

assignQuartiles(data2023.features, 'BachelorOrHigher2023');
assignQuartiles(data2015.features, 'BachelorOrHigher2015');


    map.addSource('education23', {
      type: 'geojson',
      data: data2023
    });

    map.addSource('education15', {
      type: 'geojson',
      data: data2015
    });

    map.addLayer({
      id: 'education-2023',
      type: 'fill',
      source: 'education23',
      paint: {
'fill-color': [
  'match',
  ['get', 'quartile'],
  1, '#E6E8F1',
  2, '#A6A7C4',
  3, '#666792',
  4, '#1A1841',
  '#ccc' // fallback
],
        'fill-opacity': 0.7,
        'fill-outline-color': '#ffffff'
      },
      layout: {
        visibility: selectedYear === 2023 ? 'visible' : 'none'
      }
    });

    map.addLayer({
      id: 'education-2015',
      type: 'fill',
      source: 'education15',
      paint: {
'fill-color': [
  'match',
  ['get', 'quartile'],
  1, '#E6E8F1',
  2, '#A6A7C4',
  3, '#666792',
  4, '#1A1841',
  '#ccc' // fallback
],
        'fill-opacity': 0.7,
        'fill-outline-color': '#ffffff'
      },
      layout: {
        visibility: selectedYear === 2015 ? 'visible' : 'none'
      }
    });

    map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: selectedYear === 2023 ? ['education-2023'] : ['education-2015']
  });

  if (features.length > 0) {
    selectedFeature = features[0];
  } else {
    selectedFeature = null;
  }
});

  });


  
</script>


<svelte:head>
  <title>Rent is a Trap!</title>
</svelte:head>

<div id="home-page">
  <div class="container">
    <div class="text-content">
      <h1>Rent is a Trap!</h1>
      <h2>By Yeonhoo Cho, Nicola Lawford, Claudia Tomateo, Zoe Voss Lee</h2>
    </div>

    <!-- Map + Sidebar layout -->
    <div class="map-layout">
      <div class="sidebar-panel">
        <h3>Select Data</h3>
        <div class="year-toggle-wrapper">
          <YearToggle {selectedYear} onChange={handleYearChange} />
        </div>
        <LayerSidebar on:toggleLayer={handleLayerToggle} />
      </div>

      <div class="map-wrapper">
        <div id="map"></div>

        {#if selectedFeature}
          <FeatureInfoPanel class="floating-panel" feature={selectedFeature} year={selectedYear} />
        {/if}
      </div>
    </div>
  </div>
</div>


<style>
  .debug {
  background: #f0f0f0;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #ccc;
  font-family: monospace;
  font-size: 0.8rem;
  overflow-x: auto;
}

.map-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 1px solid #ccc;
}

/* Sidebar */
.sidebar-panel {
  width: 200px;
  background: white;
  padding: 1rem;
  border-right: 1px solid #ddd;
  z-index: 10;
}

.sidebar-panel h3 {
  margin-top: 0;
  margin-bottom:10px;
}

.year-toggle-wrapper {
  margin-bottom: 1rem; /* or adjust to your liking */
}


.sidebar {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #ddd;
  font-family: sans-serif;
}

/* Wrapper for map and floating panel */
.map-wrapper {
  position: relative;
  flex-grow: 1;
  height: 600px; /* Define actual height */
}

/* Map fills wrapper */
#map {
  width: 100%;
  height: 100%;
}

/* Floating info panel */
:global(.floating-panel) {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.85);  /* white with 90% opacity */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 999;
  max-width: 300px;
  font-family: sans-serif;
}





</style>



  