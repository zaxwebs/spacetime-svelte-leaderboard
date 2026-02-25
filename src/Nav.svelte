<script lang="ts">
  import { page } from "./router.js";
  import { Users, Trophy } from "lucide-svelte";

  const routes = [
    { path: "/", label: "Players", icon: Users },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];
</script>

<nav class="nav">
  <div class="nav-inner">
    <a href="#/" class="nav-brand">
      <span class="nav-logo">◆</span>
      <span class="nav-title">SpacetimeDB</span>
      <span class="nav-divider">/</span>
      <span class="nav-subtitle">Leaderboard</span>
    </a>

    <div class="nav-links">
      {#each routes as route}
        <a
          href="#{route.path}"
          class="nav-link"
          class:active={$page === route.path}
        >
          <route.icon size={15} strokeWidth={2} />
          {route.label}
        </a>
      {/each}
    </div>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(12, 16, 21, 0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: var(--text-primary);
  }
  .nav-logo {
    font-size: 16px;
    color: var(--accent-bright);
  }
  .nav-title {
    font-weight: 700;
    font-size: 14px;
  }
  .nav-divider {
    color: var(--text-muted);
    font-weight: 300;
  }
  .nav-subtitle {
    font-weight: 400;
    font-size: 14px;
    color: var(--text-secondary);
  }
  .nav-links {
    display: flex;
    gap: 2px;
  }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 500;
    transition: all var(--transition);
  }
  .nav-link:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.04);
  }
  .nav-link.active {
    color: var(--accent-bright);
    background: var(--accent-dim);
  }
</style>
