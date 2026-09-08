/* Shared game-card component (PRD §6) — the single card renderer used by
   the Schedule Hub (Week View + Full Season), article embeds, and the
   single-game page. No play-by-play or advanced stats (explicitly Not
   V1) — just what the four V1 questions need: when, who's favored, can I
   remember it, who won. */

/* Stroke-based checkmark matching the weight/rounding of the reference
   repo's chevron icon (site-chrome.js .profile-chevron) — no checkmark
   asset exists there to reuse directly, so this is drawn to match it. */
const CHECK_ICON = `<svg class="check-icon" viewBox="0 0 16 12" fill="none" aria-hidden="true"><path d="M1.5 6.5L5.5 10.5L14.5 1.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const CALENDAR_ICON = `<svg class="btn-icon" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><circle cx="386" cy="210" r="20"/><path d="M432,40h-26V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v20h-91V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v20h-90V20c0-11.046-8.954-20-20-20s-20,8.954-20,20v20H80C35.888,40,0,75.888,0,120v312c0,44.112,35.888,80,80,80h153c11.046,0,20-8.954,20-20c0-11.046-8.954-20-20-20H80c-22.056,0-40-17.944-40-40V120c0-22.056,17.944-40,40-40h25v20c0,11.046,8.954,20,20,20s20-8.954,20-20V80h90v20c0,11.046,8.954,20,20,20s20-8.954,20-20V80h91v20c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V80h26c22.056,0,40,17.944,40,40v114c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V120C512,75.888,476.112,40,432,40z"/><path d="M391,270c-66.72,0-121,54.28-121,121s54.28,121,121,121s121-54.28,121-121S457.72,270,391,270z M391,472c-44.663,0-81-36.336-81-81s36.337-81,81-81c44.663,0,81,36.336,81,81S435.663,472,391,472z"/><path d="M420,371h-9v-21c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v41c0,11.046,8.954,20,20,20h29c11.046,0,20-8.954,20-20C440,379.954,431.046,371,420,371z"/><circle cx="299" cy="210" r="20"/><circle cx="212" cy="297" r="20"/><circle cx="125" cy="210" r="20"/><circle cx="125" cy="297" r="20"/><circle cx="125" cy="384" r="20"/><circle cx="212" cy="384" r="20"/><circle cx="212" cy="210" r="20"/></svg>`;

const STATUS_LABEL = {
  scheduled: "Scheduled",
  live: "Live",
  "final-pending": "Final Pending",
  final: "Final",
  delayed: "Delayed",
  postponed: "Postponed",
  cancelled: "Cancelled",
};

function ordinalDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function kickoffTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
}

function teamRowV1(abbr, score, opts) {
  const t = getTeam(abbr);
  const scoreHtml = score !== undefined ? `<span class="team-score">${score}</span>` : "";
  const winnerClass = opts.winner === opts.side ? "winner" : "";
  return `
    <div class="team-row ${winnerClass}">
      <span class="team-name"><img class="team-logo" src="${t.logo}" alt="${t.name}" width="24" height="24">${t.short}</span>
      ${scoreHtml}
    </div>`;
}

function voteButtonsHtml(game) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  return `
    <div class="vote-row">
      <button class="vote-btn" onclick="handleVoteClick('${game.id}','away')">Vote ${away.short}</button>
      <button class="vote-btn" onclick="handleVoteClick('${game.id}','home')">Vote ${home.short}</button>
    </div>`;
}

function voteResultsHtml(game, opts = {}) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  const { homePct, awayPct } = getVotePercentages(game);
  const { total } = getVoteTally(game);
  const locked = isVotingLocked(game);
  let predictionHtml = "";
  if (opts.showPrediction && game.winner) {
    const tally = getVoteTally(game);
    const majoritySide = tally.home >= tally.away ? "home" : "away";
    const majorityTeam = majoritySide === "home" ? home : away;
    const majorityPct = majoritySide === "home" ? homePct : awayPct;
    const winnerTeam = game.winner === "home" ? home : away;
    const correct = majoritySide === game.winner;
    predictionHtml = correct
      ? `<div class="prediction-result correct">${majorityPct}% picked ${majorityTeam.short} ${CHECK_ICON}</div>`
      : `<div class="prediction-result incorrect">${majorityPct}% picked ${majorityTeam.short}<br>${winnerTeam.short} won ${game.home.score}–${game.away.score}</div>`;
  }
  return `
    <div class="vote-results">
      <div class="vote-bar-row"><span>${away.short}</span><div class="vote-bar"><div class="vote-bar-fill away" style="width:${awayPct}%"></div></div><span>${awayPct}%</span></div>
      <div class="vote-bar-row"><span>${home.short}</span><div class="vote-bar"><div class="vote-bar-fill home" style="width:${homePct}%"></div></div><span>${homePct}%</span></div>
      <div class="vote-total">${total.toLocaleString()} votes${locked ? " · Voting closed" : ""}</div>
    </div>
    ${predictionHtml}`;
}

function calendarButtonHtml(game) {
  return `<button class="cta-btn full" onclick='openScheduleModal(${JSON.stringify(game)})'>${CALENDAR_ICON}Add to Calendar</button>`;
}

function cardBodyHtml(game) {
  const hasVotedOrLocked = isVotingLocked(game) || !!getUserVote(game.id);
  switch (game.status) {
    case "scheduled":
      return `
        <div class="card-bottom"><span>${ordinalDate(game.scheduledAt)} · ${kickoffTime(game.scheduledAt)}</span><span>${game.broadcast || "TV TBD"}</span></div>
        ${hasVotedOrLocked ? voteResultsHtml(game) : voteButtonsHtml(game)}
        ${calendarButtonHtml(game)}`;
    case "live":
      return `
        <div class="card-bottom"><span class="situation">${game.statusDetail}</span><span>${game.broadcast || ""}</span></div>
        ${voteResultsHtml(game)}`;
    case "final-pending":
      return `
        <div class="card-bottom"><span class="situation">Final Pending</span><span>${game.broadcast || ""}</span></div>
        ${voteResultsHtml(game)}`;
    case "final":
      return `
        <div class="card-bottom"><span>${ordinalDate(game.scheduledAt)}</span><span>${game.broadcast || ""}</span></div>
        ${voteResultsHtml(game, { showPrediction: true })}`;
    case "delayed":
      return `
        <div class="card-bottom"><span class="situation">${game.statusDetail}</span></div>
        ${voteResultsHtml(game)}`;
    case "postponed":
      return `
        <div class="card-bottom"><span class="situation">Rescheduled from ${game.rescheduledFrom || "original date"}</span></div>
        <div class="freshness">New date: ${ordinalDate(game.scheduledAt)} · ${kickoffTime(game.scheduledAt)}</div>
        ${calendarButtonHtml(game)}`;
    case "cancelled":
      return `<div class="card-bottom"><span class="situation">This game will not be played.</span></div>`;
    default:
      return "";
  }
}

function renderGameCard(game) {
  return `
  <div class="game-card-v1" data-game-id="${game.id}">
    <div class="card-top">
      <span class="status-badge status-${game.status}">${STATUS_LABEL[game.status]}</span>
      <span class="card-meta">${game.dateLabel}</span>
    </div>
    <div class="matchup">
      ${teamRowV1(game.away.abbr, game.away.score, { winner: game.winner, side: "away" })}
      ${teamRowV1(game.home.abbr, game.home.score, { winner: game.winner, side: "home" })}
    </div>
    ${cardBodyHtml(game)}
  </div>`;
}

function handleVoteClick(gameId, side) {
  if (!castVote(gameId, side)) return;
  const game = getGameById(gameId);
  document.querySelectorAll(`[data-game-id="${gameId}"]`).forEach((el) => {
    el.outerHTML = renderGameCard(game);
  });
}
