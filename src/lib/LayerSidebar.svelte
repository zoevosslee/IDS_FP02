<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let layers = {
    education: true,
    income: false,
    race: false,
    rentBurden: false,
    surface: false
  };

  let policeInds = 'reqs';

  function toggleLayer(layer) {
    layers = { ...layers, [layer]: !layers[layer] };
    dispatch('toggleLayer', { layer, visible: layers[layer] });
  }
  function togglePoliceInd(ind) {
    policeInds = ind;
    dispatch('togglePoliceInd', { ind });
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
  <p><label>
    <input type="radio" id="policeInd1" name="policeInd" value='reqs' on:change={() => togglePoliceInd('reqs')}>
    <label for="policeInd1">311 Calls</label><br>
    <input type="radio" id="policeInd2" name="policeInd" value='viol' checked='true' on:change={() => togglePoliceInd('viol')}>
    <label for="policeInd2">Building & Property Violations</label><br>
    <input type="radio" id="policeInd3" name="policeInd" value='NA' on:change={() => togglePoliceInd('NA')}>
    <label for="policeInd3">NA</label><br>
    
  </p>
  <p>
    <label>
      <input
        type="radio"
        checked={layers.surface}
        on:change={() => toggleLayer('surface')}
      />
      311 Calls
    </label>
  </p>
</div>

  <style>
  </style>
  