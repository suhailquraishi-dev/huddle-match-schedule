/* Article embeds (PRD §9) — a CMS shortcode like `schedule game="dal-nyg-2026-w1"`
   would compile down to a mount point plus this hydration script in a real
   editor. All three embed kinds render through the exact same
   renderGameCard() used by the Schedule Hub. */

function hydrateEmbed(el) {
  const gameId = el.dataset.game;
  const week = el.dataset.week;
  const team = el.dataset.team;

  if (gameId) {
    const game = getGameById(gameId);
    el.innerHTML = game
      ? `<div class="game-grid" style="max-width:340px;">${renderGameCard(game)}</div>`
      : `<div class="empty-state"><strong>Game not found</strong>${gameId}</div>`;
    track("embed_interaction", { type: "game", game_id: gameId });
    return;
  }

  if (week) {
    const games = getGamesForWeek(Number(week));
    el.innerHTML = `<div class="game-grid">${games.map(renderGameCard).join("")}</div>`;
    track("embed_interaction", { type: "week", week: Number(week) });
    return;
  }

  if (team) {
    const games = getUpcomingGamesForTeam(team, 3);
    el.innerHTML = games.length
      ? `<div class="game-grid" style="max-width:340px;">${games.map(renderGameCard).join("")}</div>`
      : `<div class="empty-state"><strong>No upcoming games</strong>${getTeam(team).name} has nothing scheduled.</div>`;
    track("embed_interaction", { type: "team", team });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".schedule-embed").forEach(hydrateEmbed);
  document.querySelectorAll(".full-schedule-link").forEach((a) => {
    a.addEventListener("click", () => track("full_schedule_clicked_from_embed", {}));
  });
});
