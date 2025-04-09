<script>
    import '../app.css';
    import { page } from '$app/stores';
  
    let pages = [
      { url: '/', title: 'Interactive Visualization' },
      { url: '/writeup', title: 'Write Up' },
      { url: '/plan', title: 'Project Plan' }
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
  