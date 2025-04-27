<script>
    let stories = [
      "Story 1: Land and Memory",
      "Story 2: Resistance and Care",
      "Story 3: Future Seeds",
      "Story 4: Water is Life",
      "Story 5: Reclaim the Sky",
      "Story 6: Remember",
      "Story 7: Connection",
      "Story 8: Renewal",
      "Story 9: Ceremony",
      "Story 10: Guardians",
      "Story 11: Dreams",
      "Story 12: Return"
    ];
  
    let tiles = stories.map((story, index) => ({
      id: `tile-${index}`,
      revealed: false,
      story
    }));
  
    function revealTile(tile) {
      tile.revealed = !tile.revealed;
      tiles = [...tiles];
    }

    import { onMount } from 'svelte';

        let mouseX = 0;
        let mouseY = 0;

        onMount(() => {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        });
  </script>
  
  <div class="custom-cursor" style="left: {mouseX}px; top: {mouseY}px;"></div>
  <!-- 🔥 NOTICE: no {handCursor}, direct path in style -->
  <div class="tiles-container">
    {#each tiles as tile (tile.id)}
      <div class="tile" on:click={() => revealTile(tile)}>
        <div class="tile-inner {tile.revealed ? 'revealed' : ''}">
          <div class="tile-front"></div>
          <div class="tile-back">
            <p>{tile.story}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <style>
    html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        height: 100%;
        width: 100%;
        background: black;
        cursor: none; /* hide default cursor */
    }

    .custom-cursor {
        position: fixed;
        width: 252px;    /* 280px × 0.9 = 252px */
        height: 378px;   /* 420px × 0.9 = 378px */
        background-image: url('/hand_2.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        pointer-events: none;
        transform: translate(-70px, -100px); /* ⬅️ Center around fingers better */
        z-index: 10000;
        }

  
    .tiles-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 1fr);
      width: 100vw;
      height: 100vh;
    }
  
    .tile {
      width: 100%;
      height: 100%;
      perspective: 1200px;
    }
  
    .tile-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 2s cubic-bezier(0.25, 1.5, 0.5, 1);
      background: black;
    }
  
    .tile-inner.revealed {
      transform: rotateX(180deg);
      background: #A12624;
    }
  
    .tile-front, .tile-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
  
    .tile-front {
      background: black;
      border: 2px solid #A12624;
      color: white;
    }
  
    .tile-back {
      background: #A12624;
      color: white;
      transform: rotateX(180deg);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      border: 2px solid #A12624;
      box-sizing: border-box;
    }
  
    .tile-back p {
      color: white;
      font-family: sans-serif;
      font-weight: bold;
      font-size: 1.3rem;
      margin: 0;
      text-align: center;
    }

    .tiles-container, .tile, .tile-inner, .tile-front, .tile-back {
        cursor: none;
        }

    .tile-front {
        background: black;
        border: 2px solid #A12624;
        color: white;

        background-image: url('/background.png'); /* your PNG */
        background-size: 400% 300%; /* 4 columns × 3 rows */
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.7;
        }

  </style>
  
  
  
  
  
  
  
  