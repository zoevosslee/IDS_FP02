<!-- src/lib/Legend.svelte -->
<script>
    export let visible = true;
  </script>
  
  {#if visible}
    <div class="legend">
      <h4>Education Quartiles</h4>
      <div><span style="background-color: #E6E8F1;"></span> 1st Quartile</div>
      <div><span style="background-color: #A6A7C4;"></span> 2nd Quartile</div>
      <div><span style="background-color: #666792;"></span> 3rd Quartile</div>
      <div><span style="background-color: #1A1841;"></span> 4th Quartile</div>
    </div>
  {/if}
  
  <style>
    .legend {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      z-index: 999;
    }
  
    .legend div {
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  
    .legend span {
      width: 18px;
      height: 18px;
      display: inline-block;
      border: 1px solid #ccc;
    }
  </style>
  