<script>
    import { page } from "$app/stores";

let pages = [
  { url: "./", title: "Interactive Viz" },
  { url: "./writeup", title: "Write Up" },
  { url: "./plan", title: "Project Plan" },
  // add the rest of your pages here
];
</script>

<nav>
    {#each pages as p}
    <a href={p.url} 
    class:current={"." + $page.route.id === p.url}
    target={p.url.startsWith("http") ? "_blank" : null} 
    >
      {p.title}
    </a>
    {/each}
  </nav>

<style>

nav {
      --border-color: var(--color-border);
      border-bottom: 1px solid var(--border-color);
      padding: 10px 0;
      display: flex;
      gap: 20px;
      justify-content: center;
      
    }

    nav a {
      color: var(--color-text);
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: var(--font-size-subtitle);
      transition: background-color var(--transition-fast), color var(--transition-fast);
    }

    nav a.current {
      font-weight: bold;
      text-decoration: underline;
    }

    nav a:hover {
      background-color: var(--red-light);
    }
    
    

nav {
    display: flex;
    position: absolute;
    top: 20px;
    right: 20px;
  }

</style>

<slot></slot>