<script lang="ts">
  import { page } from "./router.js";
  import Nav from "./Nav.svelte";
  import PlayerManager from "./PlayerManager.svelte";
  import Leaderboard from "./Leaderboard.svelte";
</script>

<Nav />

<main class="container">
  {#if $page === "/leaderboard"}
    <Leaderboard />
  {:else}
    <PlayerManager />
  {/if}
</main>

<style>
  main {
    padding-bottom: 48px;
  }
</style>
