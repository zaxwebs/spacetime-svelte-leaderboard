<script lang="ts">
    import { useSpacetimeDB, useTable, useReducer } from "spacetimedb/svelte";
    import { tables, reducers } from "./module_bindings";
    import { UserPlus, Trash2, Plus, Minus } from "lucide-svelte";
    import { z } from "zod";

    const conn = useSpacetimeDB();
    const [players] = useTable(tables.player);
    const addPlayerReducer = useReducer(reducers.addPlayer);
    const removePlayerReducer = useReducer(reducers.removePlayer);
    const addPointsReducer = useReducer(reducers.addPoints);
    const subtractPointsReducer = useReducer(reducers.subtractPoints);

    const nameSchema = z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name must be 30 characters or less")
        .regex(/^[a-zA-Z\s\-]+$/, "Letters, spaces, and hyphens only");

    let name = $state("");
    let error = $state("");

    function handleAdd(e: SubmitEvent) {
        e.preventDefault();
        error = "";
        if (!$conn.isActive) return;

        const result = nameSchema.safeParse(name);
        if (!result.success) {
            error = result.error.issues[0].message;
            return;
        }

        const trimmed = result.data;
        const duplicate = $players.some(
            (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
        );
        if (duplicate) {
            error = "A player with that name already exists";
            return;
        }

        addPlayerReducer({ name: trimmed });
        name = "";
    }

    function handleRemove(playerId: bigint) {
        if (!$conn.isActive) return;
        removePlayerReducer({ playerId });
    }

    function increment(playerId: bigint) {
        if (!$conn.isActive) return;
        addPointsReducer({ playerId, amount: 1n });
    }

    function decrement(playerId: bigint) {
        if (!$conn.isActive) return;
        subtractPointsReducer({ playerId, amount: 1n });
    }
</script>

<div class="page fade-in">
    <div class="page-header">
        <h1 class="page-title">Manage Players</h1>
        <p class="page-desc">Add, remove, and adjust player scores</p>
    </div>

    <div class="card add-card">
        <div class="label">Add New Player</div>
        <form class="add-form" onsubmit={handleAdd}>
            <input
                class="input"
                type="text"
                placeholder="Enter player name..."
                bind:value={name}
                disabled={!$conn.isActive}
                maxlength="50"
            />
            <button
                class="btn btn-primary"
                type="submit"
                disabled={!$conn.isActive || !name.trim()}
            >
                <UserPlus size={14} />
                Add
            </button>
        </form>
        {#if error}
            <p class="error-text">{error}</p>
        {/if}
    </div>

    <div class="card">
        <div class="card-header">
            <span class="label">Players</span>
            <span class="count">{$players.length}</span>
        </div>

        {#if $players.length === 0}
            <div class="empty-state">
                <p class="empty-text">
                    No players yet. Add someone to get started.
                </p>
            </div>
        {:else}
            <div class="player-list">
                {#each [...$players].sort( (a, b) => a.name.localeCompare(b.name), ) as player (player.id)}
                    <div class="player-row">
                        <div class="player-info">
                            <div class="player-avatar">
                                {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div class="player-name">{player.name}</div>
                                <div class="player-meta">
                                    #{player.id.toString()}
                                </div>
                            </div>
                        </div>

                        <div class="player-controls">
                            <div class="score-controls">
                                <button
                                    class="btn btn-icon"
                                    onclick={() => decrement(player.id)}
                                    disabled={!$conn.isActive}
                                    title="Subtract point"
                                >
                                    <Minus size={13} />
                                </button>
                                <span
                                    class="score-value"
                                    class:positive={player.score > 0n}
                                    class:negative={player.score < 0n}
                                >
                                    {player.score.toString()}
                                </span>
                                <button
                                    class="btn btn-icon"
                                    onclick={() => increment(player.id)}
                                    disabled={!$conn.isActive}
                                    title="Add point"
                                >
                                    <Plus size={13} />
                                </button>
                            </div>
                            <button
                                class="btn btn-danger btn-sm"
                                onclick={() => handleRemove(player.id)}
                                disabled={!$conn.isActive}
                                title="Remove player"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .page {
        padding: 28px 0;
    }
    .page-header {
        margin-bottom: 24px;
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

    .add-card {
        margin-bottom: 16px;
    }
    .add-form {
        display: flex;
        gap: 10px;
        margin-top: 12px;
    }
    .add-form .input {
        flex: 1;
    }
    .error-text {
        margin-top: 8px;
        font-size: 12px;
        color: var(--accent-red);
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
    }
    .count {
        font-family: "JetBrains Mono", monospace;
        font-size: 12px;
        color: var(--text-muted);
        padding: 2px 8px;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
    }

    .player-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .player-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        transition: all var(--transition);
    }
    .player-row:hover {
        border-color: var(--border-hover);
    }
    .player-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .player-avatar {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        background: var(--accent-dim);
        border: 1px solid var(--border-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 13px;
        color: var(--accent-bright);
    }
    .player-name {
        font-weight: 600;
        font-size: 13px;
    }
    .player-meta {
        font-family: "JetBrains Mono", monospace;
        font-size: 11px;
        color: var(--text-muted);
    }

    .player-controls {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .score-controls {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .score-value {
        min-width: 36px;
        text-align: center;
        font-family: "JetBrains Mono", monospace;
        font-size: 14px;
        font-weight: 700;
        color: var(--text-primary);
    }
    .score-value.positive {
        color: var(--accent-bright);
    }
    .score-value.negative {
        color: var(--accent-red);
    }

    .empty-state {
        text-align: center;
        padding: 36px 20px;
    }
    .empty-text {
        font-size: 13px;
        color: var(--text-muted);
    }
</style>
