<script>
    import { onMount } from 'svelte';
  
    let selectedLens = null;
    let currentFrame = 0;
  
    const steps = [
      { id: '1', label: 'Tenant receives a notice to quit. Has 14 or 30 days to respond.', outcome: 'Tenant moves out' },
      { id: '2', label: 'Landlord serves a summons and complaint to tenant', outcome: 'Tenant moves out' },
      { id: '3', label: 'Landlord files complaint in court', outcome: '' },
      { id: '4', label: 'Tenant can file an answer to the complaint', outcome: '' },
      { id: '5', label: 'Trial or pre-trial mediation and court judgment', outcome: 'Tenant defaults and is forced to move / Tenant moves out after settlement' },
      { id: '6', label: 'Landlord gets execution from court and gives it to sheriff’s office', outcome: '' },
      { id: '7', label: 'Sheriff serves execution, tenant has 48 hours to move', outcome: 'Tenant moves out' },
      { id: '8', label: 'Sheriff authorized to forcibly move out tenant', outcome: 'Tenant moved out by sheriff' }
    ];
  
    const policingLenses = {
      "criminal": {
        label: "Criminal Legal System",
        highlights: [2, 5, 6, 7],
        description: "How criminal records and policing actions intersect with eviction enforcement.",
        example: "A tenant is arrested on unrelated charges. The landlord uses this as justification to pursue an eviction, citing public safety.",
        story: [
          "A tenant is arrested for an unrelated issue.",
          "The landlord cites the arrest in court.",
          "An eviction judgment is granted."
        ]
      },
      "311": {
        label: "311 + Code Enforcement",
        highlights: [1, 6],
        description: "How 311 calls and building code enforcement can trigger or accelerate eviction.",
        example: "After a neighbor files a 311 complaint about noise, an inspector finds minor violations. The landlord uses this as pretext to begin the eviction process.",
        story: [
          "A neighbor files a 311 noise complaint.",
          "An inspector visits and finds a code issue.",
          "The landlord begins the eviction process."
        ]
      },
      "immigration": {
        label: "Immigration and ICE",
        highlights: [3, 8],
        description: "How information sharing with ICE can escalate housing instability.",
        example: "During court proceedings, information about the tenant’s undocumented status is reported to ICE, leading to detention during the eviction.",
        story: [
          "Tenant's undocumented status is recorded in court paperwork.",
          "Court data is shared with immigration enforcement, flagging the tenant.",
          "Tenant is detained just before sheriff arrives."
        ]
      },
      "surveillance": {
        label: "Surveillance + Data Sharing",
        highlights: [3, 4, 5],
        description: "How surveillance and predictive tools influence the eviction process.",
        example: "A landlord uses tenant screening software that flags a renter based on an eviction risk score, initiating preemptive legal action.",
        story: [
          "Screening software flags the tenant.",
          "Landlord files a complaint based on the flag.",
          "Tenant is served legal papers."
        ]
      }
    };
  
    $: if (selectedLens !== null) {
      currentFrame = 0;
    }
  
    function nextFrame() {
      if (currentFrame < policingLenses[selectedLens].story.length - 1) {
        currentFrame += 1;
      }
    }
  </script>
  
  <style>
  .container {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    justify-content: space-around;
    margin-top: 2rem;
  }
  
  .column {
    
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  
  .column-label {
    font-weight: bold;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .step-box, .outcome-box {
    width: 300px;
    padding: .7rem;
    background: white;
    border-radius: 8px;
    font-family: 'Utendo', sans-serif;
  }
  
  .step-box {
    border: 1px solid var(--gray-dark);
  }
  
  .outcome-box {
    border: 2px solid var(--orange-primary);
    color: var(--orange-primary);
    font-weight: bold;
  }
  
  .outcome-box.empty {
    border: none;
    background: none;
  }
  
  .lens-selector-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .lens-group {
    background: var(--orange-light);
    padding: 1rem;

    border-radius: 8px;
  }
  
  .lens-label {
    font-family: 'Utendo', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    margin: 0;
    color: var(--red);
  }
  
  .lens-explainer {
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
    font-family: 'Utendo', sans-serif;
    font-weight: 350;
    color: var(--gray-dark);
  }

  .lens-wrapper{
    margin-top:35px;
    max-width: 600px;
    justify-content: space-around;
  }
  
  .button-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .button-row button {
    padding: 0.5rem 1rem;
    font-family: 'Utendo', sans-serif;
    font-size: 0.9rem;
    background: var(--gray-medium);
    color: var(--black);
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .button-row button.active {
    background: var(--red);
    color: white;
  }
  
  .lens-panel {
    max-width: 600px;
    background: var(--orange-light);
    padding: 1rem;
    border-radius: 8px;
    font-family: 'Utendo', sans-serif;
  }
  
  .storyboard {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 6px;
  }
  
  .frame {
    background: white;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  
  .next-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .eviction-chart {
    display: flex;
    gap: 10px;
    margin-right: 30px;
    flex-shrink: 0;
    flex-grow: 0;
  }
  </style>
<div class="container">
    <div class="eviction-chart">
      <div class="column">
        <h3 class="column-label">Eviction Process</h3>
        {#each steps as step, i}
          <div class="step-box" style="background-color: {selectedLens && policingLenses[selectedLens].highlights.includes(i) ? 'var(--blue-light)' : 'white'}">
            <p>{step.label}</p>
          </div>
        {/each}
      </div>
  
      <div class="column gap-column">
        <h3 class="column-label">Displacement Outcome</h3>
        {#each steps as step}
          {#if step.outcome}
            <div class="outcome-box"><p>{step.outcome}</p></div>
          {:else}
            <div class="outcome-box empty"></div>
          {/if}
        {/each}
      </div>
    </div>
  
    <div class="column">
      <div class="lens-wrapper">
        <h3 class="lens-explainer">
          There are different types of policing that can lead to displacement in different ways. In most cases, policing is not the only factor at play, but part of a broader pattern of structural risk. This section highlights how different policing systems interact with housing precarity and eviction.
        </h3>
  
        <div class="lens-selector-group">
          <div class="lens-group">
            <p class="lens-label">Auxiliary Policing</p>
            <p class="lens-explainer">City systems like 311, inspections, and predictive tech that can initiate or accelerate eviction.</p>
            <div class="button-row">
              <button class:active={selectedLens === "311"} on:click={() => selectedLens = "311"}>311 + Code Enforcement</button>
              <button class:active={selectedLens === "surveillance"} on:click={() => selectedLens = "surveillance"}>Surveillance + Data Sharing</button>
            </div>
          </div>
  
          <div class="lens-group">
            <p class="lens-label">Formal Policing</p>
            <p class="lens-explainer">Law enforcement, courts, and immigration systems directly involved in enforcing eviction.</p>
            <div class="button-row">
              <button class:active={selectedLens === "criminal"} on:click={() => selectedLens = "criminal"}>Criminal Legal System</button>
              <button class:active={selectedLens === "immigration"} on:click={() => selectedLens = "immigration"}>Immigration and ICE</button>
            </div>
          </div>
        </div>
  
        {#if selectedLens}
          <div class="lens-panel">
            <p class="p-bold">Description:</p>
            <p>{policingLenses[selectedLens].description}</p>
            <p class="p-bold">Example:</p>
            <p>{policingLenses[selectedLens].example}</p>
  
            <div class="storyboard">
              {#each policingLenses[selectedLens].story.slice(0, currentFrame + 1) as frame}
                <div class="frame"><p>{frame}</p></div>
              {/each}
              {#if currentFrame < policingLenses[selectedLens].story.length - 1}
                <button class="next-button" on:click={nextFrame}>Next</button>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  