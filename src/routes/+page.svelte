<script>
  import YearToggle from '$lib/YearToggle.svelte';
  import LayerSidebar from '$lib/LayerSidebar.svelte';
  import '../app.css';
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import FeatureInfoPanel from '$lib/FeatureInfoPanel.svelte';
  import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
  import Legend from '$lib/Legend.svelte';
  import Scroller from '@sveltejs/svelte-scroller';


  /* vars from svelte-scroller tutorial (maybe remove some later) */
  let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;
  /* end of vars from svelte-scroller tutorial */

  let selectedYear = 2015;
  let selectedFeature = null; // Initialize selectedFeature to null
  let selectedLayer = 'education';

  let map;
  let visibleLayers = {
    education: true, // Default to showing education layer
    income: false,
    race: false,
    rentBurden: false
  };
  let policeInd = 'reqs';

  let scrollerMap;
  let redlining = null;
  let scrollerMapViewChanged = 0;

  $: scrollerMap?.on("move", evt => scrollerMapViewChanged++);




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
  }

  function handleLayerToggle(event) {
    const { layer, visible } = event.detail;
    visibleLayers[layer] = visible;
    if (visible) selectedLayer = layer;
    updateLayerVisibility();
    console.log(layer, visible);
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
          // now setup policing indicators as height
          if (policeInd == 'viol') {
            map.setPaintProperty(id, 'fill-extrusion-height', ['get', `viol_per_1000_extrude`]);

          } else if (policeInd == 'reqs') {
            map.setPaintProperty(id, 'fill-extrusion-height', ['get', `reqs_per_1000_extrude`]);
          } else {
            map.setPaintProperty(id, 'fill-extrusion-height', 0);

          }
        }
      }
    }
  }

  // if (map) {
  //   map.setLayoutProperty('education-2015', 'visibility', year === 2015 && educationVisible ? 'visible' : 'none');
  //   map.setLayoutProperty('education-2023', 'visibility', year === 2023 && educationVisible ? 'visible' : 'none');
  // }

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
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-71.0589, 42.3601],
      zoom: 11,
      pitch: 80,
      bearing: 41
    
    });

    scrollerMap = new mapboxgl.Map({
      container: 'scrollerMap',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-71.0589, 42.3601],
      zoom: 10    
    });

    await new Promise(resolve => map.on('load', resolve));
    await new Promise(resolve => scrollerMap.on('load', resolve));

    const data2023 = await d3.json('/data/merged2023_finalfinal.geojson');
    const data2015 = await d3.json('/data/merged2015_final.geojson');
    const neighborhoods = await d3.json('/data/bpda_neighborhood_boundaries.json');
    redlining = await d3.json('/data/mappinginequality.json');

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

    const quartileColors = [
      '#E6E8F1', // Q1
      '#A6A7C4', // Q2
      '#666792', // Q3
      '#1A1841'  // Q4
    ];

    function getFillColorExpression(fieldName) {
      return [
        'match',
        ['get', `${fieldName}_quartile`],
        1, quartileColors[0],
        2, quartileColors[1],
        3, quartileColors[2],
        4, quartileColors[3],
        '#ccc' // fallback
      ];
    }



    for (const [layer, { key }] of Object.entries(variables)) {
      for (const year of [2015, 2023]) {
        const fullKey = `${key}${year}`;
        const id = `${layer}-${year}`;
        map.addLayer({
          id,
          type: 'fill-extrusion',
          source: `merged${year}`,
          paint: {
            'fill-extrusion-color': getFillColorExpression(fullKey), // Use the quartile color expression
            'fill-extrusion-opacity': 0.7,
            'fill-extrusion-height': ['get', `viol_per_1000_extrude`]
          },
          layout: {
            visibility: visibleLayers[layer] && selectedYear === year ? 'visible' : 'none'
          }
        });
      }
    }

    map.addLayer({
      id: 'neighborhoods-boundaries',
      type: 'line',
      source: 'neighborhoods',
      paint: {
        "line-color": "gray",
        "line-width": 2,
        "line-opacity": 0.7
      }
    });

    map.on('click', (e) => {
      const layers = Object.keys(visibleLayers)
        .filter(layer => visibleLayers[layer])
        .map(layer => `${layer}-${selectedYear}`);

      const features = map.queryRenderedFeatures(e.point, { layers });

      if (features.length > 0) {
        selectedFeature = features[0];
      } else {
        selectedFeature = null;
      }
    });

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

  });

  let svgEl;

  $: if (svgEl && index == 0) {
    const paths = d3.select(svgEl).selectAll('path');

    if (offset > 0.8) {
      paths.transition()
        .duration(500)
        .style('fill-opacity', 0);
    } else if (offset > 0.2) {
      paths.transition()
        .duration(500)
        .style('fill-opacity', 0.6);
    } else {
      paths.transition()
        .duration(500)
        .style('fill-opacity', 0.2);
    }
  }

  function geoJSONPolygonToPath(feature) {
    const path = d3.path();
    const type = feature.geometry.type;
    const coords = feature.geometry.coordinates;

    if (type === "Polygon") {
      // A single polygon: list of rings
      for (const ring of coords) {
        for (let i = 0; i < ring.length; i++) {
          const [lng, lat] = ring[i];
          const { x, y } = scrollerMap.project([lng, lat]);
          if (i === 0) path.moveTo(x, y);
          else path.lineTo(x, y);
        }
        path.closePath();
      }
    } else if (type === "MultiPolygon") {
      // A MultiPolygon: list of polygons, each containing list of rings
      for (const polygon of coords) {
        for (const ring of polygon) {
          for (let i = 0; i < ring.length; i++) {
            const [lng, lat] = ring[i];
            const { x, y } = scrollerMap.project([lng, lat]);
            if (i === 0) path.moveTo(x, y);
            else path.lineTo(x, y);
          }
          path.closePath();
        }
      }
    } else {
      console.warn("Unsupported geometry type:", type);
    }

    return path.toString();
  }

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

    <!-- From svelte-scroller tutorial -->
    <div class="scroller">
      <Scroller
      {top}
      {threshold}
      {bottom}
      bind:count
      bind:index
      bind:offset
      bind:progress
    >
      <div slot="background">
        <p>current section: <strong>{index + 1}/{count}</strong></p>
        <progress value="{count ? (index + 1) / count : 0}"></progress>

        <p>offset in current section</p>
        <progress value={offset || 0}></progress>

        <p>total progress</p>
        <progress value={progress || 0}></progress>
        <div id="scrollerMap">
          <svg id="redlineSvg" bind:this={svgEl}>
            {#key scrollerMapViewChanged}
              {#if redlining}
                <script>console.log("made it");</script>
                {#each redlining.features as feature}
                  <path
                    d={geoJSONPolygonToPath(feature)}
                      fill={feature.properties.fill}
                      fill-opacity="0.2"
                      stroke="#000000"
                      stroke-opacity="0.5"
                      stroke-width="0"
                      >
                        <title>{feature.properties.category}</title>
                      </path>
                  {/each}
              {/if}
          {/key}
        </svg>
        </div>
      </div>

      <div slot="foreground" style="padding: 0 0 0 50%;">
        <section>Historic HOLC redlining map of Boston
          <p>
            Base layer: Historic HOLC redlining map of Boston from University of Richmond
          </p>
          <p>Overlay: Present-day neighborhood boundaries or census tracts.</p>
          <p>Narrative: Redlining created barriers for African American and immigrant families in neighborhoods considered “hazardous,” “undesirable,” or “inharmonious” to access mortgage financing. Communities of historically redlined neighborhoods continue to live and negotiate with the long-term impacts of systemic exclusion, preserving what is precious to them.</p>
        </section>
        <section>section 2</section>
        <section>section 3</section>
        <section>section 4</section>
        <section>section 5</section>
      </div>
    </Scroller>
  </div>
  <!-- end of content from svelte-scroller tutorial -->

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
      </div>

      <div class="map-wrapper">
        <div id="map"></div>
        {#if selectedFeature}
          <FeatureInfoPanel class="floating-panel" feature={selectedFeature} year={selectedYear} />
        {/if}
      </div>
    </div>
    <Legend></Legend>
    <h4>Our Data Design Choices</h4>
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
    <p>Neighborhood Boundaries Approximated to Census Tracts: <a href=https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::boston-neighborhood-boundaries-approximated-by-2020-census-block-groups/about target=blank>BostonMap</p>
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

#scrollerMap {
  flex: 1;
  width: calc(50% - 1em);
  height: 400px;
  pointer-events: all;
  position: relative;
  z-index: 0;
}

#scrollerMap svg {
  position: absolute;
  z-index: 1;
  flex: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Floating info panel */
:global(.floating-panel) {
  position: absolute;
  top: 54px;
  right: 10px;
  background: rgba(255, 255, 255, 0.85);  /* white with 90% opacity */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 999;
  max-width: 300px;
  font-family: sans-serif;
}


/* styling from svelte-scroller tutorial */
.scroller {
		padding: 0 100px 0 0;
	}
	
	[slot="background"] {
		background-color: rgba(255,62,0,0.05);
		border-top: 2px solid #ff3e00;
		border-bottom: 2px solid #ff3e00;
		font-size: 1.4em;
		overflow: hidden;
		padding: 1em;
    pointer-events: all;
    position: relative;
    z-index: 1;
	}
	
	[slot="background"] p {
		margin: 0;
	}
	
	[slot="foreground"] {
    position: relative;
    z-index: 10;
		pointer-events: none;
	}
	
	[slot="foreground"] section {
		pointer-events: none;
	}
	
	section {
		height: 80vh;
		background-color: rgba(0,0,0,0.5);
		color: white;
		padding: 1em;
		margin: 0 0 2em 0;
	}
  

</style>



  