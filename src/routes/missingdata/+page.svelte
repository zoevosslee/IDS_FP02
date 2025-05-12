<script>
    import { onMount } from 'svelte';

    let stories = [
        { quote: "I have no choice, but to stay. I have nowhere to go. I am old and I don't know English. I have to stay here", source: "Forced from Home Report" },
        {
          quote: "",
          image: '/protest.jpeg',
          description: "Housing redevelopment protest on Hefferan Street in the Allston-Brighton section in November 1965",
          source: "Bill Brett, Ollie Noonan Jr./Globe Staff"
        },
        { quote: "It's natural to be scared... but we can't fear stop us from fighting for our home", source: "Lucia Guardado, Honduran abuela in City Life / Vida Urbana" },
        {
          quote: "",
          image: '/protest2.jpeg',
          description: "Anti-urban renewal protestos picketing the Smith Transfer Corp terminal demanding Lenox Street apartments be renovated rather than demolished in April 1968",
          source: "Bill Brett, Ollie Noonan Jr./Globe Staff"
        },
        { quote: "I think it's fair that everyone have the same opportunity to live in places like this, it creates better community, it creates diversity in the city and it creates a more egalotarian system ", source: "Orlando in City Life / Vida Urbana" },
        {
          quote: "",
          image: '/protest_3.jpeg',
          description: "Members of Homes for All Massachusetts stand out in front of the State House calling for passage of an act to guarantee housing stability during the COVID-19 pandemic in September, 2020.",
          source: "Photo By Nancy Lane/MediaNews Group/Boston Herald"
        },
        { quote: "I am not going nowhere, I am going to stay and I am going to fight", source: "Marshall Cooper in City Life / Vida Urbana" },
        {
          quote: "",
          image: '/protest_4.jpeg',
          description: "Boston Tent City, an open air camp protesting city housing policies in 1968. In the 1980s the city built a subsidized housing complex known also as Tent City",
          source: "DAN SHEEHAN/GLOBE STAFF"
        },
        { quote: "The home where I lived now, until tomorrow was a place of love, was a place of refuge", source: "Christina Soares in City Life / Vida Urbana" },
        { quote: "We didn't know how to protect our rights before so we just paid whatever the landlord asked us to pay or we have to move to the suburb", source: "Forced from Home: A Human Rights Assessment of Displacement and Evictions in Boston's Chinatown Report" },
        {
          quote: "",
          image: '/protest_5.jpeg',
          description: "March to promote the 'Campaign of Conscience' against high rents on Centre Street in central Jamaica Plain in 1999",
          source: "Gazatte File Photo"
        },
        {
          quote: "",
          image: '/protest_6.jpeg',
          description: "Anti-displacement protest in Chinatown, Boston",
          source: "Chinese Progressive Association"
        },
        {
          quote: "",
          image: '/protest_7.png',
          description: "Saundra Graham speaks into a megaphone suring the occupation of 319th Harvard Commencement June 11, 1970",
          source: "Cambridge Historical Commission"
        },
        {
          quote: "",
          image: '/protest_8.png',
          description: "Joanne Pelham and Saundra Graham speaking at Police Brutality Hearings at the Cambridge City Council",
          source: "Cambridge Public Library Archives and Special Collections"
        },
        { quote: "Eviction filings in court significantly undercount the number of evictions that occur", source: "Evictions in Boston Report, City Life / Vida Urbana" },
        { quote: "Without [community] spaces, the people of our community would not be connected. It is better for our health", source: "Forced from Home Report" },
        { quote: "They use [legal status] against them. They say ‘you don’t have any rights. If you don’t pay rent, we can just kick you out and if you don’t agree, we will call the police and you’ll get in trouble,", source: "Maria Hernandez in the Tennessee Lookout" },
        { quote: "78% of Suspended Eviction Cases in Boston were communities of color", source: "Evictions in Boston: The Disproportionate effects of Forced Moves on Communities of Color 2020" }
        ];

  
        let tiles = stories.map((story, index) => ({
          id: `tile-${index}`,
          revealed: false,
          quote: story.quote || "",
          source: story.source,
          image: story.image || null,
          description: story.description || "",
          isLong: (story.quote || "").length > 150
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
<div id="home-page">

<div id="missing_data-page">

  <div class="container">
    <div class="text-content">
      <h1>Rent is a Trap!</h1>
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
                  <div class="tile-back-content">
                      {#if tile.image}
                        <img src={tile.image} alt="Tile image" class="tile-photo" />
                      {/if}
                      {#if tile.quote}
                        <div class="quote-text {tile.isLong ? 'long-quote' : ''}">{tile.quote}</div>
                      {/if}
                      {#if tile.description}
                        <div class="tile-description">{tile.description}</div>
                      {/if}
                      <div class="quote-source">{tile.source}</div>
                    </div>
                  </div>
                
                  </div>                
              </div>
          {/each}
        </div>
        <div class="citation">
        <p>Graphic inspired by Neta Bomani's image in 'Finding the Blank Spots in Big Data'</p>
      </div>
      </div>
  
      {#if hoveringTiles}
        <div class="custom-cursor" style="left: {mouseX}px; top: {mouseY}px;"></div>
      {/if}
    </div> <!-- ✅ now close .container correctly -->
  </div>
  </div>
  
  
 <style>
        html, body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        width: 100%;
        background: black;
        overflow-x: hidden; /* only hide horizontal scroll */
        overflow-y: auto; /* allow vertical scroll! */
    }

    .citation {
      padding-bottom: 10rem
    }

    .tiles-wrapper {
        width: 100%;
        max-width: 1450px; /* optional: limit it if needed */
        height: 2500px;
        cursor: none;
        margin: 0 auto 5rem auto;
        border: 2px solid #A12624;
        position: relative;
    }


  
    .tiles-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(6, 1fr);
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
    font-family: 'Utendo', sans-serif;
    font-style: italic;
    font-weight: normal;
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.5rem
}

.quote-source {
    font-family: 'Utendo', sans-serif;
    font-size: 0.7rem;
    opacity: 0.8;
    padding: 0 0.5rem;
    padding-top: 0.4rem
}

.tile-description {
    font-family: 'Utendo', sans-serif;
    font-size: 0.9rem;
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

    .tile-photo {
    max-width: 100%;
    max-height: 50%;
    object-fit: cover;
    margin-bottom: 0.1rem;
  }

  </style>
  
  
  
  
  
  
  
  