<!-- src/lib/Legend.svelte -->
<script>
    export let visible = true;
  </script>
  
  {#if visible}
    <div class="legend">
      <div class="legend-table">
        <div class="legend-block">
          <p><strong>Education Quartiles</strong></p>
          <div class="color-ind"><p><span style="background-color: #E6E8F1;"></span> 1st Quartile: fewest Bachelors degrees </p></div>
          <div class="color-ind"><p><span style="background-color: #A6A7C4;"></span> 2nd Quartile</p></div>
          <div class="color-ind"><p><span style="background-color: #666792;"></span> 3rd Quartile</p></div>
          <div class="color-ind"><p><span style="background-color: #1A1841;"></span> 4th Quartile: most Bachelors degrees </p></div>
        </div>
        <div class="legend-block">
          <p><strong>Income Quartiles</strong></p>
          <div class="color-ind"><p><span style="background-color: #E6E8F1;"></span> 1st Quartile: lowest income</p></div>
          <div class="color-ind"><p><span style="background-color: #A6A7C4;"></span> 2nd Quartile</p></div>
          <div class="color-ind"><p><span style="background-color: #666792;"></span> 3rd Quartile</p></div>
          <div class="color-ind"><p><span style="background-color: #1A1841;"></span> 4th Quartile: highest income</p></div>
        </div>
        <div class="legend-block">
          <p><strong>Race Quartiles</strong></p>
          <div class="color-ind"><p><span style="background-color: #E6E8F1;"></span> 1st Quartile: most residents of color and Hispanic residents</p></div>
          <div class="color-ind"><p><span style="background-color: #A6A7C4;"></span> 2nd Quartile</p></div>
          <div class="color-ind"><p><span style="background-color: #666792;"></span> 3rd Quartile</p></div>
          <div class="color-ind"><p><span style="background-color: #1A1841;"></span> 4th Quartile: most non-hispanic white residents</p></div>
        </div>
        <div class="legend-block">
          <p><strong>Rent Burden Quartiles</strong></p>
          <div class="color-ind"><p><span style="background-color: #E6E8F1;"></span> 1st Quartile: lowest rent burden</p></div>
          <div class="color-ind"><p><span style="background-color: #A6A7C4;"></span> 2nd Quartile</p></div>
          <div class="color-ind"><p><span style="background-color: #666792;"></span> 3rd Quartile</p></div>
          <div class="color-ind"><p><span style="background-color: #1A1841;"></span> 4th Quartile: highest rent burden</p></div>
        </div>
      </div>
      <p>100m in height is equivalent to one 311 request or DOB violation filing per 1,000 residents.</p>
    </div>
    
  {/if}
  
  <style>
    .legend {
      /* position: absolute;
      bottom: 20px;
      left: 20px; */
      background: white;
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.7rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      z-index: 999;
    }

    .legend-table {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    .legend p {
      font-size: 0.85rem;
      /* grid-row: 1; */
    }
  
    .color-ind, .legend div {
      margin-top: 0px;
      margin-bottom: 0px;
      padding-top: 0px;
      padding-bottom: 0px;
      /* display: flex; */
      align-items: center;
      gap: 0px;
    }
  
    .legend span {
      width: 18px;
      height: 18px;
      display: inline-block;
      border: 1px solid #ccc;
    }

    .legend-block {
      display: grid;
      grid-template-rows: repeat(5, 0.2fr);
      grid-template-columns: 1fr;
    }
  </style>
  