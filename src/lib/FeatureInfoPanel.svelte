<script>
    export let feature;
    export let year;
  </script>
  
  <div class="floating-panel">
    <h3>Selected Block Group</h3>
  
    {#if feature}
      <p><strong>GEOID:</strong> {feature.properties.GEOID}</p>
  
      {#if year === 2023}
        <p><strong>Education (2023):</strong> {feature.properties.BachelorOrHigher2023}%</p>
      {:else}
        <p><strong>Education (2015):</strong> {feature.properties.BachelorOrHigher2015}%</p>
      {/if}
  
      <p><strong>Quartile:</strong> {feature.properties.quartile}</p>
    {:else}
      <p>No feature selected.</p>
    {/if}
  </div>
  
  <style>

  </style>
  