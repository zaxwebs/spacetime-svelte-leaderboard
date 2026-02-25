<script lang="ts">
    import { useSpacetimeDB, useTable } from "spacetimedb/svelte";
    import { tables } from "./module_bindings";
    import { flip } from "svelte/animate";

    const conn = useSpacetimeDB();
    const [players] = useTable(tables.player);

    const sorted = $derived(
        [...$players].sort((a, b) => {
            const diff = b.score - a.score;
            if (diff > 0n) return 1;
            if (diff < 0n) return -1;
            return a.name.localeCompare(b.name);
        }),
    );
</script>

<div class="page fade-in">
    <div class="page-header">
        <div class="page-header-top">
            <div>
                <h1 class="page-title">Leaderboard</h1>
                <p class="page-desc">Real-time player rankings</p>
            </div>
            <div
                class="status-badge"
                class:connected={$conn.isActive}
                class:disconnected={!$conn.isActive}
            >
                <span class="status-dot"></span>
                {$conn.isActive ? "Live" : "Offline"}
            </div>
        </div>
    </div>

    {#if sorted.length === 0}
        <div class="card">
            <div class="empty-state">
                <p class="empty-text">
                    No players on the board. <a href="#/" class="link"
                        >Add some players</a
                    > to get started.
                </p>
            </div>
        </div>
    {:else}
        <div class="lb-table">
            <div class="lb-header">
                <span class="lb-col-rank label">Rank</span>
                <span class="lb-col-player label">Player</span>
                <span class="lb-col-score label">Score</span>
            </div>

            {#each sorted as player, index (player.id)}
                <div
                    class="lb-row"
                    class:top-1={index === 0}
                    class:top-2={index === 1}
                    class:top-3={index === 2}
                    animate:flip={{ duration: 300 }}
                >
                    <span class="lb-col-rank">
                        <span
                            class="rank-num"
                            class:gold={index === 0}
                            class:silver={index === 1}
                            class:bronze={index === 2}
                        >
                            {index + 1}
                        </span>
                    </span>

                    <span class="lb-col-player">
                        <span
                            class="lb-avatar"
                            class:gold={index === 0}
                            class:silver={index === 1}
                            class:bronze={index === 2}
                        >
                            {player.name.charAt(0).toUpperCase()}
                        </span>
                        <span class="lb-name">{player.name}</span>
                    </span>

                    <span
                        class="lb-col-score"
                        class:positive={player.score > 0n}
                        class:negative={player.score < 0n}
                    >
                        {player.score.toString()}
                    </span>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .page {
        padding: 28px 0;
    }
    .page-header {
        margin-bottom: 24px;
    }
    .page-header-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
    .page-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
    }
    .page-desc {
        margin-top: 4px;
        color: var(--text-secondary);
        font-size: 13px;
    }

    .lb-table {
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        overflow: hidden;
    }

    .lb-header {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
    }

    .lb-row {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border);
        transition: background var(--transition);
    }
    .lb-row:last-child {
        border-bottom: none;
    }
    .lb-row:hover {
        background: var(--bg-card-hover);
    }
    .lb-row.top-1 {
        background: rgba(251, 191, 36, 0.04);
    }
    .lb-row.top-1:hover {
        background: rgba(251, 191, 36, 0.07);
    }

    .lb-col-rank {
        width: 60px;
        flex-shrink: 0;
    }
    .lb-col-player {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
    }
    .lb-col-score {
        width: 80px;
        text-align: right;
        flex-shrink: 0;
        font-family: "JetBrains Mono", monospace;
        font-size: 14px;
        font-weight: 700;
        color: var(--text-primary);
    }
    .lb-col-score.positive {
        color: var(--accent-bright);
    }
    .lb-col-score.negative {
        color: var(--accent-red);
    }

    .rank-num {
        font-family: "JetBrains Mono", monospace;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-muted);
    }
    .rank-num.gold {
        color: #fbbf24;
    }
    .rank-num.silver {
        color: #9ca3af;
    }
    .rank-num.bronze {
        color: #b87333;
    }

    .lb-avatar {
        width: 30px;
        height: 30px;
        border-radius: 6px;
        background: var(--accent-dim);
        border: 1px solid var(--border-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 12px;
        color: var(--accent-bright);
        flex-shrink: 0;
    }
    .lb-avatar.gold {
        background: rgba(251, 191, 36, 0.1);
        border-color: rgba(251, 191, 36, 0.25);
        color: #fbbf24;
    }
    .lb-avatar.silver {
        background: rgba(156, 163, 175, 0.1);
        border-color: rgba(156, 163, 175, 0.25);
        color: #9ca3af;
    }
    .lb-avatar.bronze {
        background: rgba(184, 115, 51, 0.1);
        border-color: rgba(184, 115, 51, 0.25);
        color: #b87333;
    }

    .lb-name {
        font-weight: 500;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .empty-state {
        text-align: center;
        padding: 36px 20px;
    }
    .empty-text {
        font-size: 13px;
        color: var(--text-muted);
    }
    .link {
        color: var(--accent-bright);
        text-decoration: none;
    }
    .link:hover {
        text-decoration: underline;
    }
</style>
