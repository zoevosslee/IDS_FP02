<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
  
    export let years = [];
    export let currentYear;
    export let onYearChange = () => {};
  
    let slider;
  
    onMount(() => {
      const width = 600;
  
      const svg = d3.select(slider)
        .append('svg')
        .attr('width', width)
        .attr('height', 60);
  
      const x = d3.scaleLinear()
        .domain(d3.extent(years))
        .range([20, width - 20])
        .clamp(true);
  
      const handle = svg.append('circle')
        .attr('class', 'handle')
        .attr('r', 8)
        .attr('cy', 30)
        .attr('cx', x(currentYear));
  
      svg.append('line')
        .attr('x1', x.range()[0])
        .attr('x2', x.range()[1])
        .attr('y1', 30)
        .attr('y2', 30)
        .attr('stroke', '#999')
        .attr('stroke-width', 4);
  
      const drag = d3.drag()
        .on('drag', (event) => {
          const year = Math.round(x.invert(event.x));
          handle.attr('cx', x(year));
          onYearChange(year);
        });
  
      handle.call(drag);
    });
  </script>
  
  <div bind:this={slider}></div>
  
  <style>
    .handle {
      fill: #9333ea;
      stroke: white;
      cursor: pointer;
    }
  </style>
  