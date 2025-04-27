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
      <!-- <p><strong>GEOID:</strong> <span class="highlight">{props.GEOID}</span></p> -->
  
      <p>
        In <span class="highlight">{year}</span>, this block group in 
        <strong><span class="highlight">{props.blockgr2020_ctr_neighb_name}</span></strong> had a population of 
        <span class="highlight">{props.population ?? 'unknown'}</span>.
      </p>
  
      {#if education != null}
        <p>
          <span class="highlight">{Math.ceil(education * 100)}%</span> of residents held a Bachelor’s degree or higher 
          <span>(Quartile {educationQuartile})</span>.
        </p>
      {/if}
  
      {#if income != null}
        <p>
          The median income was <span class="highlight">${Math.ceil(income)}</span> 
          <span>(Quartile {incomeQuartile})</span>.
        </p>
      {/if}
  
      {#if race != null}
        <p>
          <span class="highlight">{Math.ceil(race * 100)}%</span> of residents were white 
          <span>(Quartile {raceQuartile})</span>.
        </p>
      {/if}
  
      {#if rentBurden != null}
        <p>
          <span class="highlight">{Math.ceil(rentBurden * 100)}%</span> of households were rent-burdened 
          <span>(Quartile {rentQuartile})</span>.
        </p>
      {/if}
  
      <!-- {#if requests != null}
        <p>
          There were <span class="highlight">{requests}</span> 311 noise complaints, about 
          <span class="highlight">{Math.round(reqsPer1000)}</span> per 1,000 residents.
        </p>
      {/if}
  
      {#if violations != null}
        <p>
          There were <span class="highlight">{violations}</span> DOB violations, roughly 
          <span class="highlight">{Math.round(violPer1000)}</span> per 1,000 residents.
        </p>
      {/if} -->
    {:else}
      <p>No feature selected.</p>
    {/if}
  </div>
  
  
  <style>
    .floating-panel {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: #A12624;
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      max-width: 180px;
      max-height: 250px;
      overflow-y: auto;
      font-size: 0.75rem; /* base size */
      line-height: 1.2;
      z-index: 999;
      font-family: 'Utendo', sans-serif; /* make sure it's using your Utendo font */
    }
  
    .floating-panel h3,
    .floating-panel p,
    .floating-panel strong,
    .floating-panel span {
      color: #E3BFBE;
      font-size: 1em; /* 👈 important: inherit from floating-panel */
      font-weight: 400;
    }
  
    .floating-panel h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-weight: 700;
      font-size: 1.2em; /* 20% bigger than p text */
    }
  
    .floating-panel p {
      margin: 0.3rem 0;
      font-size: 1em; /* explicitly reset to inherit */
    }

    .floating-panel .highlight {
    font-weight: 1000;
    font-size: 1.4em;
    color: white
  }
  </style>
  
  
  
  
  
  
  