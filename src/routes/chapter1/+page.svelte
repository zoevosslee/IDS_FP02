<script>
    import { scaleLinear } from "d3-scale";
    import { line, curveBasis } from "d3-shape";
    import { onMount, onDestroy } from "svelte";

let width = 1000;
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

let flower2005Visible = false;
let flower2015Visible = false;
let flower2020Visible = false;
let hoveredFlower = null;
let currentNarrativeStep = 0; 
// 0 = nothing yet, 1 = police budget box, 2 = rent burden box




    
  
    let data = [
      { year: 1990, budget: 124214441 },
      { year: 1991, budget: 126287040 },
      { year: 1992, budget: 124433000 },
      { year: 1993, budget: 125340042 },
      { year: 1994, budget: 139489987 },
      { year: 1995, budget: 145887066 },
      { year: 1996, budget: 155831910 },
      { year: 1997, budget: 166777056 },
      { year: 1998, budget: 187164594 },
      { year: 1999, budget: 194218469 },
      { year: 2000, budget: 200756488 },
      { year: 2001, budget: 214286307 },
      { year: 2002, budget: 219548410 },
      { year: 2003, budget: 217405619 },
      { year: 2004, budget: 211363261 },
      { year: 2005, budget: 234580600 },
      { year: 2006, budget: 245221274 },
      { year: 2007, budget: 268700987 },
      { year: 2008, budget: 281610497 },
      { year: 2009, budget: 288631945 },
      { year: 2010, budget: 282413334 },
      { year: 2011, budget: 275779004 },
      { year: 2012, budget: 283038027 },
      { year: 2013, budget: 290713391 },
      { year: 2014, budget: 321000297 },
      { year: 2015, budget: 337310895 },
      { year: 2016, budget: 348887844 },
      { year: 2017, budget: 364594820 },
      { year: 2018, budget: 399924493 },
      { year: 2019, budget: 416762373 },
      { year: 2020, budget: 425553210 },
      { year: 2021, budget: 422917498 },
      { year: 2022, budget: 420411571 },
      { year: 2023, budget: 422132054 },
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
    const yTop = yScale(year) -200;
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
  x={centerX}
  y="30"
  text-anchor="middle"
  font-size="18"
  font-family="Utendo, sans-serif"
  font-weight="600"
  fill="#333"
>
  Police Budget Size (1990–2025)
</text>
<div class="violin-legend">
    Width of the shape = Boston Police Budget in that year
  </div>

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


          {#if currentYearPhase?.phase === "police"}
          <div class="scrolly-box">
            <h5>In {currentYearPhase.year}, Boston's police budget was ${data.find(d => d.year === currentYearPhase.year)?.budget.toLocaleString()}.</h5>
          </div>
        {/if}
        
        {#if currentYearPhase?.phase === "rent"}
          <div class="scrolly-box rent-burden-box">
            <h5>In that same year, {rentBurdenRates[currentYearPhase.year]}% of Boston's households were rent-burdened.</h5>
            <div class="house-grid">
                {#if rentBurdenRates[currentYearPhase.year]}
                {#each Array(100) as _, index}
                  <div class="house {index < rentBurdenRates[currentYearPhase.year] ? 'filled' : ''}"></div>
                {/each}
              {/if}
            
              
              

        
          
          
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
  top: 15%;
  left: 55%;
  transform: translateX(-50%);
  max-width: 400px;
  padding: 1rem;
  font-family: 'Utendo, sans-serif';
  z-index: 20;
  margin-right: 10%;
  opacity: 0; /* start hidden */
  animation: fadeSlideUp 1s ease forwards; /* 👈 still applies */
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
  