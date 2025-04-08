<script>
    export let feature;
    export let year;

    $: properties = feature?.properties || {};

    $: education = properties[`BachelorOrHigher${year}`];
    $: income = properties[`MedianIncome${year}`];
    $: race = properties[`White${year}`];
    $: rentBurden = properties[`RentBurden${year}`];

  </script>
  
  <div class="floating-panel">
    <h3>Selected Block Group</h3>
  
    {#if feature}
      <p><strong>GEOID:</strong> {feature.properties.GEOID}</p>
  
      {#if year === 2023}
        <p><strong>BA or Higher (2023):</strong> {Math.ceil(feature.properties.BachelorOrHigher2023 * 100)}%</p>
        <p><strong>Median Income (2023):</strong> ${Math.ceil(feature.properties.MedianIncome2023)}</p>
        <p><strong>White (2023):</strong> {Math.ceil(feature.properties.White2023*100)}%</p>
        <p><strong>Rent Burdened (2023):</strong> {Math.ceil(feature.properties.RentBurden2023*100)}%</p>
      {:else}
        <p><strong>BA or Higher (2015):</strong> {Math.ceil(feature.properties.BachelorOrHigher2015*100)}%</p>
        <p><strong>Median Income (2015):</strong> ${Math.ceil(feature.properties.MedianIncome2015)}</p>
        <p><strong>White (2015):</strong> {Math.ceil(feature.properties.White2015*100)}%</p>
        <p><strong>Rent Burdened (2015):</strong> {Math.ceil(feature.properties.RentBurden2015*100)}%</p>
      {/if}
  
      <p><strong>Quartile:</strong> {feature.properties.quartile}</p>
    {:else}
      <p>No feature selected.</p>
    {/if}
  </div>
  
  <style>

  </style>
  