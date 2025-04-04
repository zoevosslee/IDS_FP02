<script>
  import '../app.css';
  import { page } from '$app/stores';

  let pages = [
    { url: '/', title: 'Interactive Visualization' },
    { url: '/writeup', title: 'Write Up' },
    { url: '/plan', title: 'Project Plan' },
  ];
</script>

<!-- NAVIGATION -->
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

<slot />

<style>
  /* Top-Right Aligned Navigation using your color and font variables */

  nav {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    gap: 20px;
  }

  nav a {
    color: var(--gray-medium, #E6E8F1);
    background-color: transparent;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 18px; /* You can change this to a variable if desired */
    font-family: var(--font-body, 'Utendo', sans-serif);
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  nav a.current {
    font-weight: bold;
    color: var(--black);
  }

  nav a:hover {
    background-color: var(--red-light,);
    color: var(--black, #000);
  }
</style>

