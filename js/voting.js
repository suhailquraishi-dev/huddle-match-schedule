/* Community voting (PRD §7) — one vote per game per browser via
   localStorage. No accounts, no cross-device sync (explicitly Not V1). */

function voteKey(gameId) {
  return `huddle.vote.${gameId}`;
}

function getUserVote(gameId) {
  try {
    return localStorage.getItem(voteKey(gameId));
  } catch {
    return null;
  }
}

function setUserVote(gameId, side) {
  try {
    localStorage.setItem(voteKey(gameId), side);
  } catch {
    /* private-browsing / storage disabled — vote just won't persist */
  }
}

function isVotingLocked(game) {
  if (game.status !== "scheduled") return true;
  return new Date() >= new Date(game.scheduledAt);
}

function getVoteTally(game) {
  const userVote = getUserVote(game.id);
  const home = game.votes.home + (userVote === "home" ? 1 : 0);
  const away = game.votes.away + (userVote === "away" ? 1 : 0);
  return { home, away, total: home + away, userVote };
}

function getVotePercentages(game) {
  const { home, away, total } = getVoteTally(game);
  if (total === 0) return { homePct: 50, awayPct: 50 };
  return { homePct: Math.round((home / total) * 100), awayPct: Math.round((away / total) * 100) };
}

/* SHOWCASE MODE: voting stays open regardless of kickoff/game state (the
   normal `isVotingLocked(game)` gate is skipped below) so every card can
   demo the vote → results flow. Still one vote per game per browser, and
   still refuses on a cancelled game. Restore the commented check to go
   back to normal "closes at kickoff" behavior. */
function castVote(gameId, side) {
  const game = getGameById(gameId);
  if (!game || game.status === "cancelled" || getUserVote(gameId)) return false;
  // if (!game || isVotingLocked(game) || getUserVote(gameId)) return false;
  setUserVote(gameId, side);
  track("vote_submitted", { game_id: gameId, side, week: game.week });
  return true;
}
