<script>
    import '../../app.css';
    import mapboxgl from "mapbox-gl";
    import "mapbox-gl/dist/mapbox-gl.css";
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import Scroller from '@sveltejs/svelte-scroller';
    import { base } from '$app/paths';
  
  
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
    let points311 = null;
    let pointsViolations = null;
    let rentBurden = null;
    let investorPurchases = null;
    let scrollerMapViewChanged = 0;
    let selectedNeighborhood = null;
    let scrollerMapLoaded = false;
    let arrestDensity = null;
    let evictions = null;
  
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
      scrollerMapLoaded = true;
      console.log("Map has loaded!");
  
      redlining = await d3.json(`${base}/data/mappinginequality.json`);
      neighborhoods = await d3.json(`${base}/data/bpda_neighborhood_boundaries.json`);
      points311 = await d3.json(`${base}/data/311_points.json`);
      pointsViolations = await d3.json(`${base}/data/violations_points.json`);
      rentBurden = await d3.json(`${base}/data/rentburden_neighborhood2023.json`);
      investorPurchases = await d3.json(`${base}/data/sales_by_neighborhood_centroids.geojson`);
      arrestDensity = await d3.json(`${base}/data/arrest_density4.geojson`);
      evictions = await d3.json(`${base}/data/eviction_points_boston.geojson`);

      scrollerMap.addSource('rentBurden', {
        type: 'geojson',
        data: rentBurden
      });

      scrollerMap.addSource('investorPurchases', {
        type: 'geojson',
        data: investorPurchases
      });      

      scrollerMap.addSource('points311', {
        type: 'geojson',
        data: points311
      });

      scrollerMap.addSource('evictions', {
        type: 'geojson',
        data: evictions
      });

      scrollerMap.addSource('arrestDensity', {
        type: 'geojson',
        data: arrestDensity
      });

      scrollerMap.addLayer({
        'id': 'choroplethRentBurden',
        'type': 'fill',
        'source': 'rentBurden',
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'Neighborhood_RentBurden'], 
            0.25, '#E3BFBE',
            0.35, '#D6A2A1',
            0.45, '#CA8584',
            0.55, '#B55554',
            0.65, '#A12624'
          ],
          'fill-opacity': 0
        }
      });

      scrollerMap.addLayer({
        'id': 'circleInvestorPurchases',
        'type': 'circle',
        'source': 'investorPurchases',
        'paint': {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'investor_sales_pct'],
            0, 4,
            0.05, 6,
            0.20, 8,
            0.30, 10,
            0.40, 12,
            1, 14
          ],
          'circle-color': '#8790BC',
          'circle-opacity': 0
        }
      });

      scrollerMap.addLayer({
        'id': 'choroplethArrests',
        'type': 'fill',
        'source': 'arrestDensity',
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'arrest_density'],
            0, '#E3BFBE',
            40, '#D6A2A1',
            80, '#CA8584',
            120, '#B55554',
            160, '#A12624'
          ],
          'fill-opacity': 0
        }
      });
      
      scrollerMap.addLayer({
        'id': 'heatmap311',
        'type': 'heatmap',
        'source': 'points311',
        'paint': {
          'heatmap-weight': 1,
          'heatmap-intensity': 1,
          'heatmap-radius': ["interpolate", ['exponential', 2], ['zoom'], 10, 2, 15, 64 ],
          'heatmap-opacity': 0,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.2, 'blue',
            0.4, 'cyan',
            0.6, 'lime',
            0.8, 'yellow',
            1, 'red'
          ]
            }
      
      });

      scrollerMap.addSource('pointsViolations', {
        type: 'geojson',
        data: pointsViolations
      });

      scrollerMap.addLayer({
        'id': 'heatmapViolations',
        'type': 'heatmap',
        'source': 'pointsViolations',
        'paint': {
          'heatmap-weight': 1,
          'heatmap-intensity': 1,
          'heatmap-radius': ["interpolate", ['exponential', 2], ['zoom'], 10, 1, 15, 32 ],
          'heatmap-opacity': 0, 
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.2, 'purple',
            0.4, 'magenta',
            0.6, 'orange',
            0.8, 'gold',
            1, 'red'
          ]
        },
      });
  


    scrollerMap.addLayer({
      'id': 'heatmapEvictions',
      'type': 'heatmap',
      'source': 'evictions',
      'paint': {
        'heatmap-weight': 1,
        'heatmap-intensity': 1,
        'heatmap-radius': 2,
        'heatmap-opacity': 0, 
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0,0,255,0)',
          0.2, 'blue',
          0.4, 'cyan',
          0.6, 'lime',
          0.8, 'yellow',
          1, 'red'
        ]
      },
    });
  });
    
    let rentBurdenLabels = [
      { label: '25%', color: '#E3BFBE' },
      { label: '35%', color: '#D6A2A1' },
      { label: '45%', color: '#CA8584' },
      { label: '55%', color: '#B55554' },
      { label: '65%', color: '#A12624' }
    ];

    $: if (scrollerMapLoaded && count !== undefined && scrollerMap) {
      if (scrollerMap.getLayer('choroplethArrests')) {
        if (index === 2) {
          scrollerMap.setPaintProperty('choroplethArrests', 'fill-opacity', 1);
        } else {
          scrollerMap.setPaintProperty('choroplethArrests', 'fill-opacity', 0);
        }
      }
      if (scrollerMap.getLayer('heatmap311') && scrollerMap.getLayer('heatmapViolations')) {
        if (index === 3) {
          scrollerMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0.8);
          scrollerMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0);
        } else if (index === 4) {
          scrollerMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0);
          scrollerMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0.8);
        } else {
          scrollerMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0);
          scrollerMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0);
        }
      }
      if (scrollerMap.getLayer('choroplethRentBurden') && scrollerMap.getLayer('circleInvestorPurchases')) {
        if (index === 1) {
          scrollerMap.setPaintProperty('choroplethRentBurden', 'fill-opacity', 1);
          scrollerMap.setPaintProperty('circleInvestorPurchases', 'circle-opacity', 1);
        } else {
          scrollerMap.setPaintProperty('choroplethRentBurden', 'fill-opacity', 0);
          scrollerMap.setPaintProperty('circleInvestorPurchases', 'circle-opacity', 0);
        }
      }
      if (scrollerMap.getLayer('heatmapEvictions')) {
        if (index === 5) {
          scrollerMap.setPaintProperty('heatmapEvictions', 'heatmap-opacity', 0.8);
        } else {
          scrollerMap.setPaintProperty('heatmapEvictions', 'heatmap-opacity', 0);
        }
      }
    }

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
  
  function handleNeighborhoodClick(feature) {
    if (selectedNeighborhood?.properties.name === feature?.properties.name) {
      selectedNeighborhood = null;
    } else {
      selectedNeighborhood = feature;
    }
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
            <!-- <p style="font-size:small;">these sliders are for debug -Nicola</p>
            <p>current section: <strong>{index + 1}/{count}</strong></p>
            <progress value="{count ? (index + 1) / count : 0}"></progress>
    
            <p>offset in current section</p>
            <progress value={offset || 0}></progress>
    
            <p>total progress</p>
            <progress value={progress || 0}></progress> -->
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
            <section><p style="font-size: 20px;">History of Redlining in Boston</p>
              <p>
              Redlining created barriers for African American and immigrant families in neighborhoods considered “hazardous,” “undesirable,” or “inharmonious” to access mortgage financing. Communities of historically redlined neighborhoods continue to live and negotiate with the long-term impacts of systemic exclusion, preserving what is precious to them.</p>
              <div>
                <ul class="legend">
                  <li style="--color: #76a865; opacity: 0.5">
                    <span class="swatch"></span>
                    <p>"A: Best"</p>
                  </li>
                  <li style="--color: #7cb5bd; opacity: 0.5">
                    <span class="swatch"></span>
                    <p>"B: Still Desirable"</p>
                  </li>
                  <li style="--color: #ffff00; opacity: 0.5">
                    <span class="swatch"></span>
                    <p>"C: Definitely Declining"</p>
                  </li>
                  <li style="--color: #d9838d; opacity: 0.5">
                    <span class="swatch"></span>
                    <p>"D: Hazardous"</p>
                  </li>
                  <li style="--color: #000000; opacity: 0.5">
                    <span class="swatch"></span>
                    <p>"Commercial"</p>
                  </li>
                </ul>
              </div>
            </section>
            <section><p style="font-size: 20px;">Investor Purchase & Community Rent Burden</p>
              <p>Yet, across Boston, we see a growing problem of rising investor purchase rate, exacerbating rent burden. This correlation is particularly true since the financial crisis in historically redlined neighborhoods such as Mattapan (2023 Rent Burden = 64%; Investor Sales 100%), South Boston Waterfront (2023 Rent Burden = 39%; Investor Sales = 31%), North End (2023 Rent Burden = 34%; Investor Sales = 26%). 
              </p>
              <p>Along with the increase of rent burden, we also observe significant change in the neighborhood demographics, especially with education level, a key indicator of gentrification.
                From 2015 to 2023, there has been a 25% increase in the population that holds a Bachelor's degree or higher in the entirety of Suffolk county.
                While housing is becoming an asset class for corporations, longtime residents are forced out.
                </p>
                <div class="legend-container">
                <ul class="legend">
                  <p>Rent Burden</p>
                  {#each rentBurdenLabels as d}
                    <li style="--color: {d.color}">
                      <span class="swatch"></span>
                      <p>{d.label}</p>
                    </li>
                  {/each}
                </ul> 
                <ul class="legend">
                  <p>Investor Purchases</p>
                  <li><span class="circle-swatch" style="width:4px; height:4px;"></span><p>0%</p></li>
                  <li><span class="circle-swatch" style="width:8px; height:8px;"></span><p>5%</p></li>
                  <li><span class="circle-swatch" style="width:12px; height:12px;"></span><p>20%</p></li>
                  <li><span class="circle-swatch" style="width:16px; height:16px;"></span><p>30%</p></li>
                  <li><span class="circle-swatch" style="width:20px; height:20px;"></span><p>40%</p></li>
                  <li><span class="circle-swatch" style="width:24px; height:24px;"></span><p>100%</p></li>
                </ul>  
              </div>             
            </section>
            <section><p style="font-size: 20px;">Arrests per 1000 (2020-2024)</p>
              <p>Scholars like <a href="https://www.ucpress.edu/books/golden-gulag/paper">Ruth Wilson Gilmore (2007)</a> have argued that criminalization serves as a tool to justify state violence and the containment of marginalized populations. 
                By criminalizing certain behaviors and populations, police provide real estate developers with justification for urban renewal efforts that erase community histories and identities.
                The disproportionate arrest density is particularly stark in neighborhoods where <a href="https://www.bostonplans.org/real-estate/urban-renewal/overview">Boston's Urban Renewal</a> plans are extended, such as Downtown, West End, and Roxbury, in addition to neighborhoods with large Black and migrant populations, such as Mattapan and Dorchester.
                </p>
                <ul class="legend">
                  <li style="--color: rgba(0,0,255,0)"><span class="swatch"></span><p>Lowest density of 311 calls</p></li>
                  <li style="--color: blue"><span class="swatch"></span><p></p></li>
                  <li style="--color: cyan"><span class="swatch"></span><p></p></li>
                  <li style="--color: lime"><span class="swatch"></span><p></p></li>
                  <li style="--color: yellow"><span class="swatch"></span><p></p></li>
                  <li style="--color: red"><span class="swatch"></span><p>Highest density of 311 calls</p></li>
                </ul>
                
            </section>
            <section><p style="font-size: 20px;">311 Service Requests Assigned to Police (2015-2024)</p>
              <p>Nuisance ordinances are framed as neutral regulatory measures intended to preserve public order, yet their application disproportionately affects Black and low-income communities. 
                By labeling properties as “nuisances” due to alleged criminal activity, excessive noise, or even repeated police calls, municipalities establish legal grounds for eviction and redevelopment. 
                As <a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/anti.12792">Terra Graziani et al. (2021)</a> argue, these laws operate as “borderland” mechanisms, defining and reshaping urban space to facilitate capital investment. 
                </p>
                <p>
                We have noticed that, across Boston, 311 service requests for noise complaints increased drastically since 2015. North End, a historically redlined neighborhood currently undergoing urban renewal, demonstrates a low arrest rate, but a high density of 311 noise complaint requests. 
                </p>
                <ul class="legend">
                  <li style="--color: rgba(0,0,255,0)"><span class="swatch"></span><p>Lowest density of 311 calls</p></li>
                  <li style="--color: blue"><span class="swatch"></span><p></p></li>
                  <li style="--color: cyan"><span class="swatch"></span><p></p></li>
                  <li style="--color: lime"><span class="swatch"></span><p></p></li>
                  <li style="--color: yellow"><span class="swatch"></span><p></p></li>
                  <li style="--color: red"><span class="swatch"></span><p>Highest density of 311 calls</p></li>
                </ul>
                
            </section>
            <section><p style="font-size: 20px;">Building and Property Violations</p>
              <p>Buildings & property violations seem to be on the rise, showing a similar pattern. These non-criminal, auxiliary policing is more clearly associated with early-stage urban “renewal” than already wealthy neighborhoods, such as North End, East Boston, and Dorchester.</p>
              <ul class="legend">
                <li style="--color: rgba(0,0,255,0)"><span class="swatch"></span><p>Lowest density of violations</p></li>
                <li style="--color: purple"><span class="swatch"></span><p></p></li>
                <li style="--color: magenta"><span class="swatch"></span><p></p></li>
                <li style="--color: orange"><span class="swatch"></span><p></p></li>
                <li style="--color: gold"><span class="swatch"></span><p></p></li>
                <li style="--color: red"><span class="swatch"></span><p>Highest density of violations</p></li>
              </ul>
              
            </section>
            <section><p style="font-size: 20px;">Eviction filings (2020-2022)</p>
              <p></p>
                <ul class="legend">
                  <li style="--color: rgba(0,0,255,0)"><span class="swatch"></span><p>Lowest density of eviction filings</p></li>
                  <li style="--color: blue"><span class="swatch"></span><p></p></li>
                  <li style="--color: cyan"><span class="swatch"></span><p></p></li>
                  <li style="--color: lime"><span class="swatch"></span><p></p></li>
                  <li style="--color: yellow"><span class="swatch"></span><p></p></li>
                  <li style="--color: red"><span class="swatch"></span><p>Highest density of eviction filings</p></li>
                </ul>
                
            </section>
          </div>
        </Scroller>
      </div>
    <!-- end of content from svelte-scroller tutorial -->
    </div>
    <div class="next-chapter-link">
      <a href="{base}/chapter2-2">
        ↓ Chapter 2, Part 2: Data Explorer
      </a>
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
    pointer-events: auto;
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
          /* background-color: rgba(255,62,0,0.05); */
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

    /* styling from... a template... */
    .legend {
      list-style: none;
      padding: 10px;
      margin: 20px 0 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      /* background-color: rgba(255,62,0,0.05); */
    }

    .legend li {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 14px;
      font-style: normal;
      font-family: Arial, Helvetica, sans-serif;
    }

    .legend p {
      margin: 0;
      font-size: 14px; /* or whatever size you like */
    }

    .swatch {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-color: var(--color);
      border-radius: 4px; /* or 50% for a circle */
      border: 1px solid #ccc;
    }

    .circle-swatch {
      display: inline-block;
      background-color: #8790BC;
      border: 1px solid #666;
      border-radius: 50%;
    }

    .legend-container {
      display: flex;
      gap: 16px; /* space between the two legends */
      align-items: flex-start;
    }

    
    
  
  </style>
  
  
  
    