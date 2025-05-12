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

      let countN;
      let indexN;
      let offsetN;
      let progressN;
    /* end of vars from svelte-scroller tutorial */
  
    let scrollerMap;
    let roxburyMap;
    let redlining = null;
    let neighborhoods = null;
    let points311 = null;
    let pointsViolations = null;
    let rentBurden = null;
    let investorPurchases = null;
    let scrollerMapViewChanged = 0;
    let roxburyMapViewChanged = 0;
    let selectedNeighborhood = null;
    let scrollerMapLoaded = false;
    let roxburyMapLoaded = false;
    let arrestDensity = null;
    let evictions = null;
  
    $: scrollerMap?.on("move", evt => scrollerMapViewChanged++);
    $: roxburyMap?.on("move", evt => roxburyMapViewChanged++);

    

    mapboxgl.accessToken = "pk.eyJ1IjoienZsMTIxNSIsImEiOiJjbTkxZ2k3cjYwMHBhMnZwd2dneWZjeXhhIn0.KK0PwZsLffFl4_qtLg-efQ";
  
    onMount(async () => {
  
      scrollerMap = new mapboxgl.Map({
        container: 'scrollerMap',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-71.0825, 42.314],
        zoom: 10    
      });
      roxburyMap = new mapboxgl.Map({
        container: 'roxburyMap',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-71.0859, 42.317],
        zoom: 12    
      });
  
      await new Promise(resolve => scrollerMap.on('load', resolve));
      scrollerMapLoaded = true;
      // await new Promise(resolve => roxburyMap.on('load', resolve));
      // roxburyMapLoaded = true;
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
      
      roxburyMap.addSource('rentBurden', {
        type: 'geojson',
        data: rentBurden
      });

      roxburyMap.addSource('investorPurchases', {
        type: 'geojson',
        data: investorPurchases
      }); 

      scrollerMap.addSource('points311', {
        type: 'geojson',
        data: points311
      });

      roxburyMap.addSource('points311', {
        type: 'geojson',
        data: points311
      });

      scrollerMap.addSource('evictions', {
        type: 'geojson',
        data: evictions
      });
      
      roxburyMap.addSource('evictions', {
        type: 'geojson',
        data: evictions
      });

      scrollerMap.addSource('arrestDensity', {
        type: 'geojson',
        data: arrestDensity
      });

      roxburyMap.addSource('arrestDensity', {
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
            0.25, '#fef6e7',
            0.35, '#f9d7a5',
            0.45, '#f4b46f',
            0.55, '#ee8c3f',
            0.65, '#ee762c'
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

      roxburyMap.addLayer({
        'id': 'choroplethRentBurden',
        'type': 'fill',
        'source': 'rentBurden',
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'Neighborhood_RentBurden'], 
            0.25, '#fef6e7',
            0.35, '#f9d7a5',
            0.45, '#f4b46f',
            0.55, '#ee8c3f',
            0.65, '#ee762c'
          ],
          'fill-opacity': 0
        }
      });

      roxburyMap.addLayer({
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

      roxburyMap.addLayer({
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

      roxburyMap.addLayer({
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

      roxburyMap.addSource('pointsViolations', {
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
  
      roxburyMap.addLayer({
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
        'heatmap-radius': ["interpolate", ['exponential', 2], ['zoom'], 10, 1, 15, 32 ],
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

    roxburyMap.addLayer({
      'id': 'heatmapEvictions',
      'type': 'heatmap',
      'source': 'evictions',
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
      { label: '25%', color: '#fef6e7' },
      { label: '35%', color: '#f9d7a5' },
      { label: '45%', color: '#f4b46f' },
      { label: '55%', color: '#ee8c3f' },
      { label: '65%', color: '#ee762c' }
    ];

    $: if (scrollerMapLoaded && count !== undefined && scrollerMap) {
      if (scrollerMap.getLayer('choroplethArrests')) {
        if (index === 2) {
          scrollerMap.setPaintProperty('choroplethArrests', 'fill-opacity', 0.7);
        } else {
          scrollerMap.setPaintProperty('choroplethArrests', 'fill-opacity', 0);
        }
      }
      if (scrollerMap.getLayer('heatmap311') && scrollerMap.getLayer('heatmapViolations')) {
        if (index === 3) {
          scrollerMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0.7);
          scrollerMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0);
        } else if (index === 4) {
          scrollerMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0);
          scrollerMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0.7);
        } else {
          scrollerMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0);
          scrollerMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0);
        }
      }
      if (scrollerMap.getLayer('choroplethRentBurden') && scrollerMap.getLayer('circleInvestorPurchases')) {
        if (index === 1) {
          scrollerMap.setPaintProperty('choroplethRentBurden', 'fill-opacity', 0.7);
          scrollerMap.setPaintProperty('circleInvestorPurchases', 'circle-opacity', 0.7);
        } else {
          scrollerMap.setPaintProperty('choroplethRentBurden', 'fill-opacity', 0);
          scrollerMap.setPaintProperty('circleInvestorPurchases', 'circle-opacity', 0);
        }
      }
      if (scrollerMap.getLayer('heatmapEvictions')) {
        if (index === 5) {
          scrollerMap.setPaintProperty('heatmapEvictions', 'heatmap-opacity', 0.7);
        } else {
          scrollerMap.setPaintProperty('heatmapEvictions', 'heatmap-opacity', 0);
        }
      }
    }

    $: if (countN !== undefined && roxburyMap) {
      if (roxburyMap.getLayer('choroplethArrests')) {
        if (indexN === 2) {
          roxburyMap.setPaintProperty('choroplethArrests', 'fill-opacity', 0.7);
        } else {
          roxburyMap.setPaintProperty('choroplethArrests', 'fill-opacity', 0);
        }
      }
      if (roxburyMap.getLayer('heatmap311') && roxburyMap.getLayer('heatmapViolations')) {
        if (indexN === 3) {
          roxburyMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0.7);
          roxburyMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0);
        } else if (indexN === 4) {
          roxburyMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0);
          roxburyMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0.7);
        } else {
          roxburyMap.setPaintProperty('heatmap311', 'heatmap-opacity', 0);
          roxburyMap.setPaintProperty('heatmapViolations', 'heatmap-opacity', 0);
        }
      }
      if (roxburyMap.getLayer('choroplethRentBurden') && roxburyMap.getLayer('circleInvestorPurchases')) {
        if (indexN === 1) {
          roxburyMap.setPaintProperty('choroplethRentBurden', 'fill-opacity', 0.7);
          roxburyMap.setPaintProperty('circleInvestorPurchases', 'circle-opacity', 0.7);
        } else {
          roxburyMap.setPaintProperty('choroplethRentBurden', 'fill-opacity', 0);
          roxburyMap.setPaintProperty('circleInvestorPurchases', 'circle-opacity', 0);
        }
      }
      if (roxburyMap.getLayer('heatmapEvictions')) {
        if (indexN === 5) {
          roxburyMap.setPaintProperty('heatmapEvictions', 'heatmap-opacity', 0.7);
        } else {
          roxburyMap.setPaintProperty('heatmapEvictions', 'heatmap-opacity', 0);
        }
      }
    }

    let svgEl;
    let svgElN;
  
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

    $: if (svgElN && indexN == 0) {
      const paths = d3.select(svgElN).selectAll('path');
  
      if (offsetN > 0.8) {
        paths.transition()
          .duration(500)
          .style('fill-opacity', 0);
      } else if (offsetN > 0.2) {
        paths.transition()
          .duration(500)
          .style('fill-opacity', 0.6);
      } else {
        paths.transition()
          .duration(500)
          .style('fill-opacity', 0.2);
      }
    }
  

    function geoJSONPolygonToPath(feature, map) {
      const path = d3.path();
      const type = feature.geometry.type;
      const coords = feature.geometry.coordinates;
  
      if (type === "Polygon") {
        // A single polygon: list of rings
        for (const ring of coords) {
          for (let i = 0; i < ring.length; i++) {
            const [lng, lat] = ring[i];
            const { x, y } = map.project([lng, lat]);
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
              const { x, y } = map.project([lng, lat]);
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
                        d={geoJSONPolygonToPath(feature,scrollerMap)}
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
                          d={geoJSONPolygonToPath(feature, scrollerMap)}
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
                          d={geoJSONPolygonToPath(feature, scrollerMap)}
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
              <div class="legend-container">
                <div class="legend">
                  <div class="legend-item" style="--color: #76a865">
                    <span class="swatch"></span>
                    <p>"A: Best"</p>
                  </div>
                  <div class="legend-item" style="--color: #7cb5bd">
                    <span class="swatch"></span>
                    <p>"B: Still Desirable"</p>
                  </div>
                  <div class="legend-item" style="--color: #ffff00">
                    <span class="swatch"></span>
                    <p>"C: Definitely Declining"</p>
                  </div>
                  <div class="legend-item" style="--color: #d9838d">
                    <span class="swatch"></span>
                    <p>"D: Hazardous"</p>
                  </div>
                  <div class="legend-item" style="--color: #000000">
                    <span class="swatch"></span>
                    <p>"Commercial"</p>
                  </div>
                </div>
              </div>  
              <p>
              Redlining created barriers for African American and immigrant families in neighborhoods considered “hazardous,” “undesirable,” or “inharmonious” to access mortgage financing. Communities of historically redlined neighborhoods continue to live and negotiate with the long-term impacts of systemic exclusion, preserving what is precious to them.</p>
                          
            </section>
            <section><p style="font-size: 20px;">Rent Burden & Investor Purchases</p>
              <div class="legend-container">
                <div class="legend rent-burden">
                  <p>Rent Burden</p>
                  {#each rentBurdenLabels as d}
                    <div class="legend-item" style="--color: {d.color}">
                      <span class="swatch"></span>
                      <p>{d.label}</p>
                    </div>
                  {/each}
                </div>
              
                <div class="legend circle-sizes">
                  <p>Investor Purchases</p>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 4px; height: 4px;"></span>
                    <p>0%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 8px; height: 8px;"></span>
                    <p>5%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 12px; height: 12px;"></span>
                    <p>20%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 16px; height: 16px;"></span>
                    <p>30%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 20px; height: 20px;"></span>
                    <p>40%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 24px; height: 24px;"></span>
                    <p>100%</p>
                  </div>
                </div>
              </div>
              <p>Yet, across Boston, we see a growing problem of rising investor purchase rate, exacerbating rent burden. This correlation is particularly true since the financial crisis in historically redlined neighborhoods such as Mattapan (2023 Rent Burden = 64%; Investor Sales 100%), South Boston Waterfront (2023 Rent Burden = 39%; Investor Sales = 31%), North End (2023 Rent Burden = 34%; Investor Sales = 26%). 
              </p>
              <p>Along with the increase of rent burden, we also observe significant change in the neighborhood demographics, especially with education level, a key indicator of gentrification.
                From 2015 to 2023, there has been a 25% increase in the population that holds a Bachelor's degree or higher in the entirety of Suffolk county.
                While housing is becoming an asset class for corporations, longtime residents are forced out.

                </p>
                
                              
            </section>
            <section><p style="font-size: 20px;">Arrests per 1000 (2020-2024)</p>
              <ul class="legend">
                <li class="legend-item">
                  <span class="swatch" style="background-color: #E3BFBE;"></span>
                  <p>0</p>
                </li>
                <li class="legend-item">
                  <span class="swatch" style="background-color: #D6A2A1;"></span>
                  <p>40</p>
                </li>
                <li class="legend-item">
                  <span class="swatch" style="background-color: #CA8584;"></span>
                  <p>80</p>
                </li>
                <li class="legend-item">
                  <span class="swatch" style="background-color: #B55554;"></span>
                  <p>120</p>
                </li>
                <li class="legend-item">
                  <span class="swatch" style="background-color: #A12624;"></span>
                  <p>160+</p>
                </li>
              </ul>
                         
              <p>Scholars like <a href="https://www.ucpress.edu/books/golden-gulag/paper">Ruth Wilson Gilmore (2007)</a> have argued that criminalization serves as a tool to justify state violence and the containment of marginalized populations. 
                By criminalizing certain behaviors and populations, police provide real estate developers with justification for urban renewal efforts that erase community histories and identities.
                The disproportionate arrest density is particularly stark in neighborhoods where <a href="https://www.bostonplans.org/real-estate/urban-renewal/overview">Boston's Urban Renewal</a> plans are extended, such as Downtown, West End, and Roxbury, in addition to neighborhoods with large Black and migrant populations, such as Mattapan and Dorchester.
                </p>
                
            </section>
            <section><p style="font-size: 20px;">311 Service Requests Assigned to Police (2015-2024)</p>
              <div class="gradient-legend">
                <span>Lowest</span>
                <div class="gradient-bar"></div>
                <span>Highest</span>
              </div>
              <p>Nuisance ordinances are framed as neutral regulatory measures intended to preserve public order, yet their application disproportionately affects Black and low-income communities. 
                By labeling properties as “nuisances” due to alleged criminal activity, excessive noise, or even repeated police calls, municipalities establish legal grounds for eviction and redevelopment. 
                As <a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/anti.12792">Terra Graziani et al. (2021)</a> argue, these laws operate as “borderland” mechanisms, defining and reshaping urban space to facilitate capital investment. 
                </p>
                <p>
                We have noticed that, across Boston, 311 service requests for noise complaints increased drastically since 2015. North End, a historically redlined neighborhood currently undergoing urban renewal, demonstrates a low arrest rate, but a high density of 311 noise complaint requests. 
                </p>
                
            </section>
            <section><p style="font-size: 20px;">Building and Property Violations</p>
              <div class="gradient-legend violations">
                <span>Lowest</span>
                <div class="gradient-bar violations"></div>
                <span>Highest</span>
              </div>
              <p>Buildings & property violations seem to be on the rise, showing a similar pattern. These non-criminal, auxiliary policing is more clearly associated with early-stage urban “renewal” than already wealthy neighborhoods, such as North End, East Boston, and Dorchester.</p>
              
            </section>
            <section><p style="font-size: 20px;">Eviction filings (2020-2022)</p>
              <div class="gradient-legend">
                <span>Lowest</span>
                <div class="gradient-bar"></div>
                <span>Highest</span>
              </div>
              <p>We observe a correlation between arrest rate and eviction filings, in neighborhoods such as Downtown, West End, and Roxbury.
                The eviction filings are also concentrated in neighborhoods with high rates of 311 requests and building & property violations, such as Dorchester and East Boston. 
              </p>
                
            </section>
          </div>
        </Scroller>
        <h4>Neighborhood Narrative: Roxbury</h4>
        <p>Let's take a deeper look at how the forces of policing, displacement, and resistance interact in one neighborhood. Roxbury is home to a large portion of Boston’s Black community, and has long served as a site for social movements, including tenants’ organizing and civil rights advocacy. It is also the only neighborhood that is home to two Boston Police Department locations, including a district police station and the Boston Police Headquarters.</p>
        <Scroller
          {top}
          {threshold}
          {bottom}
          bind:count={countN}
          bind:index={indexN}
          bind:offset={offsetN}
          bind:progress={progressN}
        >
          <div slot="background">
            <p style="font-size:small;">these sliders are for debug -Nicola</p>
            <p>current section: <strong>{indexN + 1}/{countN}</strong></p>
            <progress value="{countN ? (indexN + 1) / countN : 0}"></progress>
    
            <p>offset in current section</p>
            <progress value={offsetN || 0}></progress>
    
            <p>total progress</p>
            <progress value={progressN || 0}></progress>
            <div style="position: relative; flex-grow: 1;">

              <div id="roxburyMap">
                <svg id="redlineSvg" bind:this={svgElN}>
                  {#key roxburyMapViewChanged}
                    {#if redlining}
                      {#each redlining.features as feature}
                        <path
                        d={geoJSONPolygonToPath(feature, roxburyMap)}
                        fill={feature.properties.fill}
                        fill-opacity= {(offsetN > 0.2 && offsetN < 0.8 && indexN == 0)? `0.6` : `0`}
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

                <svg id="roxburyNeighborhoodBoundary">
                  {#key roxburyMapViewChanged}
                    {#if neighborhoods}
                      {#each neighborhoods.features as feature}
                        {#if feature?.properties.name === "Roxbury"}
                          <path
                            d={geoJSONPolygonToPath(feature, roxburyMap)}
                            fill="#ffffff"
                            fill-opacity="0"
                            stroke="#000000"
                            stroke-opacity="0.5"
                            stroke-width="2"
                          >
                            <title>{feature.properties.name}</title>
                          </path>
                        {:else}
                          <path
                            d={geoJSONPolygonToPath(feature, roxburyMap)}
                            fill="#ffffff"
                            fill-opacity="0.5"
                            stroke="#000000"
                            stroke-opacity="0.5"
                            stroke-width="2"
                          >
                            <title>{feature.properties.name}</title>
                          </path>
                        {/if}
                      {/each}
                    {/if}
                  {/key}
                </svg>

              </div>
              <!-- {#if selectedNeighborhood}
                <div class="neighborhood-label"><p>{selectedNeighborhood.properties.name}</p></div>
              {/if} -->
            </div>
          </div>
          <div slot="foreground" style="padding: 0 0 0 50%;">
            <section><p style="font-size: 20px;">Redlining</p>
              <div class="legend-container">
                <div class="legend">
                  <div class="legend-item" style="--color: #76a865">
                    <span class="swatch"></span>
                    <p>"A: Best"</p>
                  </div>
                  <div class="legend-item" style="--color: #7cb5bd">
                    <span class="swatch"></span>
                    <p>"B: Still Desirable"</p>
                  </div>
                  <div class="legend-item" style="--color: #ffff00">
                    <span class="swatch"></span>
                    <p>"C: Definitely Declining"</p>
                  </div>
                  <div class="legend-item" style="--color: #d9838d">
                    <span class="swatch"></span>
                    <p>"D: Hazardous"</p>
                  </div>
                  <div class="legend-item" style="--color: #000000">
                    <span class="swatch"></span>
                    <p>"Commercial"</p>
                  </div>
                </div>
              </div>  
              <p>
                Roxbury was historically redlined by the federal agency Home Owner’s Loan Corporation (HOLC). The HOLC characterized Roxbury as majority foreign-born and Black, as well as “heavy traffic,” “unimproved property,” and “obsolescence.” <a href="https://dsl.richmond.edu/panorama/redlining" target="_blank" rel="noopener noreferrer">(Source)</a></p>
                             
            </section>
            <section><p style="font-size: 20px;">Investor Purchase & Community Rent Burden</p>
              <div class="legend-container">
                <div class="legend rent-burden">
                  <p>Rent Burden</p>
                  {#each rentBurdenLabels as d}
                    <div class="legend-item" style="--color: {d.color}">
                      <span class="swatch"></span>
                      <p>{d.label}</p>
                    </div>
                  {/each}
                </div>
              
                <div class="legend circle-sizes">
                  <p>Investor Purchases</p>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 4px; height: 4px;"></span>
                    <p>0%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 8px; height: 8px;"></span>
                    <p>5%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 12px; height: 12px;"></span>
                    <p>20%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 16px; height: 16px;"></span>
                    <p>30%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 20px; height: 20px;"></span>
                    <p>40%</p>
                  </div>
                  <div class="circle-size-item">
                    <span class="circle-swatch" style="width: 24px; height: 24px;"></span>
                    <p>100%</p>
                  </div>
                </div>
              </div>
              <p>
                The majority (54%) of Roxbury residents are rent-burdened, and 16% of all residential property sales (2000-2022) were purchased by investors.
                Housing prices in Roxbury <a href="https://huntnewsnu.com/50562/city/roxbury-residents-face-gentrification/" target="_blank" rel="noopener noreferrer">rose 70% between 2010 and 2015</a>, nearly double the city average.
                <a href="https://storymaps.arcgis.com/stories/c6352b5c740c40bfb3df33cab6eabb85" target="_blank" rel="noopener noreferrer">Northeastern University is a large contributor to gentrification in Roxbury</a>,
                admitting more students than it can house and encroaching on the neighborhood with new development projects.
                Grassroots organizers and movements like <a href="https://www.reclaimroxbury.org/mission-and-vision" target="_blank" rel="noopener noreferrer">Reclaim Roxbury</a> are fighting to resist displacement.
                There is an <a href="https://baystatebanner.com/2023/11/22/petition-aims-to-resist-planned-luxury-housing-on-blue-hill-avenue/" target="_blank" rel="noopener noreferrer">ongoing movement</a> to resist a luxury development on Blue Hill Ave, which will only provide 5 affordable housing units.
                </p>
                
                          
            </section>
            <section><p style="font-size: 20px;">Arrests per 1000 (2020-2024)</p>
              <ul class="legend">
                <li class="legend-item">
                  <span class="swatch" style="background-color: #E3BFBE;"></span>
                  <p>0</p>
                </li>
                <li class="legend-item">
                  <span class="swatch" style="background-color: #D6A2A1;"></span>
                  <p>40</p>
                </li>
                <li class="legend-item">
                  <span class="swatch" style="background-color: #CA8584;"></span>
                  <p>80</p>
                </li>
                <li class="legend-item">
                  <span class="swatch" style="background-color: #B55554;"></span>
                  <p>120</p>
                </li>
                <li class="legend-item">
                  <span class="swatch" style="background-color: #A12624;"></span>
                  <p>160+</p>
                </li>
              </ul>
              
              
              
              <p>With 176 arrests per 1000 residents between 2020 and 2024, Roxbury has the second-highest rate of arrests after Downtown. In the 1960s, the city government <a href="https://www.segregationbydesign.com/boston/dudley-street-baptist-church" target="_blank" rel="noopener noreferrer">displaced about 2,500 families and demolished Dudley St Church to make room for a police station</a>. The situation of this police station along with Boston Police Department Headquarters in Roxbury, the heart of Black culture in Boston, is an example of how policing is weaponized against racialized communities. As you can see in the image, the building of this police station coincided with a variety of other “urban renewal” projects that displaced thousands of residents throughout Roxbury. In response, activists formed the Greater Roxbury Incorporation Project (GRIP), also known as the Mandela Initiative, believing that “land control is the key to self-determination.” <a href="https://theflaw.org/articles/activism-and-land-control-in-a-changing-boston/" target="_blank" rel="noopener noreferrer">Saleh Ismail notes:</a>
              </p>
                <p><em>After repeated failures by the city government to desegregate the city… Roxbury residents identified Black liberation as the key to ensuring the continuity of their community. Many realized their relationship with the city mirrored the colonial relationship seen in much of the Global South, noting that “the economic relations of the ghetto to white America closely parallel [the relations] between third world nations and the industrially advanced countries.”</em>
                </p>

                <img src="{base}/roxbury_church_police_station.png" alt="Intersection in 1963 shows a church and many housing units. Same intersection in 2018 shows a police station and many parking lots where the church and housing once were." width=100%/>
                
            </section>
            <section><p style="font-size: 20px;">311 Service Requests Assigned to Police (2015-2024)</p>
              <div class="gradient-legend">
                <span>Lowest</span>
                <div class="gradient-bar"></div>
                <span>Highest</span>
              </div>
              <p>As we have seen, nuisance ordinances such as noise complaints are a part of the displacement process, leading police and inspectors to residents’ homes. In NYC, noise complaints are rising 70% faster in gentrifying neighborhoods than in the rest of the city <a href="https://psmag.com/social-justice/gentrification-increaes-noise-complaints-in-nyc/" target="_blank" rel="noopener noreferrer">(source)</a>. In Roxbury, noise complaint hotspots are clustered near the police stations and Northeastern University, <a href="https://huntnewsnu.com/50562/city/roxbury-residents-face-gentrification" target="_blank" rel="noopener noreferrer">which is developing student dorms and enrolling more students than it can house</a>. Clusters can be seen directly North and South of Horatio Harris Park, where a student researcher <a href="https://landscapes.northeastern.edu/malav-mehta/" target="_blank" rel="noopener noreferrer">noticed signs of urban renewal</a>. It <a href="https://archives.boston.gov/repositories/2/archival_objects/10334" target="_blank" rel="noopener noreferrer">underwent improvements in 1979-1980</a> and more recently was a <a href="https://www.raydunetz.com/portfolio/horatio-harris-park/" target="_blank" rel="noopener noreferrer">client of a landscape architecture firm</a>. Hotspots are also visible in areas surrounding Malcolm X park—named for the civil rights activist who once lived in Roxbury—the immediate surroundings of which have <a href="https://landscapes.northeastern.edu/malav-mehta/" target="_blank" rel="noopener noreferrer">already experienced gentrification</a>. In 2022, activists demonstrated at mayor Michelle Wu’s coffee hour, <a href="https://baystatebanner.com/2022/06/15/coalition-presses-mayor-on-police-budget/" target="_blank" rel="noopener noreferrer">protesting the city’s reconstruction of the park and plans to build new market-rate housing</a>. This action brought attention to the impact of policing on residents, with the Defund BosCops coalition demanding a $10 million cut to the BPD’s overtime budget.
</p>
                
            </section>
            <section><p style="font-size: 20px;">Building and Property Violations</p>
              <div class="gradient-legend violations">
                <span>Lowest</span>
                <div class="gradient-bar violations"></div>
                <span>Highest</span>
              </div>
            <p>Building and property violations are more concentrated on the Eastern side of Roxbury. These are typically associated with the early stages of urban "renewal," while as we have seen, many parts of the West side of Roxbury have already undergone redevelopment and gentrification. The concentration of Department of Buildings violations in Eastern Roxbury may be a warning sign of displacement to come. However, this area has also seen wins for community housing activists. Just past the Eastern border of Dorchester, the <a href="https://www.baystatebanner.com/2022/04/14/housing-activists-seek-to-expand-land-trusts/" target="_blank" rel="noopener noreferrer">Boston Neighborhood Community Land Trust acquired a multi-family home</a>, winning a years-long legal battle with a landlord attempting to evict tenants. They urged the city and state to use federal funds to acquire more land and preserve it as permanent affordable housing.
            </p>
            
              
            </section>
            <section><p style="font-size: 20px;">Eviction filings (2020-2022)</p>
              
              <div class="gradient-legend">
                <span>Lowest</span>
                <div class="gradient-bar"></div>
                <span>Highest</span>
              </div>
              <p>In addition to the hotspots noted in earlier data—near Northeastern University and surrounding Malcolm X Park—we see a large concentration of evictions along the edge of Franklin Park. This park has been called <a href="https://baystatebanner.com/2025/03/12/franklin-park-bostons-urban-oasis-for-generations/" target="_blank" rel="noopener noreferrer">“the shrine of Black golf in Boston,”</a>, with many local residents caring for the park themselves. The City of Boston just unveiled a $28 million renovation plan for the park, the <a href="https://www.boston.gov/departments/parks-and-recreation/franklin-park-action-plan#about" target="_blank" rel="noopener noreferrer">Franklin Park Action Plan</a>. While some groups have commended the involvement of the community in the creation of the Action Plan, groups like the Franklin Park Defenders are speaking out against the planned <a href="https://www.franklinparkdefenders.com/faqs" target="_blank" rel="noopener noreferrer">privatization of the park’s White Stadium, which was not a part of the approved plan for the park</a>. Our data shows that these development plans are already triggering displacement of residents through speculation triggering property value increases.
              </p>
              
                
            </section>
          </div>
        </Scroller>
        <p>As we have seen in this neighborhood narrative, Roxbury has a unique history of policing, displacement, activism and resiliency. In the next section, we invite you to create your own narratives using our interactive data explorer.</p>
      </div>
    <!-- end of content from svelte-scroller tutorial -->
    </div>
    <!-- <div class="next-chapter-link">
      <a href="{base}/chapter2-2">
        ↓ Chapter 2, Part 2: Data Explorer
      </a>
    </div> -->
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
  
  #scrollerMap, #roxburyMap {
    flex: 1;
    width: calc(50% - 1em);
    height: 400px;
    pointer-events: auto;
    position: relative;
    z-index: 0;
  }
  
  #scrollerMap svg, #roxburyMap svg {
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
          background-color: white;

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
          min-height: 60vh;
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

 /* General layout for the legend container */
 .legend-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px; 
  align-items: flex-start;
  margin-top: 16px;
  margin-bottom: 16px;
}


/* Styling for each legend */
.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 200px;
  font-family: Arial, sans-serif;
  flex: 0 1 auto;
}

/* Rent burden legend styling */
.rent-burden .legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #333;
}

.rent-burden .swatch {
  width: 18px;
  height: 18px;
  background-color: var(--color);
  border-radius: 50%;
  border: 1px solid #ddd;
}

.rent-burden p {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-transform: capitalize;
}

/* Circle size legend styling */
.circle-sizes .circle-size-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.circle-sizes .circle-swatch {
  width: 20px;
  height: 20px;
  background-color: #8790BC;
  border-radius: 50%;
  border: 1px solid #666;
  transition: all 0.2s ease;
}

.circle-sizes p {
  margin: 0;
  font-size: 14px;
  color: #333;
}



/* Styling for individual legend items */
.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #333;
}

.legend-item p {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-transform: capitalize;
}

/* Styling for the swatch (color square) */
.swatch {
  width: 18px;
  height: 18px;
  background-color: var(--color);
  border-radius: 50%;
  border: 1px solid #ddd;
  transition: all 0.2s ease;
  opacity: 0.7;
}

/* Adding hover effect to swatch for better interactivity */
.legend-item:hover .swatch {
  transform: scale(1.2);
}

.legend-container {
  padding-bottom: 20px;
}

    .circle-swatch {
      display: inline-block;
      background-color: #8790BC;
      border: 1px solid #666;
      border-radius: 50%;
      opacity: 0.7;
    }

    .gradient-legend {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: #333;
      max-width: fit-content;
      flex: 1 1 100%;
      /* position: absolute;
      bottom: 20px;
      left: 20px; */
    }

.gradient-bar {
  width: 160px;
  height: 14px;
  background: linear-gradient(to right, 
    rgba(0,0,255,0), 
    blue, 
    cyan, 
    lime, 
    yellow, 
    red);
  border-radius: 4px;
  border: 1px solid #ccc;
  opacity: 0.7;
}
.gradient-bar.violations {
  width: 160px;
  height: 14px;
  background: linear-gradient(to right, 
    rgba(0,0,255,0), 
    purple, 
    magenta, 
    orange, 
    gold, 
    red);
  border-radius: 4px;
  border: 1px solid #ccc;
  opacity: 0.7;
}


    
    
  
  </style>
  
  
  
    