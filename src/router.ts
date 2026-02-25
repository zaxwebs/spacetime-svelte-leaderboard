import { writable, derived } from 'svelte/store';

// Simple hash-based router
export const hash = writable(window.location.hash.slice(1) || '/');

window.addEventListener('hashchange', () => {
    hash.set(window.location.hash.slice(1) || '/');
});

export const page = derived(hash, ($hash) => {
    if ($hash.startsWith('/leaderboard')) return '/leaderboard';
    return '/';
});
