<script>
    export let selectedYear;
    export let onChange;
  </script>
  
  <div class="year-toggle">
    <button 
      on:click={() => onChange(2015)} 
      class:selected={selectedYear === 2015}
    >
      2015
    </button>
    <button 
      on:click={() => onChange(2023)} 
      class:selected={selectedYear === 2023}
    >
      2023
    </button>
  </div>
  
  <style>
    .year-toggle {
      display: inline-flex;
      border-radius: 5px;
      overflow: hidden;
    font-family: 'Utendo', sans-serif;
    font-size: 16px;
    font-weight: 400;
      background-color: #eee;
    }
  
    .year-toggle button {
      border: none;
      padding: 0.6rem 1.2rem;
      font: inherit;
      cursor: pointer;
      color: var(--gray-dark);
      background-color: transparent;
      transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.2s ease;
      flex: 1;
    }
  
    .year-toggle button.selected {
      background-color: var(--red-medium);
      color: white;
      box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
  
    .year-toggle button:not(.selected):hover {
      background-color: var(--red-light);
      box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.2);

    }
  </style>
  