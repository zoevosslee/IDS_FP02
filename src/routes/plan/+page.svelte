<svelte:head>
  <title>Rent is a Trap!</title>
</svelte:head>

<script>
  let viewBy = 'week';
</script>

<div id="plan-page">
  <div class="container">
    <div class="text-content">
      <h4>Rent is a Trap!</h4>
      <h2>By Yeonhoo Cho, Nicola Lawford, Claudia Tomateo, Zoe Voss Lee</h2>
    </div>

    <div class="writeup">
      <h3>Project Plan</h3>

      <p><strong>Project Overview</strong></p>
      <ul>
        <li><p>Chapters 1 and 2 incorporate the greatest number of technical tools and techniques from this course, including Svelte-based interactive visualizations, D3-based data integration, and possibly scrollytelling.</p></li>
        <li><p>Chapters 3 and 4 involve qualitative research. These chapters rely more heavily on narrative framing, community context, and open-ended data exploration and multimedia web-interactivity.</p></li>
        <li><p>The project is structured to prioritize the development of Chapters 1 and 2 early, because they involve working in coding languages that are new to our team. Chapters 3 and 4 are grounded in research areas the team has existing experience with.</p></li>
      </ul>

      <p>For our FP02, our team had to clean 6 of the 8 quantitative datasets we will be using throughout our project, and build out the interactive data explorer tool that is a part of Chapter 2 – setting us up well to spend more time on interactivity, narrative, and visualizing things such as missing data. However, If we encounter a delay (team member personal challenge, technical bugs, time constraints, or data issues), we will prioritize completion of Chapters 1 and 2, as they are the most technically demanding and foundational to the project. Our contingency plans are as follows:
    </p>

      <p><strong>Contingency Planning</strong></p>
      <ul>
        <li><p><strong>Feasibility Plan A:</strong> The “missing data” tile visualization may be removed if interactivity bugs arise. Its ethos can still be represented via a simpler graphic or narrative explanation.</p></li>
        <li><p><strong>Feasibility Plan B:</strong> The interactive story gallery in Chapter 3 could be simplified to a non-clickable image + audio embed layout if time does not permit more complex interactive embeddings.</p></li>
        <li><p><strong>Feasibility Plan C:</strong> If needed, we will reduce interactive complexity in Chapters 3 and 4 and focus on narrative and visual storytelling to complement our interactive data components.</p></li>
      </ul>
      <p>We’ll also build in extra debugging time in Week 3 to catch problems early and maintain an open line of communication about blocking issues during team check-ins.</p>


      <div class="toggle-buttons">
        <button on:click={() => viewBy = 'week'} class:active={viewBy === 'week'}>View by Week</button>
        <button on:click={() => viewBy = 'task'} class:active={viewBy === 'task'}>View by Task</button>
      </div>

      {#if viewBy === 'week'}
        <p><strong>Week 1: April 14–20 — Setup + Static Visuals</strong></p>
        <ul>
          <li><p>Set up project structure and base layout – Yeonhoo + Zoe</p></li>
          <li><p>Clean/prep timeline data – Yeonhoo + Nicola</p></li>
          <li><p>Develop 8 static maps for Chapter 2 – Nicola + Claudia</p></li>
          <li><p>Research for community resistance map – Claudia + Zoe</p></li>
          <li><p>Refine interactive map explorer – Yeonhoo</p></li>
          <li><p>Write contextual/narrative text for Chapter 2 – Zoe + Claudia</p></li>
          <li><p>Design or refine resistance flower vector – Zoe</p></li>
        </ul>

        <p><strong>Week 2: April 21–27 — Interactive Timeline + MVP</strong></p>
        <ul>
          <li><p>Complete timeline + scrollytelling – Yeonhoo + Zoe</p></li>
          <li><p>Develop animated map 5 – Yeonhoo + Claudia</p></li>
          <li><p>Animate map transitions – Yeonhoo</p></li>
          <li><p>Continue narrative for Chapters 1 + 2 – Zoe + Claudia</p></li>
          <li><p>Draft missing data tile viz – Yeonhoo + Nicola</p></li>
          <li><p>MVP User Testing – All</p></li>
        </ul>

        <p><strong>Week 3: April 28–May 4 — Debugging + Qualitative Build</strong></p>
        <ul>
          <li><p>Debug timeline + map interactivity – All</p></li>
          <li><p>Qualitative research for Chapters 3 + 4 – Claudia + Zoe</p></li>
          <li><p>Build Chapter 3 gallery + audio – Nicola + Yeonhoo</p></li>
          <li><p>Draft User Guide + Methodology – Zoe</p></li>
          <li><p>Write glossary + site nav support – Zoe</p></li>
          <li><p>Accessibility review – Nicola</p></li>
        </ul>

        <p><strong>Week 4: May 5–11 — Final Integration + Polish</strong></p>
        <ul>
          <li><p>Finalize Chapter 3 narrative – Claudia</p></li>
          <li><p>Finalize Chapter 4 narrative – Zoe + Claudia</p></li>
          <li><p>Complete Chapter 4 layout – Yeonhoo + Nicola</p></li>
          <li><p>Polish User Guide + Methodology – Zoe</p></li>
          <li><p>Final accessibility updates – Nicola</p></li>
          <li><p>Full QA + site debug – All</p></li>
        </ul>
      {:else}
        <p><strong>Project-Wide Tasks (Spanning All Chapters)</strong></p>
        <ul>
          <li><p>Set up project structure and base layout – Yeonhoo + Zoe (Week 1)</p></li>
          <li><p>Build User Guide + Methodology page – Zoe (Weeks 3–4)</p></li>
          <li><p>Accessibility review – Nicola (Weeks 3–4)</p></li>
          <li><p>Final QA and debug – All (Week 4)</p></li>
          <li><p>Run MVP user testing – All (Week 2)</p></li>
        </ul>

        <p><strong>Chapter 1: Interactive Timeline</strong></p>
        <ul>
          <li><p>Clean/prep timeline data – Yeonhoo + Nicola (Week 1)</p></li>
          <li><p>Develop timeline + scrollytelling – Yeonhoo + Zoe (Week 2)</p></li>
          <li><p>Write/refine narrative – Zoe + Claudia (Weeks 2–3)</p></li>
        </ul>

        <p><strong>Chapter 2: Map Explorer</strong></p>
        <ul>
          <li><p>Develop 8 static maps – Nicola + Claudia (Week 1)</p></li>
          <li><p>Research for map 5 – Claudia + Zoe (Week 1)</p></li>
          <li><p>Develop map 5 – Yeonhoo + Claudia (Week 2)</p></li>
          <li><p>Animate map transitions – Yeonhoo (Week 2)</p></li>
          <li><p>Refine map explorer – Yeonhoo (Week 1)</p></li>
          <li><p>Write/refine narrative – Zoe + Claudia (Weeks 1–2)</p></li>
        </ul>

        <p><strong>Chapter 3: Gentrification Story Gallery</strong></p>
        <ul>
          <li><p>Qualitative research – Claudia + Zoe (Week 3)</p></li>
          <li><p>Build gallery/audio – Nicola + Yeonhoo (Week 3)</p></li>
          <li><p>Write narrative – Claudia (Week 4)</p></li>
        </ul>

        <p><strong>Chapter 4: Organizing Against Displacement</strong></p>
        <ul>
          <li><p>Qualitative content gathering – Claudia + Zoe (Week 3)</p></li>
          <li><p>Build multimedia layout – Yeonhoo + Nicola (Week 4)</p></li>
          <li><p>Write narrative – Zoe + Claudia (Week 4)</p></li>
        </ul>
      {/if}
    </div>
  </div>
</div>

<style>

    .writeup h3 {
      color: var(--red-medium);
      font-size: 22px;
    }
  .toggle-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .toggle-buttons button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
  }
  .toggle-buttons button.active {
    font-weight: bold;
    background: #f0f0f0;
  }
</style>
