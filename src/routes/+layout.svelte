<script>
    import '../app.css';
    import { page } from '$app/stores';
    import { base } from '$app/paths';
  
    let pages = [
      { url: `${base}/`, title: 'Landing' },
      { url: `${base}/chapter1`, title: 'Chapter 1' },
      { url: `${base}/chapter2`, title: 'Chapter 2' },
      { url: `${base}/chapter2-2`, title: 'Chapter 2, Part 2' },
      { url: `${base}/missingdata`, title: 'Missing Data' },
      { url: `${base}/flowchart`, title: 'Flow Chart' }
    ];
  
    let menuOpen = false;
  </script>
  
  <!-- DROPDOWN NAVIGATION -->


  <div class="nav-wrapper">
    <div class="menu-container">
    <button on:click={() => (menuOpen = !menuOpen)} class="menu-toggle">
      ☰ Menu
    </button>
  
    {#if menuOpen}
      <nav>
        {#each pages as p}
          <a
            href={p.url}
            class:current={$page.url.pathname === p.url}
            target={p.url.startsWith('http') ? '_blank' : null}
          >
            {p.title}
          </a>
        {/each}
      </nav>
    {/if}
  </div>
  </div>

  <style>

.menu-container {
  position: relative;
  z-index: 1000;
}


    .nav-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
}

.menu-toggle {
  background-color: transparent;
  color: var(--gray-medium, #E6E8F1);
  font-size: 18px;
  font-family: var(--font-body, 'Utendo', sans-serif);
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

nav {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 10px;
}

nav a {
  color: var(--gray-medium, #333);
  text-decoration: none;
  padding: 5px 0;
  font-size: 16px;
  font-family: var(--font-body, 'Utendo', sans-serif);
}

nav a.current {
  font-weight: bold;
  color: var(--black);
}

nav a:hover {
  color: var(--black);
}

  </style>
  
  <slot />
  