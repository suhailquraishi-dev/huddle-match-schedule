/* Game components (final change doc §6, §8).

   Two renderers share one data model and one set of tokens:
     renderScheduleCard() — Week View. Three-row anatomy:
       day/date · status  →  team · time-or-score · team  →  meta · actions
     renderScheduleRow()  — Full Season. Compact scan row:
       Date | Matchup | Time | Status | Add to Schedule

   renderGameCard() below is the older stacked card, still used by the
   single-game page and the article embeds. */

/* Stroke-based checkmark matching the weight/rounding of the reference
   repo's chevron icon (site-chrome.js .profile-chevron) — no checkmark
   asset exists there to reuse directly, so this is drawn to match it. */
const CHECK_ICON = `<svg class="check-icon" viewBox="0 0 16 12" fill="none" aria-hidden="true"><path d="M1.5 6.5L5.5 10.5L14.5 1.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const CHECK_ICON_BTN = `<svg class="btn-icon" viewBox="0 0 16 12" fill="none" aria-hidden="true"><path d="M1.5 6.5L5.5 10.5L14.5 1.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

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

/* Statuses where a score exists and the game is underway or done */
const SCORED = ["live", "final", "final-pending", "delayed"];

/* Row 1's day/date is derived from the kickoff timestamp, not the
   authored dateLabel, so it agrees with the Full Season row and with the
   viewer's timezone. */
function cardDayLabel(iso) {
  return new Date(iso)
    .toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase();
}
function ordinalDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function shortDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}
/* NFL is a US-audience sport, so ET is the primary, always-shown time
   (per hub-sub copy: "ET, with your local time alongside"). The
   viewer's own local time is shown as a secondary line wherever there
   is room, and dropped when it would just repeat ET. */
function kickoffTimeET(iso) {
  const time = new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  return `${time} ET`;
}
function kickoffTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
function kickoffTimeTz(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
}
/* Local time alongside ET, or nothing if the viewer is already on ET
   (Eastern browsers would otherwise see the same clock time twice). */
function kickoffTimeLocalNote(iso) {
  const et = new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  const local = kickoffTime(iso);
  return et === local ? "" : `${kickoffTimeTz(iso)} local`;
}

/* --- Add to Schedule state (§9: confirm success) ------------------- */
function calKey(gameId) { return `huddle.cal.${gameId}`; }
function isOnCalendar(gameId) {
  try { return !!localStorage.getItem(calKey(gameId)); } catch { return false; }
}
function markOnCalendar(gameId) {
  try { localStorage.setItem(calKey(gameId), "1"); } catch { /* storage disabled */ }
  document.querySelectorAll(`[data-cal-for="${gameId}"]`).forEach((btn) => {
    btn.classList.add("btn-added");
    btn.classList.remove("btn-primary");
    btn.innerHTML = `${CHECK_ICON_BTN}Added to Calendar`;
  });
}

function calendarButton(game, variant = "secondary") {
  const added = isOnCalendar(game.id);
  const cls = added ? "btn btn-added" : `btn btn-${variant}`;
  const label = added ? `${CHECK_ICON_BTN}Added to Calendar` : `${CALENDAR_ICON}Add to Schedule`;
  return `<button class="${cls}" data-cal-for="${game.id}" onclick='openScheduleModal(${JSON.stringify(game)})'>${label}</button>`;
}

function viewGameButton(game) {
  const label = game.status === "live" || game.status === "delayed"
    ? "Watch Game Live"
    : game.status === "final" || game.status === "final-pending"
    ? "Watch Highlights"
    : "View Game";
  return `<a class="btn btn-secondary" href="game.html?id=${game.id}">${label}</a>`;
}

/* --- Broadcasters -------------------------------------------------- */

/* Networks show as their logo, not their name. `broadcast` strings read
   "NBC · Sunday Night Football", so the network token is matched to an
   asset and any showcase suffix stays as text beside it. If a logo file
   is missing the markup falls back to the network's name, so the card
   never renders a broken image. */
const BROADCASTERS = {
  "abc/espn": { name: "ABC / ESPN", file: "espn" },
  espn: { name: "ESPN", file: "espn" },
  abc: { name: "ABC", file: "abc" },
  cbs: { name: "CBS", file: "cbs" },
  fox: { name: "FOX", file: "fox" },
  nbc: { name: "NBC", file: "nbc" },
  "nfl network": { name: "NFL Network", file: "nfl-network" },
  "prime video": { name: "Prime Video", file: "prime-video" },
};

function broadcastHtml(broadcast) {
  if (!broadcast) return "";
  const [network, ...rest] = broadcast.split("·").map((s) => s.trim());
  const b = BROADCASTERS[network.toLowerCase()];
  const show = rest.join(" · ");
  if (!b) return `<span class="sc-bcast">${broadcast}</span>`;
  return `<span class="sc-bcast">
      <img src="assets/broadcasters/${b.file}.svg" alt="${b.name}" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
      <span hidden>${b.name}</span>
      ${show ? `<span class="sc-bcast-show">${show}</span>` : ""}
    </span>`;
}

/* --- Voting -------------------------------------------------------- */
/* White or near-black label, whichever reads better on the team color
   (sRGB relative luminance, WCAG 4.5:1 crossover sits near .36). */
function readableOn(hex) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.36 ? "#06111F" : "#FFFFFF";
}

function voteButtons(game) {
  return ["away", "home"].map((side) => {
    const t = getTeam(game[side].abbr);
    return `<button class="vote-btn vote-btn-team" style="background:${t.color}; border-color:${t.color}; color:${readableOn(t.color)};" onclick="handleVoteClick('${game.id}','${side}')">Vote <img src="${t.logo}" alt="${t.name}"></button>`;
  }).join("");
}

/* One bar, both team colors — team color as accent only (§5) */
function voteBar(game) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  const { homePct, awayPct } = getVotePercentages(game);
  const { total } = getVoteTally(game);
  const locked = isVotingLocked(game);
  return `
    <div class="sc-vote">
      <div class="vote-bar">
        <div class="vote-seg" style="width:${awayPct}%; background:${away.color};"></div><div class="vote-seg" style="width:${homePct}%; background:${home.color};"></div>
      </div>
      <div class="vote-legend">
        <span>${awayPct}%</span>
        <span>${homePct}%</span>
      </div>
      <div class="vote-count">${total.toLocaleString()} votes${locked ? " · voting closed" : ""}</div>
    </div>`;
}

/* --- Week View card (§6) ------------------------------------------- */

/* Row 2 centre: kickoff time dominates before the game, the score
   dominates once it starts, and status dominates when the game isn't
   happening as planned. */
function cardCentre(game) {
  const scored = SCORED.includes(game.status) && game.away.score !== undefined;
  if (scored) {
    const awayWin = game.winner === "away", homeWin = game.winner === "home";
    const note = game.status === "live" ? game.statusDetail
      : game.status === "final-pending" ? "Final pending"
      : game.status === "delayed" ? game.statusDetail
      : ""; /* final: row 1 already carries the date, the pill the state */
    const strong = game.status === "live" || game.status === "delayed" || game.status === "final-pending";
    return `
      <div class="sc-score"><span class="${awayWin ? "win" : ""}">${game.away.score}</span><span class="sc-sep">–</span><span class="${homeWin ? "win" : ""}">${game.home.score}</span></div>
      ${note ? `<span class="sc-center-note ${strong ? "strong" : ""}">${note}</span>` : ""}`;
  }
  if (game.status === "postponed") {
    return `<div class="sc-time">Postponed</div><span class="sc-center-note strong">New date ${shortDate(game.scheduledAt)}</span>`;
  }
  if (game.status === "cancelled") {
    return `<div class="sc-time muted">${kickoffTimeET(game.scheduledAt)}</div><span class="sc-center-note strong">Will not be played</span>`;
  }
  const localNote = kickoffTimeLocalNote(game.scheduledAt);
  return `<div class="sc-time">${kickoffTimeET(game.scheduledAt)}</div>${localNote ? `<span class="sc-center-note">${localNote}</span>` : ""}`;
}

function cardActions(game) {
  const canVote = game.status === "scheduled" && !isVotingLocked(game) && !getUserVote(game.id);
  switch (game.status) {
    case "scheduled":
      return `${canVote ? voteButtons(game) : ""}${calendarButton(game)}`;
    case "postponed":
      return calendarButton(game);
    case "cancelled":
      return "";
    default:
      return viewGameButton(game);
  }
}

function teamSide(abbr, side, winner) {
  const t = getTeam(abbr);
  const loser = winner && winner !== side ? "loser" : "";
  const logo = `<img src="${t.logo}" alt="${t.name}">`;
  const name = `<span class="sc-team-name">${t.short}</span>`;
  return `<div class="sc-team ${side} ${loser}">${side === "home" ? name + logo : logo + name}</div>`;
}

function renderScheduleCard(game) {
  const showVotes = game.status !== "cancelled" &&
    (game.status !== "scheduled" || isVotingLocked(game) || !!getUserVote(game.id));
  const actions = cardActions(game);
  const place = [game.venue, game.city].filter(Boolean).join(" · ");
  return `
  <div class="schedule-card status-${game.status}" data-game-id="${game.id}">
    <div class="sc-top">
      <span class="sc-day">${cardDayLabel(game.scheduledAt)}</span>
      <span class="sc-status">${STATUS_LABEL[game.status]}</span>
    </div>
    <div class="sc-main">
      ${teamSide(game.away.abbr, "away", game.winner)}
      <div class="sc-center">${cardCentre(game)}</div>
      ${teamSide(game.home.abbr, "home", game.winner)}
    </div>
    ${showVotes ? voteBar(game) : ""}
    <div class="sc-bottom">
      <span class="sc-meta">${place}${broadcastHtml(game.broadcast)}</span>
      ${actions ? `<div class="sc-actions">${actions}</div>` : ""}
    </div>
  </div>`;
}

/* --- Full Season compact row (§8) ---------------------------------- */
function rowStatusClass(status) {
  if (status === "live") return "live";
  if (status === "final") return "final";
  if (status === "scheduled" || status === "cancelled") return "";
  return "warn";
}

function renderScheduleRow(game) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  const scored = SCORED.includes(game.status) && game.away.score !== undefined;
  const time = scored
    ? `${game.away.score}–${game.home.score}`
    : game.status === "postponed" || game.status === "cancelled" ? "—" : kickoffTimeET(game.scheduledAt);
  const action = game.status === "scheduled" || game.status === "postponed"
    ? calendarButton(game, "secondary")
    : viewGameButton(game);
  return `
  <div class="schedule-row status-${game.status}" data-game-id="${game.id}">
    <span class="sr-date">${shortDate(game.scheduledAt)}</span>
    <span class="sr-match"><img src="${away.logo}" alt="${away.name}">${away.short}<span class="sr-at">@</span><img src="${home.logo}" alt="${home.name}">${home.short}</span>
    <span class="sr-time">${time}</span>
    <span class="sr-status ${rowStatusClass(game.status)}">${STATUS_LABEL[game.status]}</span>
    <span class="sr-action">${action}</span>
  </div>`;
}

/* --- Legacy stacked card — single-game page + article embeds -------- */
function teamRowV1(abbr, score, opts) {
  const t = getTeam(abbr);
  const scoreHtml = score !== undefined ? `<span class="team-score">${score}</span>` : "";
  const winnerClass = opts.winner === opts.side ? "winner" : "";
  return `
    <div class="team-row ${winnerClass}">
      <span class="team-name"><img class="team-logo" src="${t.logo}" alt="${t.name}" width="28" height="28">${t.short}</span>
      ${scoreHtml}
    </div>`;
}

function predictionHtml(game) {
  if (!game.winner) return "";
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  const { homePct, awayPct } = getVotePercentages(game);
  const tally = getVoteTally(game);
  const majoritySide = tally.home >= tally.away ? "home" : "away";
  const majorityTeam = majoritySide === "home" ? home : away;
  const majorityPct = majoritySide === "home" ? homePct : awayPct;
  const winnerTeam = game.winner === "home" ? home : away;
  return majoritySide === game.winner
    ? `<div class="prediction-result correct">${majorityPct}% picked ${majorityTeam.short} ${CHECK_ICON}</div>`
    : `<div class="prediction-result incorrect">${majorityPct}% picked ${majorityTeam.short}<br>${winnerTeam.short} won ${game.home.score}–${game.away.score}</div>`;
}

function cardBodyHtml(game) {
  const canVote = game.status === "scheduled" && !isVotingLocked(game) && !getUserVote(game.id);
  const votes = game.status === "cancelled" ? "" : voteBar(game);
  switch (game.status) {
    case "scheduled":
      return `
        <div class="card-bottom"><span>${kickoffTimeET(game.scheduledAt)}${kickoffTimeLocalNote(game.scheduledAt) ? ` · ${kickoffTimeLocalNote(game.scheduledAt)}` : ""}</span><span>${broadcastHtml(game.broadcast) || "TV TBD"}</span></div>
        ${canVote ? `<div class="sc-actions" style="margin-top:12px;">${voteButtons(game)}</div>` : votes}
        <div class="sc-actions" style="margin-top:12px;">${calendarButton(game)}</div>`;
    case "live":
    case "delayed":
      return `
        <div class="card-bottom"><span class="situation">${game.statusDetail}</span><span>${broadcastHtml(game.broadcast)}</span></div>
        ${votes}`;
    case "final-pending":
      return `
        <div class="card-bottom"><span class="situation">Final Pending</span><span>${broadcastHtml(game.broadcast)}</span></div>
        ${votes}`;
    case "final":
      return `
        <div class="card-bottom"><span>${broadcastHtml(game.broadcast)}</span></div>
        ${votes}${predictionHtml(game)}`;
    case "postponed":
      return `
        <div class="card-bottom"><span class="situation">Rescheduled from ${game.rescheduledFrom || "original date"}</span></div>
        <div class="freshness">New date: ${ordinalDate(game.scheduledAt)} · ${kickoffTimeET(game.scheduledAt)}</div>
        <div class="sc-actions" style="margin-top:12px;">${calendarButton(game)}</div>`;
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
      <span class="card-meta">${ordinalDate(game.scheduledAt)}</span>
    </div>
    <div class="matchup">
      ${teamRowV1(game.away.abbr, game.away.score, { winner: game.winner, side: "away" })}
      ${teamRowV1(game.home.abbr, game.home.score, { winner: game.winner, side: "home" })}
    </div>
    ${cardBodyHtml(game)}
  </div>`;
}

/* Re-render whichever shape this game is currently drawn as. */
function handleVoteClick(gameId, side) {
  if (!castVote(gameId, side)) return;
  const game = getGameById(gameId);
  document.querySelectorAll(`[data-game-id="${gameId}"]`).forEach((el) => {
    if (el.classList.contains("schedule-card")) el.outerHTML = renderScheduleCard(game);
    else if (el.classList.contains("schedule-row")) el.outerHTML = renderScheduleRow(game);
    else el.outerHTML = renderGameCard(game);
  });
}
