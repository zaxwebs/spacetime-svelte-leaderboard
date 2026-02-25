import { schema, table, t } from 'spacetimedb/server';
import { SenderError } from 'spacetimedb/server';

const spacetimedb = schema({
  player: table(
    { name: 'player', public: true },
    {
      id: t.u64().primaryKey().autoInc(),
      name: t.string(),
      score: t.i64(),
    }
  ),
});
export default spacetimedb;

export const init = spacetimedb.init((_ctx) => {
  // Called when the module is initially published
});

export const onConnect = spacetimedb.clientConnected((_ctx) => {
  // Called every time a new client connects
});

export const onDisconnect = spacetimedb.clientDisconnected((_ctx) => {
  // Called every time a client disconnects
});

export const add_player = spacetimedb.reducer(
  { name: t.string() },
  (ctx, { name }) => {
    if (!name.trim()) throw new SenderError('Name cannot be empty');
    ctx.db.player.insert({ id: 0n, name: name.trim(), score: 0n });
  }
);

export const remove_player = spacetimedb.reducer(
  { playerId: t.u64() },
  (ctx, { playerId }) => {
    const player = ctx.db.player.id.find(playerId);
    if (!player) throw new SenderError('Player not found');
    ctx.db.player.id.delete(playerId);
  }
);

export const add_points = spacetimedb.reducer(
  { playerId: t.u64(), amount: t.i64() },
  (ctx, { playerId, amount }) => {
    const player = ctx.db.player.id.find(playerId);
    if (!player) throw new SenderError('Player not found');
    if (amount <= 0n) throw new SenderError('Amount must be positive');
    ctx.db.player.id.update({ ...player, score: player.score + amount });
  }
);

export const subtract_points = spacetimedb.reducer(
  { playerId: t.u64(), amount: t.i64() },
  (ctx, { playerId, amount }) => {
    const player = ctx.db.player.id.find(playerId);
    if (!player) throw new SenderError('Player not found');
    if (amount <= 0n) throw new SenderError('Amount must be positive');
    ctx.db.player.id.update({ ...player, score: player.score - amount });
  }
);
