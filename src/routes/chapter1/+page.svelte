<script>
    import { scaleLinear } from "d3-scale";
    import { line, curveBasis } from "d3-shape";
    import { onMount, onDestroy } from "svelte";

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
let flower2005Visible = false;
let flower2015Visible = false;
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
    const yTop = year === 1990 ? yScale(year) - 100 : yScale(year) - 200;
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
  if (relativeScroll > yScale(2005) - 400) {
    flower2005Visible = true;
  }
  if (relativeScroll > yScale(2015) - 400) {
    flower2015Visible = true;
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
            {#if flower1993Visible}
            <div 
              class="flower-box" 
              style="top: {yScale(1993)}px; left: {centerX - 50}px; transform: translate(-50%, -50%) rotate(-60deg);"
              on:mouseenter={() => {
                hoveredFlower = { x: centerX - 50, y: yScale(1993) };
                hoveredFlowerImage1 = "/parcelc2.jpeg";
                hoveredFlowerImage2 = "/parcelc1.jpeg";
                hoveredFlowerText = "In the early 1990s, Boston’s Chinatown community organized a historic protest against Parcel C development. Residents and activists fought against the proposed construction of a parking garage that would have increased air pollution and displacement in their neighborhood. The Parcel C protests became a landmark moment for Asian American environmental justice organizing.";
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
              <img src="/flower.png" alt="Flower 1993" />
            </div>
          {/if}
          
          
          
            {#if flower2005Visible}
            <div 
              class="flower-box" 
              style="top: {yScale(2005)}px; left: {centerX - 40}px; transform: translate(-50%, -50%) rotate(-30deg);"
              on:mouseenter={() => hoveredFlower = { x: centerX - 40, y: yScale(2005) }}
              on:mouseleave={() => hoveredFlower = null}
            >
              <img src="/flower.png" alt="Flower 2005" />
            </div>
          {/if}
          
        
          {#if flower2015Visible}
            <div 
              class="flower-box" 
              style="top: {yScale(2015)}px; left: {centerX +60}px; transform: translate(-50%, -50%) rotate(10deg);"
              on:mouseenter={() => hoveredFlower = { x: centerX + 60, y: yScale(2015) }}
              on:mouseleave={() => hoveredFlower = null}
            >
              <img src="/flower.png" alt="Flower 2015" />
            </div>
          {/if}
        
          {#if flower2020Visible}
            <div 
              class="flower-box" 
              style="top: {yScale(2020)}px; left: {centerX -30}px; transform: translate(-50%, -50%) rotate(25deg);"
              on:mouseenter={() => hoveredFlower = { x: centerX - 30, y: yScale(2020) }}
              on:mouseleave={() => hoveredFlower = null}
            >
              <img src="/flower.png" alt="Flower 2020" />
            </div>
          {/if}
        
          {#if hoveredFlower}
            <div 
              class="flower-tooltip" 
              style="top: {hoveredFlower.y - 80}px; left: {hoveredFlower.x + 100}px;"
            >
              This is a moment of resistance
            </div>
          {/if}
          {#if hoveredFlowerImage1}
          <div class="side-image-box">
            <img src={hoveredFlowerImage1} alt="First Image" />
            {#if hoveredFlowerImage2}
              <img src={hoveredFlowerImage2} alt="Second Image" class="overlapping-image" />
            {/if}
            {#if hoveredFlowerText}
              <div class="hovered-text">
                {hoveredFlowerText}
              </div>
            {/if}
          </div>
        {/if}
        

        
        
        
        {#if currentYearPhase?.phase === "police" && !suppressScrollyBox}
        <div class="scrolly-box">
          <h5>In {currentYearPhase.year}, Boston's police budget was ${data.find(d => d.year === currentYearPhase.year)?.budget.toLocaleString()}.</h5>
        </div>
      {/if}
      
      {#if currentYearPhase?.phase === "rent" && !suppressScrollyBox}
        <div class="scrolly-box rent-burden-box">
          <h5>In that same year, {rentBurdenRates[currentYearPhase.year]}% of Boston's households were rent-burdened.</h5>
          <div class="house-grid">
            {#each Array(100) as _, index}
              <div class="house {index < rentBurdenRates[currentYearPhase.year] ? 'filled' : ''}"></div>
            {/each}
          </div>
        </div>
      {/if}
      
      

        
      
      
        
        
            

            
            {#if tooltipVisible}
              <div class="tooltip" style="top: {tooltipY}px; left: {tooltipX}px;">
                {@html tooltipText}
              </div>
            {/if}
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


      </div> <!-- .chart-wrapper -->
    </div> <!-- .container -->
  </div> <!-- #home-page -->
  
  <style>

.side-image-box {
  position: fixed;
  top: 20%;
  right: 5%;
  width: 20%;
  height: auto;
  background: none;
  z-index: 50;
}

.side-image-box img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.5s ease;
}

.overlapping-image {
  position: absolute;
  top: 350px; /* 👈 push it down a little bit */
  left: 30px; /* 👈 shift it right a bit to overlap */
  width: 85%; /* 👈 smaller than the first */
  opacity: 0.9;
  transform: rotate(-2deg); /* slight tilt if you want */
  z-index: 51;
}

.hovered-text {
  margin-top: 150px;
  padding: 0.8rem;
  background: rgba(255,255,255,0.85);
  border-radius: 8px;
  font-family: 'Utendo', sans-serif;
  font-size: 1.2rem;
  color: #333;
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

.flower-box {
  animation: fadeInFlower 2s forwards;
}

.flower-tooltip {
  animation: fadeInTooltip 0.5s forwards;
}



.flower-box {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  z-index: 15;
  opacity: 0; /* 👈 NEED this! Start invisible */
  animation: fadeIn 2.5s forwards;
}

.flower-box img {
  width: 100%;
  height: auto;
  display: block;
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
    width: 1000px;
    height: 5500px;

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

.steps {
  width: 100%;
}

.step {
  height: 90vh; /* each step covers almost the full screen height */
}


  </style>
  