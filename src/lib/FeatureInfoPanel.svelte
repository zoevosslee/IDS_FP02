<script>
    export let feature;
    export let year;
  
    $: props = feature?.properties || {};
    $: education = props[`BachelorOrHigher${year}`];
    $: educationQuartile = props[`BachelorOrHigher${year}_quartile`];
    $: income = props[`MedianIncome${year}`];
    $: incomeQuartile = props[`MedianIncome${year}_quartile`];
    $: race = props[`White${year}`];
    $: raceQuartile = props[`White${year}_quartile`];
    $: rentBurden = props[`RentBurden${year}`];
    $: rentQuartile = props[`RentBurden${year}_quartile`];
  
    $: requests = props[`requests_${year}`];
    $: reqsPer1000 = props[`reqs_per_1000`];
    $: violations = props[`violations_${year}`];
    $: violPer1000 = props[`viol_per_1000`];
  </script>
  
  <div class="floating-panel">
    <h3>Selected Block Group</h3>
  
    {#if feature}
      <p><strong>GEOID:</strong> {props.GEOID}</p>
      <p>
        In {year}, this block group in <strong>{props.neighborhood}</strong> had a population of 
        {props.population ?? 'unknown'}.
      </p>
  
      {#if education != null}
        <p>
          <strong>{Math.ceil(education * 100)}%</strong> of residents held a Bachelor’s degree or higher 
          <span>(Quartile {educationQuartile})</span>.
        </p>
      {/if}
  
      {#if income != null}
        <p>
          The median income was <strong>${Math.ceil(income)}</strong> 
          <span>(Quartile {incomeQuartile})</span>.
        </p>
      {/if}
  
      {#if race != null}
        <p>
          <strong>{Math.ceil(race * 100)}%</strong> of residents were white 
          <span>(Quartile {raceQuartile})</span>.
        </p>
      {/if}
  
      {#if rentBurden != null}
        <p>
          <strong>{Math.ceil(rentBurden * 100)}%</strong> of households were rent-burdened 
          <span>(Quartile {rentQuartile})</span>.
        </p>
      {/if}
  
      {#if requests != null}
        <p>
          There were <strong>{requests}</strong> 311 noise complaints, about 
          <strong>{Math.round(reqsPer1000)}</strong> per 1,000 residents.
        </p>
      {/if}
  
      {#if violations != null}
        <p>
          There were <strong>{violations}</strong> DOB violations, roughly 
          <strong>{Math.round(violPer1000)}</strong> per 1,000 residents.
        </p>
      {/if}
    {:else}
      <p>No feature selected.</p>
    {/if}
  </div>
  
  <style>
    .floating-panel {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      max-width: 300px;
      font-size: 0.9rem;
      z-index: 999;
    }
  </style>
  