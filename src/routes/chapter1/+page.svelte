<script>
    import { scaleLinear } from "d3-scale";
    import { line, curveBasis } from "d3-shape";
    import { onMount, onDestroy } from "svelte";
    import { base } from '$app/paths';
    import FlowchartEmbed from '$lib/FlowchartEmbed.svelte';


let width = 800;
let height = 4600;
let centerX = width / 2;
let svgElement;
let currentYearPhase = null; 
// Example: { year: 1990, phase: "police" } or { year: 1990, phase: "rent" }



function updateCenterX() {
  if (svgElement) {
    width = svgElement.clientWidth;
    centerX = width / 2;
  }
}


onMount(() => {
  updateCenterX();
  window.addEventListener('resize', updateCenterX);

  const steps = document.querySelectorAll('.step');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const year = parseInt(entry.target.dataset.year);
        const phase = entry.target.dataset.phase;
        currentYearPhase = { year, phase };
      }
    });
  }, {
    rootMargin: '0px 0px -50% 0px',  // <- activates when step enters middle half of screen
    threshold: 0.1
  });

  steps.forEach(step => observer.observe(step));

  return () => {
    observer.disconnect();
    window.removeEventListener('resize', updateCenterX);
  };
});


onDestroy(() => {
  window.removeEventListener('resize', updateCenterX);
});
  
    let tooltipVisible = false;
    let tooltipX = 0;
    let tooltipY = 0;
    let tooltipText = '';
    let currentStep = null;
    let currentBudget = null;
    let flowerBoxVisible = false;
    let flowerBoxY = 0;

let flower1993Visible = false;
let flower2011Visible = false;
let flower2016Visible = false;
let flower2020Visible = false;
let hoveredFlower = null;
let currentNarrativeStep = 0; 
let hoveredFlowerImage1 = null;
let hoveredFlowerImage2 = null;
let hoveredFlowerText = null;
let suppressScrollyBox = false;



// 0 = nothing yet, 1 = police budget box, 2 = rent burden box




    
  
let data = [
  { year: 1990, budget: 275720031 },
  { year: 1991, budget: 274314189 },
  { year: 1992, budget: 264249060 },
  { year: 1993, budget: 263256889 },
  { year: 1994, budget: 286116375 },
  { year: 1995, budget: 277185426 },
  { year: 1996, budget: 287925561 },
  { year: 1997, budget: 298179836 },
  { year: 1998, budget: 319676145 },
  { year: 1999, budget: 325920180 },
  { year: 2000, budget: 337270901 },
  { year: 2001, budget: 353656648 },
  { year: 2002, budget: 356762770 },
  { year: 2003, budget: 343422247 },
  { year: 2004, budget: 326769991 },
  { year: 2005, budget: 347180488 },
  { year: 2006, budget: 352428484 },
  { year: 2007, budget: 371344339 },
  { year: 2008, budget: 379565876 },
  { year: 2009, budget: 381613687 },
  { year: 2010, budget: 372784733 },
  { year: 2011, budget: 356628715 },
  { year: 2012, budget: 360760340 },
  { year: 2013, budget: 365483739 },
  { year: 2014, budget: 390858358 },
  { year: 2015, budget: 408147173 },
  { year: 2016, budget: 416959294 },
  { year: 2017, budget: 428486631 },
  { year: 2018, budget: 456208712 },
  { year: 2019, budget: 464768959 },
  { year: 2020, budget: 459597466 },
  { year: 2021, budget: 442804107 },
  { year: 2022, budget: 429680663 },
  { year: 2023, budget: 422132054 }, // almost no adjustment needed
  { year: 2024, budget: 511461236 },
  { year: 2025, budget: 475152433 }
];
    let rentBurdenRates = {
    1990: 28.3,
    2000: 40,
    2010: 48,
    2020: 46
  };

    let evictionRates = {
      1990: 0.05,
    }
  
    

  
    let spreadScale = scaleLinear()
      .domain([Math.sqrt(100000000), Math.sqrt(550000000)])
      .range([0, (width / 2) - 100]);
  
    let yScale = scaleLinear()
      .domain([1989, 2025])
      .range([50, height - 50]);
  
    let violinPath = '';
  
    const lineGeneratorRight = line()
      .x(d => centerX + spreadScale(Math.sqrt(d.budget)))
      .y(d => yScale(d.year))
      .curve(curveBasis);
  
    const lineGeneratorLeft = line()
      .x(d => centerX - spreadScale(Math.sqrt(d.budget)))
      .y(d => yScale(d.year))
      .curve(curveBasis);
  
    $: if (data.length > 1) {
      const rightPath = lineGeneratorRight(data);
      const leftPath = lineGeneratorLeft([...data].reverse());
      const leftPathJoined = leftPath.replace(/^M/, 'L');
      violinPath = `${rightPath} ${leftPathJoined} Z`;
    }
  
    onMount(() => {
      window.addEventListener('scroll', checkScroll);
    });
  
    onDestroy(() => {
      window.removeEventListener('scroll', checkScroll);
    });
  

    function checkScroll() {
  const scrollY = window.scrollY;
  const chartTop = document.querySelector('.chart').offsetTop;
  const relativeScroll = scrollY - chartTop;

  const yearPhases = [
    { year: 1990 },
    { year: 2000 },
    { year: 2010 },
    { year: 2020 }
  ];

  let found = false;

  for (const { year } of yearPhases) {
    const yTop = year === 1990 ? yScale(year) + 100 : yScale(year) - 100;
    const yPoliceEnd = yTop + 400; // wider police window
const yRentEnd = yPoliceEnd + 500; // wider rent window


    if (relativeScroll >= yTop && relativeScroll < yPoliceEnd) {
      currentYearPhase = { year, phase: "police" };
      found = true;
      break;
    } else if (relativeScroll >= yPoliceEnd && relativeScroll < yRentEnd) {
      currentYearPhase = { year, phase: "rent" };
      found = true;
      break;
    }
  }

  if (!found) {
    currentYearPhase = null;
  }

  // Handle flower visibility
  if (relativeScroll > yScale(1993) - 400) {
    flower1993Visible = true;
  }
  if (relativeScroll > yScale(2011) - 400) {
    flower2011Visible = true;
  }
  if (relativeScroll > yScale(2016) - 400) {
    flower2016Visible = true;
  }
  if (relativeScroll > yScale(2020) - 400) {
    flower2020Visible = true;
  }

  // Highlight the current year
  if (relativeScroll >= yScale(2020) - 100) {
    currentStep = { year: 2020 };
  } else if (relativeScroll >= yScale(2010) - 100) {
    currentStep = { year: 2010 };
  } else if (relativeScroll >= yScale(2000) - 100) {
    currentStep = { year: 2000 };
  } else if (relativeScroll >= yScale(1990) - 100) {
    currentStep = { year: 1990 };
  } else {
    currentStep = null;
  }
}


  
    $: {
      if (currentStep) {
        currentBudget = data.find(d => d.year === currentStep.year)?.budget.toLocaleString();
      } else {
        currentBudget = null;
      }
    }
  </script>
  
  <div id="home-page">
    <div class="container">
        <div class="text-content">
            <h1>Rent is a Trap!</h1>
            <h2>By Yeonhoo Cho, Nicola Lawford, Claudia Tomateo, Zoe Voss Lee</h2>
          </div>

      <div class="text-content">
        <div class="introduction">

        </div>
        <div class="chart-explainer">

          
            <div class="chart-description">
              <p>
                This chart shows Boston’s annual operational police budget, sourced from the Boston Public Library Archives (1990–2006) and the City of Boston Budget Office (2007–2025). All dollar values are adjusted for inflation and shown in today’s dollars. 
                <br><br>
                Even as Boston’s police budget has steadily grown—often in the name of "public safety"—housing affordability has become increasingly precarious, with rent burden rates affecting nearly half of all renters by 2020. 

              </p>
            </div>
            <div class="explainer-grid">
                <div class="explainer-item">
                  <h3>1. Hover</h3>
                  <p>Hover over a year to see Boston's police budget in today’s dollars.</p>
                </div>
                <div class="explainer-item">
                  <h3>2. Watch for Flowers</h3>
                  <p>Look out for flowers to discover moments of community resistance.</p>
                </div>
                <div class="explainer-item">
                  <h3>3. Scroll Down</h3>
                  <p>Scroll to see how Boston’s policing budget and rent burden have changed over time.</p>
                </div>
              </div>
          </div>
          


      </div>
  
      <div class="chart-wrapper">

          
        <div class="fixed-container">
        <div class="chart">
            <svg {width} {height}>

                <text
         
                y="80"
                text-anchor="start"
                font-size="24"
                font-family="Utendo, sans-serif"
                font-weight="600"
                fill="#333"
              >
                Police Budget Size (1990–2025), Adjusted for Inflation (2024 Dollars)
              </text>
              


                <!-- decade lines -->
<line
x1="0"
x2={width}
y1={yScale(1990)}
y2={yScale(1990)}
stroke="#cccccc"
stroke-width="0.5"
stroke-dasharray="4 4"
opacity="1"
/>

<line
x1="0"
x2={width}
y1={yScale(2000)}
y2={yScale(2000)}
stroke="#cccccc"
stroke-width="0.5"
stroke-dasharray="4 4"
opacity="1"
/>

<line
x1="0"
x2={width}
y1={yScale(2010)}
y2={yScale(2010)}
stroke="#cccccc"
stroke-width="0.5"
stroke-dasharray="4 4"
opacity="1"
/>

<line
x1="0"
x2={width}
y1={yScale(2020)}
y2={yScale(2020)}
stroke="#cccccc"
stroke-width="0.5"
stroke-dasharray="4 4"
opacity="1"
/>


              {#if violinPath}
                <path d={violinPath} fill="#A12624" stroke="black" stroke-width="1" />
              {/if}
          
              {#each data as d}
              <text
              x="20"
              y={yScale(d.year) + 4}
              text-anchor="start"
              font-size={d.year === currentStep?.year ? 24 : 16}
              font-family="Utendo, sans-serif"
              font-weight={d.year === currentStep?.year ? "700" : "400"}
              fill={d.year === currentStep?.year ? "#A12624" : "black"}
            >
              {d.year}
            </text>
            
              {/each}
          
              {#each data as d}
                <circle
                  cx={centerX}
                  cy={yScale(d.year)}
                  r="30"
                  fill="transparent"
                  on:mouseover={() => {
                    tooltipVisible = true;
                    tooltipX = -137; // 👈 align it nicely to the left
                    tooltipY = yScale(d.year);
                    tooltipText = `<strong>${d.year}:</strong> $${d.budget.toLocaleString()}`;
                  }}
                  
                  on:mouseout={() => (tooltipVisible = false)}
                />
              {/each}



            </svg>

            {#if hoveredFlowerImage1}
            <div
              class="side-image-box"
              style="top: {hoveredFlower?.y - 40}px; left: 50%; transform: translateX(150px);"
              >
              {#if hoveredFlowerText}
                <div class="hovered-text">
                  {@html hoveredFlowerText}
                </div>
              {/if}
              <div class="image-stack">
                <img src={hoveredFlowerImage1} alt="First Image" />
                {#if hoveredFlowerImage2}
                  <img src={hoveredFlowerImage2} alt="Second Image" class="overlapping-image" />
                {/if}
              </div>
            </div>
          {/if}
          
            {#if flower1993Visible}
            <div 
              class="flower-box" 
              style="top: {yScale(1993)}px; left: {centerX - 50}px; --rotate: -60deg;"
              on:mouseenter={() => {
                hoveredFlower = { x: centerX - 50, y: yScale(1993) };
                hoveredFlowerImage1 = `${base}/parcelc2.jpeg`;
                hoveredFlowerImage2 = `${base}/parcelc1.jpeg`;
                hoveredFlowerText = `
  <strong>1993: Parcel C Protests</strong><br><br>
  In the early 1990s, Boston’s Chinatown community organized a historic protest against Parcel C development. Residents and activists fought against the proposed construction of a parking garage that would have increased air pollution and displacement in their neighborhood. The Parcel C protests became a landmark moment for Asian American environmental justice organizing.<br><br>
  Source: <a href="https://asianamericanhistory.library.northeastern.edu/parcel-c-timeline/" target="_blank" style="color:#A12624; text-decoration: underline;">Northeastern Library</a>
`;
                suppressScrollyBox = true; // 👈 hide scrolly boxes
              }}
              on:mouseleave={() => {
                hoveredFlower = null;
                hoveredFlowerImage1 = null;
                hoveredFlowerImage2 = null;
                hoveredFlowerText = null;
                suppressScrollyBox = false; // 👈 bring back scrolly boxes
              }}
              
              
              
            >
              <img src="{base}/flower.png" alt="Flower 1993" />
            </div>
          {/if}
          
          
          
          {#if flower2011Visible}
          <div 
            class="flower-box" 
            style="top: {yScale(2011)}px; left: {centerX - 40}px; --rotate: -30deg;"
            on:mouseenter={() => {
              hoveredFlower = { x: centerX - 40, y: yScale(2011) };
              hoveredFlowerImage1 = `${base}/occupy1.png`;
              hoveredFlowerImage2 = `${base}/occupy.png`; // ❗ only one image for now
              hoveredFlowerText = `
            <strong>2011: Occupy Boston</strong><br><br>
            In the fall of 2011, activists, students, workers, and community members came together in Dewey Square as part of Occupy Boston—one of many local expressions of the global Occupy movement. The encampment challenged corporate power, economic inequality, and the growing unaffordability of life in the city.<br><br>
            Sources: <a href="https://www.thecrimson.com/article/2011/11/2/occupy-boston-profs-comment/" target="_blank" style="color:#A12624; text-decoration: underline;">The Harvard Crimson</a>
            <a href="https://sites.bu.edu/occupybostonchronicles/" target="_blank" style="color:#A12624; text-decoration: underline;">, The Boston Globe</a>
            `;
              suppressScrollyBox = true; 
            }}
            on:mouseleave={() => {
              hoveredFlower = null;
              hoveredFlowerImage1 = null;
              hoveredFlowerImage2 = null;
              hoveredFlowerText = null;
              suppressScrollyBox = false;
            }}
          >
            <img src="{base}/flower.png" alt="Flower 2011" />
          </div>
          {/if}
          
          
        
          {#if flower2016Visible}
          <div 
            class="flower-box" 
            style="top: {yScale(2016)}px; left: {centerX + 60}px; --rotate: 10deg;"
            on:mouseenter={() => {
              hoveredFlower = { x: centerX + 60, y: yScale(2016) };
              hoveredFlowerImage1 = `${base}/2016.png`;
              hoveredFlowerImage2 = null; // ❗only one image for this one
              hoveredFlowerText = `
                <strong>2016: Right to Remain Campaign</strong><br><br>
                In 2016, City Life/Vida Urbana helped launch the Right to Remain campaign in Boston, fighting to protect longtime residents, especially Black, Latinx, and working-class tenants, from displacement and eviction amid the city’s intensifying housing crisis.<br><br>
                Source: <a href="https://www.clvu.org/rda_2016" target="_blank" style="color:#A12624; text-decoration: underline;">City Life/Vida Urbana</a>
              `;
              suppressScrollyBox = true;
            }}
            on:mouseleave={() => {
              hoveredFlower = null;
              hoveredFlowerImage1 = null;
              hoveredFlowerImage2 = null;
              hoveredFlowerText = null;
              suppressScrollyBox = false;
            }}
          >
            <img src="{base}/flower.png" alt="Flower 2016" />
          </div>
        {/if}
        
        
        {#if flower2020Visible}
        <div 
          class="flower-box" 
          style="top: {yScale(2020)}px; left: {centerX - 30}px; --rotate: 25deg;"
          on:mouseenter={() => {
            hoveredFlower = { x: centerX - 30, y: yScale(2020) };
            hoveredFlowerImage1 = `${base}/blm1.png`;
            hoveredFlowerImage2 = null; // ❗only one image here
            hoveredFlowerText = `
              <strong>2020: Black Lives Matter</strong><br><br>
              In 2020, thousands of Bostonians took to the streets following the murder of George Floyd, Breonna Taylor, and countless other Black lives lost to police violence. Protests and marches throughout the city called for justice, divestment from policing, and investment in Black communities.<br><br>
              Source: <a href="https://www.bostonherald.com/2020/06/03/george-floyd-protests-in-boston-this-time-is-different/" target="_blank" style="color:#A12624; text-decoration: underline;">Boston Herald</a>
            `;
            suppressScrollyBox = true;
          }}
          on:mouseleave={() => {
            hoveredFlower = null;
            hoveredFlowerImage1 = null;
            hoveredFlowerImage2 = null;
            hoveredFlowerText = null;
            suppressScrollyBox = false;
          }}
        >
          <img src="{base}/flower.png" alt="Flower 2020" />
        </div>
      {/if}


        
        

        
        
        
        {#if currentYearPhase?.phase === "police" && !suppressScrollyBox}
        <div class="scrolly-box">
          <h5>In {currentYearPhase.year}, Boston's police budget was ${data.find(d => d.year === currentYearPhase.year)?.budget.toLocaleString()}.</h5>
        </div>
      {/if}
      
      {#if currentYearPhase?.phase === "rent" && !suppressScrollyBox}
      <div class="scrolly-box rent-burden-box">
        {#if currentYearPhase.year === 1990}
          <h5>In 1990, 28% of Boston households were rent burdened. Housing costs were beginning to outpace wages, especially for working-class residents.</h5>
          <div class="house-grid">
            {#each Array(100) as _, index}
              <div class="house {index < 28 ? 'filled' : ''}"></div>
            {/each}
          </div>
    
        {:else if currentYearPhase.year === 2000}
          <h5>By 2000, rent burden had risen to 40%. This marked the beginning of a rapid increase in housing insecurity across many Boston neighborhoods.</h5>
          <div class="house-grid">
            {#each Array(100) as _, index}
              <div class="house {index < 40 ? 'filled' : ''}"></div>
            {/each}
          </div>
    
        {:else if currentYearPhase.year === 2010}
          <h5>In 2010, nearly half of renters (48%) were burdened by rent. The aftermath of the foreclosure crisis pushed many households into the rental market.</h5>
          <div class="house-grid">
            {#each Array(100) as _, index}
              <div class="house {index < 48 ? 'filled' : ''}"></div>
            {/each}
          </div>
    
        {:else if currentYearPhase.year === 2020}
          <h5>By 2020, rent burden remained high at 46%, even as wages stagnated. The pandemic further exposed deep inequities in housing access.</h5>
          <div class="house-grid">
            {#each Array(100) as _, index}
              <div class="house {index < 46 ? 'filled' : ''}"></div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
    
      
      

        
      
      
        
        
            

            
            {#if tooltipVisible}
              <div class="tooltip" style="top: {tooltipY}px; left: {tooltipX}px;">
                {@html tooltipText}
              </div>
            {/if}
        </div>
        <div class="final-scrolly-box">
            <h5>
              From 1990 to 2020, Boston’s police budget grew by over $180 million—<br>
              even as rent burden rose from 28% to 46% of households.<br><br>
              Whose safety is being prioritized?<br>
              What are the stories behind these numbers?
            </h5>
          </div>
        <div class="steps">
            <div class="step" data-year="1990" data-phase="police"></div>
            <div class="step" data-year="1990" data-phase="rent"></div>
            <div class="step" data-year="2000" data-phase="police"></div>
            <div class="step" data-year="2000" data-phase="rent"></div>
            <div class="step" data-year="2010" data-phase="police"></div>
            <div class="step" data-year="2010" data-phase="rent"></div>
            <div class="step" data-year="2020" data-phase="police"></div>
            <div class="step" data-year="2020" data-phase="rent"></div>
          </div>

          
          
          

          
        </div> <!-- .chart -->

          <div class="flowchart-wrapper">
            <svelte:component this={FlowchartEmbed} />
          </div>
        
        <div class="next-chapter-link">
          <a href="{base}/chapter2">
            ↓ Chapter 2: Map Exploration
          </a>
        </div>
        </div> <!-- .chart-wrapper -->
        </div> <!-- .container -->
        </div> <!-- #home-page -->
  <style>

.next-chapter-link{
  margin-top: 127rem; /* 👈 Add this to push it down */
  text-align: center;
  font-family: 'Utendo', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 4rem;
}


.final-scrolly-box {
  position: absolute;
  top: 4800px; /* 👈 tweak this based on how tall your chart actually is */
  justify-content:center;
  transform: translateX(-50%);
  width: 100%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  font-family: 'Utendo', sans-serif;
  font-size: 1.2rem;
  color: #A12624;
  text-align: center;
  opacity: 0;
  animation: fadeSlideUp 1.5s ease forwards;
}

.flowchart-wrapper {
  position: absolute;
  top: 5400px;
  width: 100%;
  margin: 0 auto; /* center it */
  padding: 2rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}


.chart-explainer {
  width: 100%;
  font-family: 'Utendo', sans-serif;
  margin-bottom: 0rem; /* tighten spacing below */
}

.explainer-grid {
  display: flex;
  justify-content:space-between; /* center the entire grid */
  flex-wrap: nowrap;
  gap: 1rem;
  max-width: 100%; /* limit how wide it can grow */

}

.explainer-item {
  flex: 1 1 0; /* flexibly grow */
  max-width: 500px; /* don't let them get too huge */
  min-width: 100px; /* don't let them get too small */
  background: rgba(255, 255, 255, 0.8);
  padding: 1.3rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
/* Small hover effect */
.explainer-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
}

.explainer-item h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--red);
  margin-bottom: 0.5rem;
}

.explainer-item p {
  font-size: 1rem;
  color: #333;
  line-height: 1.3;
}

/* Expand chart-description nicely too */
.chart-description {
  width: 100%;
}

.chart-description p {
  font-size: 1rem;
  color: #333;
  width: 100%;
  text-align: left;
  background: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
  margin-bottom:2rem;
}
.side-image-box {
  position: absolute;
  bottom:10%;
  right: 10%;
  width: 200%;
  max-width: 900px;
  min-width:600px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.5rem;
  background: none;
  z-index: 50;
}

/* Text box styling */
.hovered-text {
  order: -1; /* Text comes first */
  width: 40%; /* Wider text box */
  padding: 1rem;
  background: rgba(255,255,255,0.85);
  border-radius: 8px;
  font-family: 'Utendo', sans-serif;
  font-size: 1rem;
  color: #333;
}

/* Container for the images */
.image-stack {
  display: flex;
  flex-direction: column; /* Stack images vertically */
  align-items: center;
  gap: 1rem;
  width: 50%;
  transform: rotate(2deg);
}

/* For the images */
.side-image-box img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.5s ease;
}

/* Second image slight overlap */
.overlapping-image {
  margin-top: -20px; /* slight overlap upwards */
  margin-left: -30px;
  transform: rotate(-4deg);
  opacity: 0.9;
  z-index: 51;
}



html {
  scroll-behavior: smooth;
}


.fixed-container {
  width: 800px;
  margin: 0 ;
  position: relative; /* 👈 needed so absolute flowers stick to this container */
}


.flower-tooltip {
  position: absolute;
  background: white;
  border: 1px solid #aaa;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-family: 'Utendo', sans-serif;
  font-size: 0.9rem;
  max-width: 200px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 30;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  white-space: nowrap; /* 👈 added this! */
}


@keyframes fadeInFlower {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInTooltip {
  from { opacity: 0; }
  to { opacity: 1; }
}



.flower-tooltip {
  animation: fadeInTooltip 0.5s forwards;
}



.flower-box {
  position: absolute;
  transform: translate(-50%, -50%) rotate(var(--rotate)); /* ✅ now respects --rotate */
  width: 300px;
  height: 300px;
  z-index: 15;
  opacity: 0;
  animation: fadeIn 2.5s forwards, pulse 5s infinite ease-in-out; /* ✅ add pulse */
}


.flower-box img {
  width: 100%;
  height: auto;
  display: blAock;
  transition: transform 0.5s ease, filter 0.3s ease; /* ✅ Add smooth filter transition */
}

/* Lighten / glow effect when hovered */
.flower-box:hover img {
  filter: brightness(1.1) drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
  transform: scale(1.08); /* slightly pop up */
}


@keyframes fadeIn {
  from {
    opacity: 0; /* 👈 Start fully invisible */
  }
  to {
    opacity: 1; /* 👈 End fully visible */
  }
}



.chart-wrapper {
  position: relative;
  
}

  .chart {
    position:relative;
    width: 1000px;
    height: auto;

  }
  
  .tooltip {
    position: absolute;
    background: white;
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: 0.3rem 0.6rem;
    font-size: 0.9rem;
    pointer-events: none;
    transform: translateY(-50%);
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    font-family: 'Utendo', sans-serif;
  }
  


  .violin-legend {
  text-align: center;
  font-family: 'Utendo', sans-serif;
  font-size: 0.85rem;
  color: #666;
  margin-top: 1rem;
  margin-bottom: -1rem;
}

.scrolly-box {
  position: fixed;
  top: 20%;
  left: 55%;
  transform: translateX(-50%);
  max-width: 400px;
  padding: 1rem;
  font-family: 'Utendo, sans-serif';
  z-index: 20;
  margin-right: 10%;
  background: rgba(255, 255, 255, 0.85); /* ✅ white with 50% opacity */
  border-radius: 12px; /* ✅ rounded corners */
  opacity: 0; /* start hidden */
  animation: fadeSlideUp 1s ease forwards;
}



/* Fade-out for police budget box */
.fade-out {
  opacity: 0;
  transform: translateY(20px);
}




@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px); /* 👈 only slide up, no scaling */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.house-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  margin-top: 1rem;
}

.house {
  width: 15px;
  height: 15px;
  background: #eee; /* light gray for unfilled */
  border: 1px solid #ccc;
  border-radius: 3px;
  transition: background 1s ease;
}

.house.filled {
  background: #A12624; /* dark red for rent burdened */
}


@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) rotate(var(--rotate)) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) rotate(var(--rotate)) scale(1.07);
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--rotate)) scale(1);
  }
}



  </style>
  