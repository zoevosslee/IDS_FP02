<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { afterUpdate } from 'svelte';
  
  
  
    let selectedLens = null;
    let currentFrame = 0;
    let selectedStep = null;
    let svgRef;
    let stepElements = [];
    let showPolicing = false;
    let showStoryboard = false;

  
  
  
    let containerRef;
    let stepBindFns = [];
  let outcomeBindFns = [];
  
  $: {
    stepBindFns = steps.map((_, i) => (el) => stepRefs[i] = el);
    outcomeBindFns = steps.map((_, i) => (el) => outcomeRefs[i] = el);
  }
  
  
  function drawArrows() {
    const svg = d3.select(svgRef);
    svg.selectAll("*").remove();
  
    const svgRect = svgRef.getBoundingClientRect();
  
    stepRefs.forEach((stepEl, i) => {
    const outcomeEl = outcomeRefs[i];
    if (stepEl && outcomeEl && steps[i].outcome) {
  
      const rect1 = stepEl.getBoundingClientRect();
      const rect2 = outcomeEl.getBoundingClientRect();
  
      const startX = rect1.right - svgRect.left;
      const startY = rect1.top + rect1.height / 2 - svgRect.top;
      const endX = rect2.left - svgRect.left;
      const endY = rect2.top + rect2.height / 2 - svgRect.top;
  
      svg.append("path")
        .attr("d", `M${startX},${startY} C${(startX + endX) / 2},${startY} ${(startX + endX) / 2},${endY} ${endX},${endY}`)
        .attr("stroke", "#999")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
    }
  });
  
  
    stepRefs.forEach((el, i) => {
      if (el && stepRefs[i + 1]) {
        const rect1 = el.getBoundingClientRect();
        const rect2 = stepRefs[i + 1].getBoundingClientRect();
  
        const startX = rect1.left + rect1.width / 2 - svgRect.left;
        const startY = rect1.bottom - svgRect.top;
        const endX = rect2.left + rect2.width / 2 - svgRect.left;
        const endY = rect2.top - svgRect.top;
  
        svg.append("path")
          .attr("d", `M${startX},${startY} C${startX},${(startY + endY) / 2} ${endX},${(startY + endY) / 2} ${endX},${endY}`)
          .attr("stroke", "#999")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("marker-end", "url(#arrow)");
  
        svg.append("defs").html(`
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#999" />
          </marker>
        `);
      }
    });
  }
  
  
  onMount(() => {
    const observer = new ResizeObserver(drawArrows);
    observer.observe(document.body);
    setTimeout(drawArrows, 100);
  });
  
  
  
  
  
  
  const steps = [
    {
    id: 0,
    title: 'Pre-Eviction Conditions',
    label: 'Tenant is flagged, surveilled, or targeted before any formal eviction paperwork is filed. This can include 311 calls, police visits, landlord surveillance, or biased tenant screening.',
    outcome: '',
    isFormal: false
  }
  ,
  {
      id: 1,
      title: 'Notice to Quit',
      label: 'The landlord gives the tenant a written notice asking them to leave the apartment. The tenant usually has 14 or 30 days to move or respond.',
      outcome: 'Tenant moves out',
      isFormal: false
    },
    {
      id: 2,
      title: 'Summons and Complaint',
      label: 'If the tenant stays, the landlord delivers legal papers (a “summons” and a “complaint”) saying they’re suing to evict.',
      outcome: 'Tenant moves out',
      isFormal: false
    },
    {
      id: 3,
      title: 'Landlord Files in Court',
      label: 'The landlord files the eviction case in court and the process becomes official.',
      outcome: '',
      isFormal: true
    },
    {
      id: 4,
      title: 'Tenant Responds to Court',
      label: 'The tenant has a chance to respond to the court (called an “answer”) to explain their side or fight the eviction.',
      outcome: '',
      isFormal: true
    },
    {
      id: 5,
      title: 'Court Hearing or Judgment',
      label: 'The case goes to a hearing or mediation. The judge decides what happens. The tenant may be forced to move out or agree to move as part of a settlement.',
      outcome: 'Tenant defaults and is forced to move / Tenant moves out after settlement',
      isFormal: true
    },
    {
      id: 6,
      title: 'Eviction Warrant Issued',
      label: 'If the tenant is ordered to leave, the landlord gets a legal document (called an “execution”) from the court and gives it to the sheriff.',
      outcome: '',
      isFormal: true
    },
    {
      id: 7,
      title: 'Sheriff Gives Final Notice',
      label: 'The sheriff gives the tenant 48 hours’ notice to leave before they are physically removed.',
      outcome: 'Tenant moves out',
      isFormal: true
    },
    {
      id: 8,
      title: 'Forced Move-Out',
      label: 'The sheriff shows up and forcibly removes the tenant if they haven’t already left.',
      outcome: 'Tenant moved out by sheriff',
      isFormal: true
    }
  ];
  
  
    let stepRefs = Array(steps.length).fill(null);
    let outcomeRefs = Array(steps.length).fill(null);
    let flipStates = Array(steps.length).fill(false);
  
  
  
    const policingLenses = {
  "311": {
    label: "311 Service Requests",
    highlights: [1, 6],
    description: "How noise-related 311 service requests can trigger or accelerate eviction, especially in gentrifying neighborhoods where complaints reflect shifting social norms and racialized perceptions.",
    example: "After a neighbor files a 311 complaint about noise from a long-time tenant’s apartment – such as music or family gatherings – a police officer is dispatched. The landlord uses this as pretext to begin the eviction process under the guise of lease noncompliance or nuisance.",
    story: [
      "As housing prices rise, new residents move into historically working-class or immigrant neighborhoods.",
      "A neighbor calls 311 to report noise they find disruptive or 'suspicious.'",
      "The request is routed to the police, prompting police visits or inspections.",
      "The landlord is notified and uses the visit to justify initiating eviction proceedings.",
      "The tenant – often unaware of their rights – moves out or is removed.",
      "The unit is re-rented at a higher price, accelerating gentrification."
    ],
    storySteps: [0, 0, 0, 1, 1, 1]
  },

  "Code": {
    label: "Building & Property Violations",
    highlights: [1, 6],
    description: "How building and property violations are used in urban renewal zones to displace long-time residents and replace them with higher-income tenants.",
    example: "After the city designates a working-class neighborhood as an 'urban renewal zone,' inspectors begin issuing violations for minor infractions. A landlord uses the pressure to evict tenants and renovate the property for higher-paying renters.",
    story: [
      "The city announces an urban renewal initiative targeting a disinvested neighborhood.",
      "Developers and landlords anticipate rising property values.",
      "Inspectors issue multiple citations for minor infractions.",
      "Fines accumulate; landlords pressure tenants to vacate for 'major repairs.'",
      "Long-time tenants are displaced.",
      "The units are renovated and listed at luxury rates, shifting neighborhood demographics."
    ],
    storySteps: [0, 0, 0, 1, 1, 1]
  },

  "surveillance": {
    label: "Surveillance + Data Sharing",
    highlights: [2, 3, 5],
    description: "How surveillance and predictive tenant screening tools are used to initiate preemptive eviction based on algorithmic risk scores.",
    example: "A tenant is flagged by screening software for being a potential eviction risk. The landlord preemptively begins eviction proceedings based on this prediction.",
    story: [
      "Tenant screening software flags the resident as a risk.",
      "Landlord initiates legal action without a specific incident.",
      "The tenant is served with an eviction complaint.",
      "In court, the tenant attempts to contest the eviction but lacks legal support.",
      "The judge rules in favor of the landlord; tenant is displaced."
    ],
    storySteps: [0, 3, 2, 5, 5]
  },

  "criminal": {
    label: "Criminal Legal System",
    highlights: [2, 5, 6, 7],
    description: "How arrests or criminal allegations, even involving guests or unrelated individuals, can be grounds for eviction—especially under policies like HUD v. Rucker.",
    example: "A tenant’s guest is arrested for alleged drug possession. Under 'zero tolerance' policies, the tenant is evicted even if they had no knowledge of the offense.",
    story: [
      "A tenant’s guest is arrested near the property.",
      "The housing authority or landlord cites the incident as grounds for eviction.",
      "The tenant is unaware of the offense or is not legally involved.",
      "The tenant is evicted under nuisance or 'zero tolerance' policies.",
      "The unit is reassigned to a new tenant or sold at market rate."
    ],
    storySteps: [0, 3, 5, 8, 8]
  },

  "immigration": {
    label: "Immigration and ICE",
    highlights: [3, 8],
    description: "How undocumented tenants face heightened eviction risks due to court exposure, data sharing with ICE, and fear of detention.",
    example: "An undocumented tenant facing eviction avoids court due to ICE presence, resulting in a default judgment and later detention during forced removal.",
    story: [
      "A tenant falls behind on rent and is served an eviction notice.",
      "The landlord files a court case.",
      "The tenant wants to fight the case but fears ICE surveillance at court.",
      "They skip the hearing and receive a default judgment.",
      "During eviction enforcement, ICE agents detain the tenant."
    ],
    storySteps: [0, 3, 5, 5, 8]
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
  
    function bindStepElement(i) {
    return (el) => {
      stepElements[i] = el;
    };
  }
  
  afterUpdate(() => {
  if (!showPolicing || selectedLens === null || !stepRefs.length) {
    console.log("🚫 Conditions not met for highlighting");
    return;
  }

  // Clear previous highlights
  stepRefs.forEach((el, idx) => {
    el?.classList.remove("active-step");
  });

  // Get the target index for the current frame
  const stepIndex = policingLenses[selectedLens].storySteps[currentFrame];
  console.log("👉 Current frame:", currentFrame);
  console.log("👉 Eviction step index:", stepIndex);
  console.log("👉 stepRefs[stepIndex]:", stepRefs[stepIndex]);

  // Apply highlight
  const el = stepRefs[stepIndex];
  if (el) {
    el.classList.add("active-step");
    console.log("✅ Highlight added to step:", stepIndex);
  } else {
    console.log("⚠️ stepRef is null at index", stepIndex);
  }
});

afterUpdate(() => {
  if (!showPolicing || selectedLens === null || !stepRefs.length) return;

  // Clear previous highlights
  stepRefs.forEach((el) => {
    el?.classList.remove("active-step");
  });

  // Highlight the current eviction step
  const stepIndex = policingLenses[selectedLens].storySteps[currentFrame];
  const el = stepRefs[stepIndex];
  if (el) {
    el.classList.add("active-step");
  }
});




  
  
  </script>
  
    
    <style>
  
  .container {
    position: relative;
    display: flex;
    gap: 40px; /* wider spacing between chart and sidebar */
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 2rem;
  }
  
  .vertical-divider {
    width: 1px;
    background-color: var(--gray-medium);
    align-self: stretch;
    margin-top: 2rem;
  }
  
  .arrow-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
  }
  
  .eviction-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .row-pair {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 30px;
    margin-bottom:0.8rem;
    width: 100%;
  }
  
  .row-pair-header {
    display: flex;
    justify-content: space-between;
    align-items: left;
    gap: 20px;
    margin-bottom: 1rem;
  }
  
  .column-label {
    flex: 1;
    text-align: center;
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  

  .flip-container:hover .flipper {
    transform: rotateY(180deg);
  }
  
  
  /* Empty outcome */
  .outcome-box.empty {
    border: none;
    background: none;
  }
  
  /* Sidebar content */
  .lens-wrapper {
    margin-top: 35px;
    max-width: 600px;
    justify-content: space-around;
  }
  
  .lens-panel {
    max-width: 600px;
    padding: 1rem;
    border-radius: 8px;
    font-family: 'Utendo', sans-serif;
  }
  
  .lens-selector-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .lens-group {
    background-color: var(--blue-pale);
    margin-bottom: 20px;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .lens-label {
    font-family: 'Utendo', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    margin: 0;
    color: black;
  }
  
  .lens-explainer {
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
    font-family: 'Utendo', sans-serif;
    font-weight: 350;
    color: var(--gray-dark);
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
  
  .storyboard {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 6px;
  }
  
  .frame {
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
    font-family: 'Utendo', sans-serif;  /* match paragraph font */
    font-size: 1rem;                    /* adjust if needed */
    font-weight: 400;                   /* match your paragraph weight */
    color: white;            /* or inherit */
    background: var(--red);                  /* to blend in with background */
    border: 1px solid var(--gray-dark); /* optional: add a subtle border */
  }
  
  .flex-end {
    display: flex;
    justify-content: flex-end;
  }
  
  
  .panel-spacer {
    height: 1.5rem;
  }
  
  .row-pair {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 20px;
  }
  
  /* Enforce consistent dimensions */
  .flip-container {
    perspective: 1000px;
    width: 100%;
    min-width: 380px;
    max-width: 380px;
    height: calc(100vh / 11);
  }
  
  .flipper {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .flip-container:hover .flipper {
    transform: rotateY(180deg);
  }
  
  .card-box,
  .front,
  .back {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    font-family: 'Utendo', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    box-sizing: border-box;
    backface-visibility: hidden;
  }
  
  .card-box {
    min-height: calc(100vh / 14);
    max-height: calc(100vh / 12);
  }
  
  .front {
    background: var(--red-light);
    -webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;

  }
  
  .back {
    background: var(--gray-light);
    border: 3px solid var(--red-light);
    transform: rotateY(180deg);
    -webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;

  }
  
  /* Displacement Outcome Cards */
  .outcome-front {
    background: var(--red-light);
    border:2px solid var(--red);
    color: white;
    font-weight: 200;
    -webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;

  }
  
  .outcome-back {
    background: var(--white);
    border: 2px solid var(--red);
  }

  
  /* Empty outcome slot */
  .outcome-box.empty {
    border: none;
    background: none;
  }
  
  /* Sidebar + Lens Styles */
  .lens-wrapper {
    margin-top: 35px;
    max-width: 600px;
  }
  
  .lens-panel {
    padding: 1rem;
    border-radius: 8px;
    font-family: 'Utendo', sans-serif;
  }
  
  .lens-selector-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .lens-group {
    padding: 1rem;
    border-radius: 8px;
  }
  
  
  
  .lens-explainer {
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
    font-weight: 350;
    color: var(--gray-dark);
  }
  
  .button-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .button-row button {
    padding: 0.5rem 1rem;
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
  
  .panel-spacer {
    height: 1.5rem;
  }
  
  /* Eviction Process Card Text */
  .front.card-box h3,
  .front.card-box p,
  .back.card-box p {
    color: black;
  }
  
  .step-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .step-number {
    font-size: 2.25rem;
    font-weight: 700;
    margin: 0;
    flex-shrink: 0;
  }
  
  .step-text {
    margin: 0;
    font-size: 1rem;
    line-height: 1.4;
  }
  

  


.eviction-chart {
  font-size: 0.9rem; /* reduce slightly */
}

.flip-container {
  min-width: 320px;
  max-width: 320px;
  height: calc(100vh / 13); /* smaller height per row */
}

.card-box {
  padding: 0.5rem 0.75rem;
}

.card-box h3 {
  font-size: 1rem;
  line-height: 1.2;
  font-weight: 600;
  margin: 0;
}

.card-box p {
  font-size: 0.9rem;
  line-height: 1.4;
}

.back.card-box p {
  font-size: 0.75rem;
  line-height: 1.3;
}

.column-label h2 {
  font-size: 18px;
  color:black;
  font-weight: 600; /* or try 300 for even lighter */
  text-decoration: underline;
  text-decoration-thickness: 2px; /* thickness of the underline */
  margin: 0;
}

:global(.flip-container.active-step) {
  animation: softPulse 2.5s ease-in-out infinite;
  box-shadow: 0 0 15px 8px #8790BC; /* warm orange */

  border-radius: 8px;
  transition: all 0.3s ease;
}


@keyframes subtlePulse {
  0% {
    box-shadow: 0 0 0 rgba(255, 220, 100, 0.3);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(255, 220, 100, 0.5);
  }
  100% {
    box-shadow: 0 0 0 rgba(255, 220, 100, 0.3);
  }
}


    </style>

  <div class="container" bind:this={containerRef}>
    <svg bind:this={svgRef} class="arrow-svg"></svg>
  
    <div class="eviction-chart">
        <div class="chart-scaler">
      <div class="row-pair-header">
        <div class="column-label"><h2>Eviction Process</h2></div>
        <div class="column-label"><h2>Displacement Outcome</h2></div>
      </div>
  
      {#each steps as step, i (step.id)}
        <div class="row-pair">
          <!-- Eviction Process Flip Card -->
          <div class="flip-container" bind:this={stepRefs[i]}>
            <div class="flipper">
              <div class="front card-box">
                <h3>{step.id === 0 ? 'Step 0: ' : `Step ${step.id}: `}{step.title}</h3>
              </div>
              <div class="back card-box">
                {#if step.label}
                  <p>{step.label}</p>
                {:else}
                  <p>No additional details.</p>
                {/if}
              </div>
            </div>
          </div>
  
          <!-- Displacement Outcome Flip Card (ALWAYS RENDERED) -->
          <div class="flip-container" bind:this={outcomeRefs[i]}>
            <div class="flipper">
              {#if step.outcome}
                <div class="front card-box outcome-front">
                  <h3>{step.outcome}</h3>
                </div>
                <div class="back card-box outcome-back">
                  {#if step.isFormal}
                    <p>This may result in a formal eviction which goes on your record and can affect future housing.</p>
                  {:else}
                    <p>This step may lead to displacement without the filing of an official eviction. While not accounted for in official eviction numbers, the effect on the tenant who is displaced may be the same.</p>
                  {/if}
                </div>
              {:else}
                <div class="front card-box outcome-box empty"><p>&nbsp;</p></div>
                <div class="back card-box outcome-box empty"><p>&nbsp;</p></div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
    </div>
    <div class="vertical-divider"></div>
  
  
  
    <div class="column">
        {#key showPolicing}
          {#if !showPolicing}
            <!-- INTRO PANEL -->
            <div class="lens-panel lens-intro">
              <p class="p-bold">How Evictions Happen</p>
              <p>This walkthrough illustrates how formal eviction proceedings typically unfold. There are multiple points at which displacement can occur — including before court proceedings even begin. Often, the mere threat of eviction can force a tenant to leave. And if a tenant receives a formal eviction judgment, it can follow them for years, affecting their ability to find future housing.</p>
              <p>The chart to the right is adapted from <a href="https://d3n8a8pro7vhmx.cloudfront.net/themes/5eee7e564445ea4f9a6f3080/attachments/original/1592786979/EvictionReport_Final_Spreads.pdf?1592786979" target="_blank" rel="noopener noreferrer">a 2020 report by City Life/Vida Urbana</a> titled <em>Evicted for Being Poor</em>, which documents how landlords often use eviction filings not to win in court, but to pressure tenants into leaving. These proceedings are frequently traumatic, opaque, and wielded unequally.</p>
              <p class="p-bold">But this isn't the full story.</p>
              <p>There are different types of policing that can lead to displacement in different ways. In most cases, policing is not the only factor at play, but part of a broader pattern of systemic dispossession. This section highlights how different policing systems interact with housing precarity and eviction. These examples are far from exhaustive, but are intended to educate and inform tenants about how different forms of policing may be — or have been — part of their housing story.</p>
      
              <div class="flex-end">
                <button on:click={() => showPolicing = true} class="next-button">How Policing Connects →</button>
              </div>
            </div>
      
          {:else if showPolicing && !showStoryboard}
            <!-- LENS SELECTION PANEL -->
            <div class="lens-panel lens-intro">
              <p class="p-bold">How Policing Connects</p>
              <p>Select a category below to explore how policing systems interact with eviction and housing precarity.</p>
      
              <!-- Auxiliary Policing -->
              <div class="lens-group">
                <p class="lens-label">Auxiliary Policing</p>
                <p class="lens-explainer">311 noise complaints, property code enforcement, and predictive tenant screening systems.</p>
                <div class="button-row">
                  <button class:active={selectedLens === "311"} on:click={() => { selectedLens = "311"; showStoryboard = true; }}>
                    311 Service Requests
                  </button>
                  <button class:active={selectedLens === "Code"} on:click={() => { selectedLens = "Code"; showStoryboard = true; }}>
                    Building & Property Violations
                  </button>

                </div>
              </div>
      
              <!-- Formal Policing -->
              <div class="lens-group">
                <p class="lens-label">Formal Policing</p>
                <p class="lens-explainer">Criminal legal system and immigration enforcement involvement in eviction.</p>
                <div class="button-row">
                  <button class:active={selectedLens === "criminal"} on:click={() => { selectedLens = "criminal"; showStoryboard = true; }}>
                    Criminal Legal System
                  </button>
                  <button class:active={selectedLens === "immigration"} on:click={() => { selectedLens = "immigration"; showStoryboard = true; }}>
                    Immigration and ICE
                  </button>
                </div>
              </div>
            </div>
      
          {:else if showPolicing && showStoryboard}
            <!-- STORYBOARD PANEL -->
            <div class="lens-panel">
              <p class="p-bold">Description:</p>
              <p>{policingLenses[selectedLens].description}</p>
              <p class="p-bold">Example:</p>
              <p>{policingLenses[selectedLens].example}</p>
      
              <div class="storyboard">
                {#each policingLenses[selectedLens].story.slice(0, currentFrame + 1) as frame, index}
                  <div class="frame step-row">
                    <h4 class="step-number">{index + 1}.</h4>
                    <p class="step-text">{frame}</p>
                  </div>
                {/each}
      
                {#if currentFrame < policingLenses[selectedLens].story.length - 1}
                  <button class="next-button" on:click={nextFrame}>Next</button>
                {/if}
              </div>
      
              <div class="flex-end" style="margin-bottom: 1rem;">
                <button on:click={() => showStoryboard = false} class="next-button">← Back to Lenses</button>
              </div>
            </div>
          {/if}
        {/key}
      </div>
      
  </div>  
    