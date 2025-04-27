<script>
    import '../../app.css';
    import mapboxgl from "mapbox-gl";
    import "mapbox-gl/dist/mapbox-gl.css";
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
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
  
    let scrollerMap;
    let redlining = null;
    let neighborhoods = null;
    let scrollerMapViewChanged = 0;
    let selectedNeighborhood = null;
  
    $: scrollerMap?.on("move", evt => scrollerMapViewChanged++);

    mapboxgl.accessToken = "pk.eyJ1IjoienZsMTIxNSIsImEiOiJjbTkxZ2k3cjYwMHBhMnZwd2dneWZjeXhhIn0.KK0PwZsLffFl4_qtLg-efQ";
  
    onMount(async () => {
  
      scrollerMap = new mapboxgl.Map({
        container: 'scrollerMap',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-71.0825, 42.314],
        zoom: 10    
      });
  
      await new Promise(resolve => scrollerMap.on('load', resolve));
  
      redlining = await d3.json('/data/mappinginequality.json');
      neighborhoods = await d3.json('/data/bpda_neighborhood_boundaries.json');
  
  
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
      <div class="text-content">
        <h1>Rent is a Trap!</h1>
        <h2>By Yeonhoo Cho, Nicola Lawford, Claudia Tomateo, Zoe Voss Lee</h2>
      </div>
    <div class="scroller-container">
  
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
            <p style="font-size:small;">these sliders are for debug -Nicola</p>
            <p>current section: <strong>{index + 1}/{count}</strong></p>
            <progress value="{count ? (index + 1) / count : 0}"></progress>
    
            <p>offset in current section</p>
            <progress value={offset || 0}></progress>
    
            <p>total progress</p>
            <progress value={progress || 0}></progress>
            <div style="position: relative; flex-grow: 1;">
              <div id="scrollerMap">
                <svg id="redlineSvg" bind:this={svgEl}>
                  {#key scrollerMapViewChanged}
                    {#if redlining}
                      {#each redlining.features as feature}
                        <path
                        d={geoJSONPolygonToPath(feature)}
                        fill={feature.properties.fill}
                        fill-opacity= {(offset > 0.2 && offset < 0.8 && index == 0)? `0.6` : `0`}
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
                <svg id="scrollerNeighborhoods">
                  {#key scrollerMapViewChanged}
                    {#if neighborhoods}
                      {#each neighborhoods.features as feature}
                        <path
                          d={geoJSONPolygonToPath(feature)}
                          fill="#ffffff"
                          fill-opacity="0.5"
                          stroke="#000000"
                          stroke-opacity="0.5"
                          stroke-width="1"
                          class={feature?.properties.name === selectedNeighborhood?.properties.name ? "selected" : ""}
                          on:mousedown={() => selectedNeighborhood = selectedNeighborhood?.properties.name !== feature?.properties.name ? feature : null}
                        >
                          <title>{feature.properties.name}</title>
                        </path>
                        <path
                          d={geoJSONPolygonToPath(feature)}
                          fill="#ffffff"
                          fill-opacity="0"
                          stroke="#0000ff"
                          stroke-opacity="1"
                          stroke-width="2"
                          class={feature?.properties.name === selectedNeighborhood?.properties.name ? "outlineSelected" : "outlineNotSelected"}
                          on:mousedown={() => selectedNeighborhood = selectedNeighborhood?.properties.name !== feature?.properties.name ? feature : null}
                        >
                          <title>{feature.properties.name}</title>
                        </path>
                      {/each}
                    {/if}
                  {/key}
                </svg>
              </div>
              {#if selectedNeighborhood}
                <div class="neighborhood-label"><p>{selectedNeighborhood.properties.name}</p></div>
              {/if}
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
  
    .scroller-container {
      pointer-events: none;
    }
  
    /* #scrollerNeighborhoods path {
      transition: opacity 0.2s ease;
      pointer-events: auto;
    }
    &:has(path.selected) path:not(.selected) {
      opacity: 0.5;
    } */
  
    #scrollerNeighborhoods path {
      transition: opacity 0.2s ease;
      pointer-events: auto;
    }
  
    #scrollerNeighborhoods:has(path.selected) path:is(.selected) {
      opacity: 0;
    }
  
    #scrollerNeighborhoods path:is(.outlineSelected) {
      opacity: 1;
      z-index: 15;
    }
    #scrollerNeighborhoods path:is(.outlineNotSelected) {
      opacity: 0;
    }
  
    .neighborhood-label {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(255, 255, 255, 0.85);  /* white with 90% opacity */
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      z-index: 999;
      max-width: 300px;
      font-family: sans-serif;
    }
    
    
  
  </style>
  
  
  
    