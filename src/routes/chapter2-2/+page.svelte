<script>
  
  import YearToggle from '$lib/YearToggle.svelte';
  import LayerSidebar from '$lib/LayerSidebar.svelte';
  import '../../app.css';
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import FeatureInfoPanel from '$lib/FeatureInfoPanel.svelte';
  //this is for address
  import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
  import Legend from '$lib/Legend.svelte';
  import { rasterToGeoJSONGrid } from '$lib/rasterToGeojsonGrid.js';
  import { base } from '$app/paths';

  let loading = true;


  let selectedYear = 2015;
  let selectedFeature = null; // Initialize selectedFeature to null
  let selectedLayer = 'education';

  //for having different terrains
  let selectedTerrain = ''; // default to your first terrain



  let map;
  let visibleLayers = {
    education: true, // Default to showing education layer
    income: false,
    race: false,
    rentBurden: false
  };


  let policeInd = 'reqs';
  let terrainVisible = true;

  const terrainSources = {
  terrain1: {
    2015: 'custom-dem',
    2023: 'custom-dem-3'
  },
  terrain2: {
    2015: 'custom-dem-2',
    2023: 'custom-dem-4'
  },
};


  function assignQuartiles(features, fieldName) {
    const values = features.map(f => f.properties[fieldName]).filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
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

    f.properties[`${fieldName}_quartile`] = quartile;
  }
}

  function assignExtrudeHeights(features, fieldName, amplitude) {
    const values = features.map(f => f.properties[fieldName]).filter(v => typeof v === 'number' && !isNaN(v));

    for (let f of features) {
      const val = f.properties[fieldName];

      f.properties[`${fieldName}_extrude`] = val*amplitude;
    }
  }
 
  function handleYearChange(year) {
    selectedYear = year;
    updateLayerVisibility();
    applySelectedTerrain();
  }

//terrain selection function
function applySelectedTerrain() {
  if (!map) return;

  let terrainSource = null;
  let pointLayer = null;

  if (selectedTerrain === 'terrain1') {
    terrainSource = selectedYear === 2015 ? 'custom-dem' : 'custom-dem-3';
    pointLayer = selectedYear === 2015 ? 'points-311-layer' : 'points-terrain3-layer';
  } else if (selectedTerrain === 'terrain2') {
    terrainSource = selectedYear === 2015 ? 'custom-dem-2' : 'custom-dem-4';
    pointLayer = selectedYear === 2015 ? 'points-terrain2-layer' : 'points-terrain4-layer';
  }

  if (terrainSource) {
    map.setTerrain({ source: terrainSource, exaggeration: 0.0015 });

    if (map.getLayer('terrain-hillshade')) {
      map.setLayerSource('terrain-hillshade', terrainSource);
    }

    if (map.getLayer('terrain-tint-overlay')) {
      map.setPaintProperty('terrain-tint-overlay', 'fill-opacity', 0.3);
    }
  } else {
    map.setTerrain(null);
    if (map.getLayer('terrain-hillshade')) {
      map.setPaintProperty('terrain-hillshade', 'hillshade-shadow-color', 'rgba(0,0,0,0)');
      map.setPaintProperty('terrain-hillshade', 'hillshade-highlight-color', 'rgba(0,0,0,0)');
      map.setPaintProperty('terrain-hillshade', 'hillshade-accent-color', 'rgba(0,0,0,0)');
    }
    if (map.getLayer('terrain-tint-overlay')) {
      map.setPaintProperty('terrain-tint-overlay', 'fill-opacity', 0);
    }
  }

  // 🔥 THIS PART: update all points layers properly
  const allPointLayers = [
    'points-311-layer',
    'points-terrain2-layer',
    'points-terrain3-layer',
    'points-terrain4-layer'
  ];

  for (const layer of allPointLayers) {
    if (map.getLayer(layer)) {
      map.setLayoutProperty(layer, 'visibility', layer === pointLayer ? 'visible' : 'none');
    }
  }
}


function toggleTerrain() {
  if (!map) return;

  if (terrainVisible) {
    map.setTerrain({ source: 'custom-dem', exaggeration: 0.001 });

    // Restore hillshade colors
    map.setPaintProperty('terrain-hillshade', 'hillshade-shadow-color', '#CA8584');
    map.setPaintProperty('terrain-hillshade', 'hillshade-highlight-color', '#ffffff');
    map.setPaintProperty('terrain-hillshade', 'hillshade-accent-color', '#fbb03b');

    // Restore tint overlay
    map.setPaintProperty('terrain-tint-overlay', 'fill-opacity', 0.3);
  } else {
    map.setTerrain(null);

    // Set all hillshade colors to transparent
    map.setPaintProperty('terrain-hillshade', 'hillshade-shadow-color', 'rgba(0,0,0,0)');
    map.setPaintProperty('terrain-hillshade', 'hillshade-highlight-color', 'rgba(0,0,0,0)');
    map.setPaintProperty('terrain-hillshade', 'hillshade-accent-color', 'rgba(0,0,0,0)');

    // Hide tint overlay
    map.setPaintProperty('terrain-tint-overlay', 'fill-opacity', 0);

  }
}



function handleLayerToggle(event) {
  const { layer } = event.detail;

  for (const l of Object.keys(visibleLayers)) {
    visibleLayers[l] = false;
  }


  visibleLayers[layer] = true;

  selectedLayer = layer; 
  updateLayerVisibility();
}

  function handlePoliceIndToggle(event) {
    const { ind } = event.detail;
    policeInd = ind;
    updateLayerVisibility();
    console.log(ind);
  }

  function updateLayerVisibility() {
    if (!map) return;

    const layers = ['education', 'income', 'race', 'rentBurden'];
    for (const layer of layers) {
      for (const year of [2015, 2023]) {
        const id = `${layer}-${year}`;
        const visible = visibleLayers[layer] && selectedYear === year;
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
        }
      }
    }
  }

  mapboxgl.accessToken = "pk.eyJ1IjoienZsMTIxNSIsImEiOiJjbTkxZ2k3cjYwMHBhMnZwd2dneWZjeXhhIn0.KK0PwZsLffFl4_qtLg-efQ";

  // let educationVisible = true;

//   function handleLayerToggle(event) {
//   const { layer, visible } = event.detail;

//   if (layer === 'education') {
//     educationVisible = visible;
//     if (map) {
//       map.setLayoutProperty(`education-2015`, 'visibility', selectedYear === 2015 && visible ? 'visible' : 'none');
//       map.setLayoutProperty(`education-2023`, 'visibility', selectedYear === 2023 && visible ? 'visible' : 'none');
//     }
//   }
// }


// function updateEducationVisibility() {
//   if (!map) return;
//   map.setLayoutProperty('education-2015', 'visibility', selectedYear === 2015 && educationVisible ? 'visible' : 'none');
//   map.setLayoutProperty('education-2023', 'visibility', selectedYear === 2023 && educationVisible ? 'visible' : 'none');
// }


  onMount(async () => {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-71.0589, 42.3601],
      zoom: 11,
      pitch: 75,
      bearing: 19
    
    });

    await new Promise(resolve => map.on('load', resolve));
    loading = false;

    applySelectedTerrain();

    map.addControl(new mapboxgl.NavigationControl(), 'top-left');


    map.addLayer({
      id: 'neighborhoods-boundaries',
      type: 'line',
      source: 'neighborhoods',
      paint: {
        "line-color": "gray",
        "line-width": 4,
        "line-opacity": 1
      }
    });

    map.on('click', (e) => {
      const layers = Object.keys(visibleLayers)
        .filter(layer => visibleLayers[layer])
        .map(layer => `${layer}-${selectedYear}`);

      const features = map.queryRenderedFeatures(e.point, { layers });

      if (features.length > 0) {
        selectedFeature = features[0];

      map.getSource('highlight-feature').setData({
      type: 'FeatureCollection',
      features: [selectedFeature]
    }); 

      } else {
        selectedFeature = null;

      map.getSource('highlight-feature').setData({
      type: 'FeatureCollection',
      features: []
       });
      }
    });

map.addSource('highlight-feature', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  }
});

map.addLayer({
  id: 'highlight-layer',
  type: 'line',
  source: 'highlight-feature',
  paint: {
    'line-color': '#A12624', 
    'line-width': 3
  }
});


// adding points
map.addSource('points-311', {
  type: 'geojson',
  data: `${base}/data/points_311_2015.geojson` 
});

map.addLayer({
  id: 'points-311-layer',
  type: 'circle',
  source: 'points-311',
  paint: {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      10, 2,   // At zoom 10, radius 2
      14, 5,   // At zoom 14, radius 5
      18, 12   // At zoom 18, radius 12
    ],
    'circle-color': '#ff00ff',
    'circle-opacity': 0
  }
});

// Terrain 2 points
map.addSource('points-terrain2', {
  type: 'geojson',
  data: `${base}/data/points_dem2_finalfinal.geojson`
});

map.addLayer({
  id: 'points-terrain2-layer',
  type: 'circle',
  source: 'points-terrain2',
  paint: {
    'circle-radius': 4,
    'circle-color': '#00ff00',
    'circle-opacity': 0
  }
});

// Terrain 3 points
map.addSource('points-terrain3', {
  type: 'geojson',
  data: `${base}/data/points_311_2023_final.geojson`
});

map.addLayer({
  id: 'points-terrain3-layer',
  type: 'circle',
  source: 'points-terrain3',
  paint: {
    'circle-radius': 4,
    'circle-color': '#00ff00',
    'circle-opacity': 0
  }
});

// Terrain 4 points
map.addSource('points-terrain4', {
  type: 'geojson',
  data: `${base}/data/points_violations_2023_final.geojson`
});

map.addLayer({
  id: 'points-terrain4-layer',
  type: 'circle',
  source: 'points-terrain4',
  paint: {
    'circle-radius': 4,
    'circle-color': '#00ff00',
    'circle-opacity': 0
  }
});

// After adding all points layers
map.setLayoutProperty('points-311-layer', 'visibility', 'none');
map.setLayoutProperty('points-terrain2-layer', 'visibility', 'none');
map.setLayoutProperty('points-terrain3-layer', 'visibility', 'none');
map.setLayoutProperty('points-terrain4-layer', 'visibility', 'none');


// Add hover popup

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  className: 'custom-popup'  // <-- Add this line
});


const pointLayers = [
  'points-311-layer', 
  'points-terrain2-layer', 
  'points-terrain3-layer', 
  'points-terrain4-layer'
];

// Define labels by layer ID
const labels = {
  'points-311-layer': 'Calls',
  'points-terrain3-layer': 'Calls',
  'points-terrain2-layer': 'Violations',
  'points-terrain4-layer': 'Violations'
};

// Attach events
for (const layerName of pointLayers) {
  map.on('mouseenter', layerName, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', layerName, () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });

  map.on('mousemove', layerName, (e) => {
    if (!e.features || !e.features.length) return;

    const coords = e.features[0].geometry.coordinates.slice();
    const val = e.features[0].properties.VALUE;
    const layerId = e.features[0].layer.id;

    let label = '';

    if (layerId === 'points-311-layer' || layerId === 'points-terrain3-layer') {
      label = 'Calls';
    } else if (layerId === 'points-terrain2-layer' || layerId === 'points-terrain4-layer') {
      label = 'Violations';
    }

    popup.setLngLat(coords)
         .setHTML(`${label}: ${val}`)
         .addTo(map);
  });
}







    // Add custom DEM source from Mapbox (uploaded by claudiatomateo)
    map.addSource('custom-dem', {
      type: 'raster-dem',
      url: 'mapbox://claudiatomateo.6f9fzqzs',
      tileSize: 512,
      maxzoom: 14
    });

    //adding more terrains, need to update the mapbox links

    map.addSource('custom-dem-2', {
      type: 'raster-dem',
      url: 'mapbox://claudiatomateo.c7qq4i7t', 
      tileSize: 512,
      maxzoom: 14
    });
    map.addSource('custom-dem-3', {
      type: 'raster-dem',
      url: 'mapbox://claudiatomateo.7qf8d4os', 
      tileSize: 512,
      maxzoom: 14
    });
    map.addSource('custom-dem-4', {
      type: 'raster-dem',
      url: 'mapbox://claudiatomateo.6ja9vviq', 
      tileSize: 512,
      maxzoom: 14
    });


    function smoothExaggeration(targetExaggeration, duration = 1500) {
  return new Promise((resolve) => {
    const start = performance.now();
    const initialExaggeration = map.getTerrain() ? map.getTerrain().exaggeration : 0;

    function easeInOut(t) {
      return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
    }

    function frame(time) {
      const rawProgress = (time - start) / duration;
      const progress = Math.min(rawProgress, 1);
      const eased = easeInOut(progress);
      const currentExaggeration = initialExaggeration + (targetExaggeration - initialExaggeration) * eased;

      map.setTerrain({ source: map.getTerrain().source, exaggeration: currentExaggeration });

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}




    const data2023 = await d3.json(`${base}/data/merged2023_finalfinal.geojson`);
    const data2015 = await d3.json(`${base}/data/merged2015_final.geojson`);
    const neighborhoods = await d3.json(`${base}/data/bpda_neighborhood_boundaries.json`);

    ['BachelorOrHigher2015', 'MedianIncome2015', 'White2015', 'RentBurden2015'].forEach(field => assignQuartiles(data2015.features, field));
    ['BachelorOrHigher2023', 'MedianIncome2023', 'White2023', 'RentBurden2023'].forEach(field => assignQuartiles(data2023.features, field));
    ['reqs_per_1000', 'viol_per_1000'].forEach(field => assignExtrudeHeights(data2015.features, field, 100));
    ['reqs_per_1000', 'viol_per_1000'].forEach(field => assignExtrudeHeights(data2023.features, field, 100));

    map.addSource('merged2015', { type: 'geojson', data: data2015 });
    map.addSource('merged2023', { type: 'geojson', data: data2023 });
    map.addSource('neighborhoods', { type: 'geojson', data: neighborhoods });

    const variables = {
      education: { key: 'BachelorOrHigher' },
      income: { key: 'MedianIncome' },
      race: { key: 'White' },
      rentBurden: { key: 'RentBurden' }
    };

    const variableColors = {
    education: ['#f4f9fd', '#a7c4e2', '#6b91c7', '#36558f'], 
    income:    ['#f0f8f2', '#c2e1c2', '#7fbf7f', '#3a7f3a'], 
    race:      ['#f3f0f9', '#c9c2db', '#9d8fc0', '#6b5b8c'],
    rentBurden: ['#fef6e7', '#f9d7a5', '#eea85c', '#ee762c']
  };


    function getFillColorExpression(fieldName, layerName) {
    const colors = variableColors[layerName]; // pick correct palette
    return [
      'match',
      ['get', `${fieldName}_quartile`],
      1, colors[0],
      2, colors[1],
      3, colors[2],
      4, colors[3],
      '#ccc' // fallback
    ];
  }




  for (const [layer, { key }] of Object.entries(variables)) {
  for (const year of [2015, 2023]) {
    const fullKey = `${key}${year}`;
    const id = `${layer}-${year}`;
    map.addLayer({
      id,
      type: 'fill',
      source: `merged${year}`,
      paint: {
        'fill-color': getFillColorExpression(fullKey, layer), 
        'fill-opacity': 0.8,
      },
      layout: {
        visibility: visibleLayers[layer] && selectedYear === year ? 'visible' : 'none'
      }
    });
  }
}


    const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: {
    color: '#A12624' // Set custom color (e.g., red)
  },
    placeholder: "Search for an address",
    zoom: 14
});

map.addControl(geocoder, 'top-right'); // or 'top-right', 'bottom-left', etc.

map.moveLayer('highlight-layer');


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
    <p>What is the correlation between gentrification and non-criminal policing? 
      In this visualization, we map indicators of non-criminal policing as vertical heights,
      and indicators relevant to gentrification as color shades. This is our ground work of exploring the neighborhood trends before
      we dive into the data analysis of speculative housing market and policing in Boston. 
      Pan and explore below!
    </p>

    <div class="map-layout">
      <div class="sidebar-panel">
        <h3>Select Data</h3>
        <div class="year-toggle-wrapper">
          <YearToggle {selectedYear} onChange={handleYearChange} />
        </div>      
        <LayerSidebar on:toggleLayer={handleLayerToggle} on:togglePoliceInd={handlePoliceIndToggle} />

      <h3>Policing Indicators [Surface]</h3>
      <label>
        <p>
        <input type="radio" name="terrain" value="terrain1" bind:group={selectedTerrain} on:change={applySelectedTerrain}>
        311 calls
      </p>
      </label>

      <label>
        <p>
        <input type="radio" name="terrain" value="terrain2" bind:group={selectedTerrain} on:change={applySelectedTerrain}>
        Building & Property Violations
      </p>
      </label>
  
      <label>
        <p>
        <input type="radio" name="terrain" value="" bind:group={selectedTerrain} on:change={applySelectedTerrain}>
        Hide Surface
      </p>
      </label>

    </div>

      <div class="map-wrapper">
        <div id="map"></div>
        {#if loading}
        <div class="loading-spinner">
          <div class="spinner"></div>
          <div>Loading map...</div>
        </div>
      {/if}
        {#if selectedFeature}
          <FeatureInfoPanel class="floating-panel" feature={selectedFeature} year={selectedYear} />
        {/if}
        
      </div>
    </div>
    <Legend></Legend>
    <!-- <h4>Our Data Design Choices</h4>
    <p>Above, you can explore 4 gentrification variables: education level (Bachelor’s Degrees or Higher), household median income, percentage of non-Hispanic white population, and percentage of rent burdened population (those who pay more than 30% of income for rent). Given the diverse scholarship on defining gentrification,
      we leave it up to you to explore different possible variables and create your own analysis on gentrification. For instance, abolitionists such as Ruth Wilson Gilmore and Mariame Kaba would conceptualize gentrification as a carceral logic of spatial control where policing and real estate act to displace racialized and marginalized communities for wealth accumulation;
      Black activists and scholars would define gentrification as racially driven displacement following the patterns of redlining and state violence; and Indigenous thinkers would frame gentrification as an extension of settler claims to land through aesthetics, dispossession and ownership.
      With an interactive map, we invite you to construct your own definition of gentrification from your own positionalities.
    </p>
    <p>To respond to activists' needs of mapping policing in relationship to gentrification, we defined 2 variables that would describe the neighborhood-level policing: 311 calls assigned to Boston Police Department and code, building and property violations. We would have liked to include arrest data, specifically low-level arrest data which many academics have studied and proven to show high correlation with gentrification.
      However, our Freedom of Information Law public data request was rejected by the Boston Police Department. This lack of data compelled us to reconsider our argument. Our previous work with undocumented workers teaches us that oftentimes the state may deploy non-criminal policing actors in addition to police arrests as a means of exclusionary development of a neighborhood.
      Leaning on to these observations, we decided to focus on non-criminal policing. Like gentrification data, we also invite you to explore the data freely and create your own analysis.</p>
    <h4>Data Sources</h4>
    <p>Gentrification Indicators: <a href=data.census.gov target=blank>Census data</a></p> 
    <p>311 Requests: <a href=https://data.boston.gov/dataset/311-service-requests target=blank>Analyze Boston</a></p>
    <p>Building & Property Violations: <a href=https://data.boston.gov/dataset/building-and-property-violations1 target=blank>Analyze Boston</a></p>
    <p>Neighborhood Boundaries Approximated to Census Tracts: <a href=https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::boston-neighborhood-boundaries-approximated-by-2020-census-block-groups/about target=blank>BostonMap</p> -->
   </div>
   <!-- <div class="next-chapter-link">
    <br><br>
    <a href="{base}/missingdata">
      ↓ Chapter 3: Missing Data
    </a>
  </div> -->
</div>



<style>

.map-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 1px solid #ccc;
}

/* Sidebar */
.sidebar-panel {
  width: 200px;
  background: #fafafa;
  padding: 1rem;
  border-right: 1px solid #ccc;
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
  bottom: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.85);  /* white with 90% opacity */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 999;
  max-width: 300px;
  font-family: sans-serif;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  z-index: 10;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ffffff;
  border-top: 4px solid #A12624; /* red */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

/* Animation keyframes */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>