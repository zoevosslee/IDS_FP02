<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  
    let educationChecked = true;
  
    function toggleEducation(event) {
      educationChecked = event.target.checked;
      dispatch('toggleLayer', { layer: 'education', visible: educationChecked });
    }
  </script>
  
  <div class="layer-sidebar">
    <h3>Gentrification Indicators</h3>
    <p>
      <label>
        <input type="checkbox" bind:checked={educationChecked} on:change={toggleEducation} />
        Education
      </label>
    </p>
  
    <p><label><input type="checkbox" disabled /> Income</label></p>
    <p><label><input type="checkbox" disabled /> Race</label></p>
    <p><label><input type="checkbox" disabled /> Rent Burden</label></p>
  
    <h3>Policing Indicators</h3>
    <p><label><input type="checkbox" disabled /> 311 Calls</label></p>
    <p><label><input type="checkbox" disabled /> DOB Violations</label></p>
  </div>

  <style>
  </style>
  