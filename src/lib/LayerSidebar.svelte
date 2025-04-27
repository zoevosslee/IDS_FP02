<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let selectedLayer = 'education';


  function toggleLayer(layer) {
  selectedLayer = layer;
  dispatch('toggleLayer', { layer });
}


  function selectTerrain(terrain) {
    dispatch('selectTerrain', { terrain });
  }
</script>

<div class="layer-sidebar">
  <h3>Gentrification Indicators</h3>
  <p>
    <label>
      <input type="radio" name="gentrificationLayer" value="education" checked={selectedLayer === 'education'} on:change={() => toggleLayer('education')} />
      Education
    </label>
  </p>

  <p>
    <label>
      <input type="radio" name="gentrificationLayer" value="income" checked={selectedLayer === 'income'} on:change={() => toggleLayer('income')} />
      Income
    </label>
  </p>

  <p>
    <label>
      <input type="radio" name="gentrificationLayer" value="race" checked={selectedLayer === 'race'} on:change={() => toggleLayer('race')} />
      Race
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
      <input type="radio" name="gentrificationLayer" value="rentBurden" checked={selectedLayer === 'rentBurden'} on:change={() => toggleLayer('rentBurden')} />
      Rent Burden
    </label>
  </p>
</div>

<style>
</style>

  