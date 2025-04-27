<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
  
    export let value;
    let container;
    let stepElements = [];
    let observer;
  
    onMount(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const stepIndex = stepElements.indexOf(entry.target);
              value = stepIndex;
            }
          });
        },
        { threshold: 0.5 }
      );
  
      stepElements.forEach((step) => observer.observe(step));
  
      return () => {
        observer.disconnect();
      };
    });
  </script>
  
  <div bind:this={container}>
    <slot />
  </div>
  
  <script context="module">
    export const Step = (node) => {
      stepElements.push(node);
  
      return {
        destroy() {
          const index = stepElements.indexOf(node);
          if (index > -1) {
            stepElements.splice(index, 1);
          }
        }
      };
    };
  </script>
  