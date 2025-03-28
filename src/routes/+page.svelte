<script>
    import { onMount } from 'svelte';
    import { initMap } from '$lib/map.js';
    import TimelineSlider from '$lib/TimelineSlider.svelte';
  
    let mapContainer;
    let year = 2004;
    let map;
    const years = Array.from({ length: 21 }, (_, i) => 2004 + i); // 2004–2024
  
    function updateYear(y) {
      year = y;
      if (map && map.getSource('boston-data')) {
        const filter = ['==', ['get', 'year'], year];
        map.setFilter('corporate-ownership', filter);
      }
    }
  
    onMount(async () => {
      const { map: initializedMap } = await initMap(mapContainer);
      map = initializedMap;
      updateYear(year);
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
    
    <div id="map" bind:this={mapContainer} style="width: 100%; height: 500px;"></div>
    <TimelineSlider {years} {year} onYearChange={updateYear} />
  </div>
</div>
r {years} {year} onYearChange={updateYear} />
  