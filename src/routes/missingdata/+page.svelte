<script>
    import { onMount } from 'svelte';

    let stories = [
        { quote: "I have no choice, but to stay. I have nowhere to go. I am old and I don't know English. I have to stay here", source: "Forced from Home Report" },
        { quote: "It's natural to be scared... but we can't fear stop us from fighting for our home", source: "Lucia Guardado, Honduran abuela" },
        { quote: "I think it's fair that everyone have the same opportunity to live in places like this, it creates better community, it creates diversity in the city and it creates a more egalotarian system ", source: "Orlando, City Life / Vida Urbana" },
        { quote: "I am not going nowhere, I am going to stay and I am going to fight", source: "Marshall Cooper" },
        { quote: "The home where I lived now, until tomorrow was a place of love, was a place of refuge", source: "Christina Soares" },
        { quote: "We didn't know how to protect our rights before so we just paid whatever the landlord asked us to pay or we have to move to the suburb", source: "Forced from Home Report" },
        { quote: "Connection", source: "Author G" },
        { quote: "Renewal", source: "Author H" },
        { quote: "Ceremony", source: "Author I" },
        { quote: "Eviction filings in court significantly undercount the number of evictions that occur", source: "Evictions in Boston Report, City Life / Vida Urbana" },
        { quote: "Without [community] spaces, the people of our community would not be connected. It is better for our health", source: "Forced from Home Report" },
        { quote: "Return", source: "Author L" }
        ];

  
    let tiles = stories.map((story, index) => ({
        id: `tile-${index}`,
        revealed: false,
        quote: story.quote,
        source: story.source,
        isLong: story.quote.length > 150 // 🔥 Mark quotes longer than 150 characters
    }));



    function revealTile(tile) {
      tile.revealed = !tile.revealed;
      tiles = [...tiles];
    }

    let mouseX = 0;
    let mouseY = 0;
    let hoveringTiles = false; // 🔥 track if inside container

    onMount(() => {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    });

    function handleMouseEnter() {
        hoveringTiles = true;
    }

    function handleMouseLeave() {
        hoveringTiles = false;
    }
</script>

<svelte:head>
  <title>Rent is a Trap!</title>
</svelte:head>

<div id="missing_data-page">

  <div class="container">
    <div class="text-content">
        <h4>Rent is a Trap!</h4>
      <h2>By Yeonhoo Cho, Nicola Lawford, Claudia Tomateo, Zoe Voss Lee</h2>
    </div>

    <p>In housing and policing, missing data is not random. It often hides the experiences of those most affected by displacement and over-policing. Evictions, rent increases, and everyday encounters with police are not always recorded, especially in communities already facing injustice. These gaps make it harder to see the full picture of how neighborhoods change and who is most impacted. As you explore the tiles below, consider what stories might be missing and how that shapes what we understand and what remains unseen.
    </p>

    <div class="tiles-wrapper" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
        <div class="tiles-container">
          {#each tiles as tile (tile.id)}
            <div class="tile" on:click={() => revealTile(tile)}>
              <div class="tile-inner {tile.revealed ? 'revealed' : ''}">
                <div class="tile-front"></div>
                <div class="tile-back">
                    <div class="tile-text-wrapper">
                      <div class="quote-text {tile.isLong ? 'long-quote' : ''}">{tile.quote}</div>
                      <div class="quote-source">{tile.source}</div>
                    </div>
                  </div>                
              </div>
            </div>
          {/each}
        </div>
        <p>Graphic inspired by Neta Bomani's image in 'Finding the Blank Spots in Big Data'</p>
      </div>
  
      {#if hoveringTiles}
        <div class="custom-cursor" style="left: {mouseX}px; top: {mouseY}px;"></div>
      {/if}
    </div> <!-- ✅ now close .container correctly -->
  </div>
  
  
 <style>
        html, body {
        margin: 0;
        padding: 0;
        padding-bottom: 4rem;
        min-height: 100%;
        width: 100%;
        background: black;
        overflow-x: hidden; /* only hide horizontal scroll */
        overflow-y: auto; /* allow vertical scroll! */
    }

    .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
        padding-bottom: 1.5rem;
    }

    .tiles-wrapper {
        width: 100%;
        max-width: 1450px; /* optional: limit it if needed */
        height: 650px;
        cursor: none;
        margin: 0 auto 5rem auto;
        border: 2px solid #A12624;
        position: relative;
    }


  
    .tiles-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 1fr);
      width: 100%;
      height: 100%;
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
    text-align: center;
    overflow: hidden;
}

.tile-text-wrapper {
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1.3rem;
    transform: scale(1);
    transform-origin: center;
}

/* Allow text inside to shrink */
.tile-text-wrapper:has(.quote-text.long-quote) {
    transform: scale(0.8); /* 🔥 shrink all content if quote is long */
}

.quote-text {
    font-family: sans-serif;
    font-style: italic;
    font-weight: normal;
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;
}

.quote-source {
    font-family: sans-serif;
    font-size: 0.7rem;
    opacity: 0.8;
    padding: 0 0.5rem;
}






    .tiles-container, .tile, .tile-inner, .tile-front, .tile-back {
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

    .custom-cursor {
        position: fixed;
        width: 176px;
        height: 265px;
        background-image: url('/hand_2.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        pointer-events: none;
        transform: translate(-40px, -60px);
        z-index: 10000;
    }

  </style>
  
  
  
  
  
  
  
  