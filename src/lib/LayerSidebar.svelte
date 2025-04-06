<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let layers = {
    education: true,
    income: false,
    race: false,
    rentBurden: false
  };

  function toggleLayer(layer) {
    layers = { ...layers, [layer]: !layers[layer] };
    dispatch('toggleLayer', { layer, visible: layers[layer] });
  }
</script>

<div class="layer-sidebar">
  <h3>Gentrification Indicators</h3>
  <p>
    <label>
      <input type="checkbox" checked={layers.education} on:change={() => toggleLayer('education')} />
      Education
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked={layers.income} on:change={() => toggleLayer('income')} />
      Income
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked={layers.race} on:change={() => toggleLayer('race')} />
      Race
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked={layers.rentBurden} on:change={() => toggleLayer('rentBurden')} />
      Rent Burden
    </label>
  </p>

  <h3>Policing Indicators</h3>
  <p><label><input type="checkbox" disabled /> 311 Calls</label></p>
  <p><label><input type="checkbox" disabled /> DOB Violations</label></p>
</div>

  <style>
  </style>
  