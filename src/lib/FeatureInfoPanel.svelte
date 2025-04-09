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

      <p>In {year}, this block group in <strong>[Neighborhood]</strong> had a population of {feature.properties.population}.</p>
  
      {#if year === 2023}
        {#if feature.properties?.BachelorOrHigher2023}
          <p><strong>{Math.ceil(feature.properties.BachelorOrHigher2023 * 100)}%</strong> of people had a Bachelor's degree or higher (quartile <strong>{feature.properties.BachelorOrHigher2023_quartile}</strong>)</p>
        {:else}
          <p>We don't have education data for this block group.</p>
        {/if}
        {#if feature.properties?.MedianIncome2023}
          <p>The median income was <strong>${Math.ceil(feature.properties.MedianIncome2023)}</strong> (quartile <strong>{feature.properties.MedianIncome2023_quartile}</strong>)</p>
        {:else}
          <p>We don't have income data for this block group.</p>
        {/if}
        {#if feature.properties?.White2023}
          <p><strong>{Math.ceil(feature.properties.White2023 * 100)}%</strong> of people were white (quartile <strong>{feature.properties.White2023_quartile}</strong>)</p>
        {:else}
          <p>We don't have data about race for this block group.</p>
        {/if}
        {#if feature.properties?.RentBurden2023}
          <p><strong>{Math.ceil(feature.properties.RentBurden2023 * 100)}%</strong> of people were rent-burdened (quartile <strong>{feature.properties.RentBurden2023_quartile}</strong>)</p>
        {:else}
          <p>We don't have data about rent burden for this block group.</p>
        {/if}
        <p>In this year, <strong>{feature.properties.requests_2023}</strong> 311 requests about noise complaints were called on this neighborhood - that's <strong>{Math.round(feature.properties.reqs_per_1000)} per 1,000 residents</strong>.</p>
        <p>There were <strong>{feature.properties.violations_2023}</strong> DOB violations filed in this neighborhood - that's <strong>{Math.round(feature.properties.viol_per_1000)} per 1,000 residents</strong>.</p>
      {:else}
        {#if feature.properties?.BachelorOrHigher2015}
          <p><strong>{Math.ceil(feature.properties.BachelorOrHigher2015 * 100)}%</strong> of people had a Bachelor's degree or higher (quartile <strong>{feature.properties.BachelorOrHigher2015_quartile}</strong>)</p>
        {:else}
          <p>We don't have education data for this block group.</p>
        {/if}
        {#if feature.properties?.MedianIncome2015}
          <p>The median income was <strong>${Math.ceil(feature.properties.MedianIncome2015)}</strong> (quartile <strong>{feature.properties.MedianIncome2015_quartile}</strong>)</p>
        {:else}
          <p>We don't have income data for this block group.</p>
        {/if}
        {#if feature.properties?.White2015}
          <p><strong>{Math.ceil(feature.properties.White2015 * 100)}%</strong> of people were white (quartile <strong>{feature.properties.White2015_quartile}</strong>)</p>
        {:else}
          <p>We don't have data about race for this block group.</p>
        {/if}
        {#if feature.properties?.RentBurden2015}
          <p><strong>{Math.ceil(feature.properties.RentBurden2015 * 100)}%</strong> of people were rent-burdened (quartile <strong>{feature.properties.RentBurden2015_quartile}</strong>)</p>
        {:else}
          <p>We don't have data about rent burden for this block group.</p>
        {/if}
        <p>In this year, <strong>{feature.properties.requests_2015}</strong> 311 requests about noise complaints were called on this neighborhood - that's <strong>{Math.round(feature.properties.reqs_per_1000)} per 1,000 residents</strong>.</p>
      <p>There were <strong>{feature.properties.violations_2015}</strong> DOB violations filed in this neighborhood - that's <strong>{Math.round(feature.properties.viol_per_1000)} per 1,000 residents</strong>.</p>
      {/if}
    {:else}
      <p>No feature selected.</p>
    {/if}
  </div>
  
  <style>
    body {
      height: 200px

    }

  </style>
  