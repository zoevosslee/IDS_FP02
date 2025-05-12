<script>
    import '../app.css';
    import { page } from '$app/stores';
    import { base } from '$app/paths';
  
    let pages = [
      { url: `${base}/`, title: 'Introduction →' },
      { url: `${base}/chapter1`, title: '1. Resistance Timeline →' },
      { url: `${base}/chapter2`, title: '2. Mapping Narratives →' },
      { url: `${base}/chapter2-2`, title: '3. Interactive Map →' },
      { url: `${base}/missingdata`, title: '4. Missing Data →' },
      { url: `${base}/sources`, title: 'Sources' },

    ];
  
    let menuOpen = false;
  </script>
  
  <!-- DROPDOWN NAVIGATION -->


  <div class="nav-wrapper">
    <div class="menu-container">
      <nav class="bottom-nav">
        {#each pages as p}
          <a
            href={p.url}
            class:current={
              typeof window !== 'undefined' &&
              new URL(p.url, window.location.origin).pathname.replace(/\/$/, '') ===
              $page.url.pathname.replace(/\/$/, '')
            }                        
            target={p.url.startsWith('http') ? '_blank' : null}
          >
            {p.title}
          </a>
        {/each}
      </nav>
    
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
  background-color: gray;
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

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background-color: rgba(211, 211, 211, 0.75); /* lightgray with 80% opacity */  display: flex;
  flex-direction: row;         /* Makes items go side-by-side */
  justify-content: center;     /* Centers them horizontally */
  align-items: top;
  padding: 15px;
  border-top: 1px solid #ddd;
  z-index: 1000;
  font-family: 'Utendo', sans-serif;
  font-size: 17px;
  font-weight: bold;
  text-align: left;
}

.bottom-nav a {
  margin: 0 2rem;
  color: var(--black);
  text-decoration: none;
  font: inherit; /* ✅ Inherits size, weight, and family from .bottom-nav */
}


.bottom-nav a.current {
  color: var(--red);
  text-decoration: underline;
}

.bottom-nav a:hover {
  color: var(--red);
}



  </style>
  
  <slot />
  