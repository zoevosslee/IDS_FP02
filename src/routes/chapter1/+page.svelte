<script>
    import { scaleLinear } from "d3-scale";
    import { line, curveBasis } from "d3-shape";
    import { onMount, onDestroy } from "svelte";
  
    let tooltipVisible = false;
    let tooltipX = 0;
    let tooltipY = 0;
    let tooltipText = '';
    let currentStep = null;
    let currentBudget = null;
  
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
  
    let width = 600;
    let height = 2500;
    let centerX = width / 2;
  
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
  
      if (scrollY >= yScale(2020) - 100 && scrollY < yScale(2025)) {
        currentStep = { year: 2020 };
      } else if (scrollY >= yScale(2010) - 100 && scrollY < yScale(2015)) {
        currentStep = { year: 2010 };
      } else if (scrollY >= yScale(2000) - 100 && scrollY < yScale(2005)) {
        currentStep = { year: 2000 };
      } else if (scrollY >= yScale(1990) - 100 && scrollY < yScale(1995)) {
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
        <div class="chart">
          <svg {width} {height}>
            {#if violinPath}
              <path d={violinPath} fill="#A12624" stroke="black" stroke-width="1" />
            {/if}
  
            {#each data as d}
              <text
                x="20"
                y={yScale(d.year) + 4}
                text-anchor="start"
                font-size="16"
                font-family="Utendo, sans-serif"
                font-weight="400"
                fill="black"
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
                  tooltipX = centerX + 15;
                  tooltipY = yScale(d.year);
                  tooltipText = `<strong>${d.year}:</strong> $${d.budget.toLocaleString()}`;
                }}
                on:mouseout={() => (tooltipVisible = false)}
              />
            {/each}
          </svg>
  
          {#if currentStep && currentBudget}
            <div class="scrolly-box">
              <p>In {currentStep.year}, Boston's police budget was {currentBudget}.</p>
            </div>
          {/if}
  
          {#if tooltipVisible}
            <div
              class="tooltip"
              style="top: {tooltipY}px; left: {tooltipX}px;"
            >
              {@html tooltipText}
            </div>
          {/if}
        </div> <!-- .chart -->
      </div> <!-- .chart-wrapper -->
    </div> <!-- .container -->
  </div> <!-- #home-page -->
  
  <style>
  .chart-wrapper {
    position: relative;
  }
  
  .chart {
    width: 600px;
    height: 2500px;
    margin: auto;
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
  
  .scrolly-box {
    position: fixed;
    top: 20%;
    left: 55%;
    max-width: 300px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    font-family: 'Utendo', sans-serif;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 20;
  }

  </style>
  