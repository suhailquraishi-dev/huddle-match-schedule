/* Game components (final change doc §6, §8 + the MWeb design-brief pass).

   Two renderers share one data model and one set of tokens:
     renderScheduleCard() — Week View. Three-row anatomy:
       status  →  team · time-or-score · team  →  meta · actions
     renderScheduleRow()  — Full Season. Compact scan row:
       Date | Matchup | Time | Status | Add to Schedule

   renderGameCard() below is the older stacked card, still used by the
   single-game page and the article embeds. It shares the same voting
   components (votingPanel/resultsBar) as the redesigned schedule card. */

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

/* True when a game's local calendar date is tomorrow relative to now —
   drives the "Happening Tomorrow" banner on Week View cards. */
function isTomorrow(iso) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Date(iso).toDateString() === tomorrow.toDateString();
}

/* Top banner for a card: live games take priority ("Happening Now",
   with a pulsing red dot) over the tomorrow note, since a game in
   progress is more urgent than one that's merely next up. */
function bannerHtml(game) {
  if (game.status === "live") {
    return `<div class="sc-happening-banner sc-happening-live"><span class="sc-live-dot"></span>Happening Now</div>`;
  }
  if (game.status === "scheduled" && isTomorrow(game.scheduledAt)) {
    return `<div class="sc-happening-banner">Happening Tomorrow</div>`;
  }
  return "";
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

/* --- Remind Me / calendar state (§9: confirm success) --------------- */
function calKey(gameId) { return `huddle.cal.${gameId}`; }
function isOnCalendar(gameId) {
  try { return !!localStorage.getItem(calKey(gameId)); } catch { return false; }
}
function markOnCalendar(gameId) {
  try { localStorage.setItem(calKey(gameId), "1"); } catch { /* storage disabled */ }
  document.querySelectorAll(`[data-cal-for="${gameId}"]`).forEach((btn) => {
    btn.classList.add("btn-added");
    btn.classList.remove("btn-primary");
    btn.innerHTML = `${CHECK_ICON_BTN}Reminder Set`;
  });
}

function calendarButton(game, variant = "secondary") {
  const added = isOnCalendar(game.id);
  const cls = added ? "btn btn-added" : `btn btn-${variant}`;
  const label = added ? `${CHECK_ICON_BTN}Reminder Set` : `${CALENDAR_ICON}Remind Me`;
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
  espn: { name: "ESPN", file: "espn" },
  abc: { name: "ABC", file: "abc" },
  cbs: { name: "CBS", file: "cbs" },
  fox: { name: "FOX", file: "fox" },
  nbc: { name: "NBC", file: "nbc" },
  "nfl network": { name: "NFL Network", file: "nfl-network" },
  "prime video": { name: "Prime Video", file: "prime-video" },
};

/* A broadcast string can name more than one network for the same game
   (simulcasts like "ABC/ESPN · Monday Night Football") — every network
   named gets its own logo, looped through in order, sharing one
   showcase suffix. Falls back to the plain broadcast text if any named
   network isn't in BROADCASTERS, so nothing renders half-blank. */
function broadcastHtml(broadcast) {
  if (!broadcast) return "";
  const [networksPart, ...rest] = broadcast.split("·").map((s) => s.trim());
  const show = rest.join(" · ");
  const networks = networksPart.split("/").map((s) => s.trim());
  const matched = networks.map((n) => BROADCASTERS[n.toLowerCase()]);
  if (matched.some((b) => !b)) return `<span class="sc-bcast">${broadcast}</span>`;
  const logos = matched.map((b) =>
    `<img src="assets/broadcasters/${b.file}.svg" alt="${b.name}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>${b.name}</span>`
  ).join("");
  return `<span class="sc-bcast">${logos}${show ? `<span class="sc-bcast-show">${show}</span>` : ""}</span>`;
}

/* Bare network mark(s), no wrapping dot/name-fallback — for sitting
   inside a button after its label (e.g. "Watch Game Live [logo]")
   rather than in the venue/meta line. */
function broadcastLogoOnly(broadcast) {
  if (!broadcast) return "";
  const [networksPart] = broadcast.split("·").map((s) => s.trim());
  const networks = networksPart.split("/").map((s) => s.trim());
  const matched = networks.map((n) => BROADCASTERS[n.toLowerCase()]);
  if (matched.some((b) => !b)) return "";
  return matched.map((b) =>
    `<img class="btn-bcast-logo" src="assets/broadcasters/${b.file}.svg" alt="${b.name}" onerror="this.hidden=true">`
  ).join("");
}

/* ESPN's statusDetail reads "4th Quarter" / "Halftime" / "OT" while
   playing — condensed to "Q4" / "HALF" / "OT" for the live scoreboard
   clock badge. */
function quarterLabel(detail) {
  if (!detail) return "Live";
  const m = detail.match(/(\d+)(st|nd|rd|th)\s*Quarter/i);
  if (m) return `Quarter ${m[1]}`;
  if (/halftime/i.test(detail)) return "Halftime";
  if (/overtime|\bOT\b/i.test(detail)) return "Overtime";
  return detail;
}

/* --- Voting ---------------------------------------------------------
   Two components replace the old solid-color vote buttons and thin
   progress line: votingPanel() (open, pre-kickoff — a big clickable
   "Who Wins?" choice) and resultsBar() (closed — a percentage bar
   attached to each team, shown once voting locks or the viewer has
   voted). Team color is a border/tint accent only, never a solid fill,
   so no single team's brand color dominates the panel's visual weight. */

function votingPanel(game) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  return `
    <div class="sc-vote-panel">
      <div class="vote-heading">Make Your Pick</div>
      <div class="vote-options">
        <button type="button" class="vote-option" data-side="away" style="--team-color:${away.color};" onclick="handleVoteClick('${game.id}','away')">
          <img src="${away.logo}" alt="">
          <span class="vote-option-name">${away.short}</span>
          <span class="vote-indicator"></span>
        </button>
        <button type="button" class="vote-option" data-side="home" style="--team-color:${home.color};" onclick="handleVoteClick('${game.id}','home')">
          <img src="${home.logo}" alt="">
          <span class="vote-option-name">${home.short}</span>
          <span class="vote-indicator"></span>
        </button>
      </div>
    </div>`;
}

/* Closed/results state. Percentages and the bar fill animate in from 0
   on render (see animateVoteUI) rather than appearing at their final
   value, per the motion spec. Live games keep the score as the card's
   focal point, so results read visually secondary there. */
function resultsBar(game) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  const { homePct, awayPct } = getVotePercentages(game);
  const { total, userVote } = getVoteTally(game);
  const locked = isVotingLocked(game);
  const awayWinning = awayPct > homePct, homeWinning = homePct > awayPct;
  const pickedTeam = userVote === "home" ? home : userVote === "away" ? away : null;
  const secondary = game.status === "live" ? " is-secondary" : "";
  return `
    <div class="sc-vote-results${secondary}">
      <div class="results-row">
        <div class="results-team ${awayWinning ? "winning" : ""}">
          <img src="${away.logo}" alt="">
          <span class="results-name">${away.short}</span>
          <span class="results-pct" data-animate-pct="${awayPct}">0%</span>
        </div>
        <div class="results-team ${homeWinning ? "winning" : ""}">
          <span class="results-pct" data-animate-pct="${homePct}">0%</span>
          <span class="results-name">${home.short}</span>
          <img src="${home.logo}" alt="">
        </div>
      </div>
      <div class="results-bar">
        <div class="results-fill away" data-animate-width="${awayPct}" style="width:0%; background:${away.color};"></div>
        <div class="results-fill home" data-animate-width="${homePct}" style="width:0%; background:${home.color};"></div>
      </div>
      <div class="vote-summary${pickedTeam ? "" : " no-pick"}">
        ${pickedTeam ? `<span class="vote-pick">Your pick: <strong>${pickedTeam.name}</strong></span>` : ""}
        <span class="vote-count">${total.toLocaleString()} votes${locked ? " · voting closed" : ""}</span>
      </div>
    </div>`;
}

/* Animates every results bar / percentage number under `scope` from 0 to
   its target value. Call once after inserting new results markup —
   render call sites and handleVoteClick both do this. */
function animateVoteUI(scope) {
  scope.querySelectorAll("[data-animate-width]").forEach((el) => {
    const target = parseFloat(el.dataset.animateWidth);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = `${target}%`; }));
  });
  scope.querySelectorAll("[data-animate-pct]").forEach((el) => {
    const target = parseInt(el.dataset.animatePct, 10);
    const duration = 500;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = `${Math.round(target * t)}%`;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
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
      : ""; /* final: the status pill already carries the state */
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
  switch (game.status) {
    case "scheduled":
    case "postponed":
      return calendarButton(game);
    case "cancelled":
      return "";
    default:
      return viewGameButton(game);
  }
}

/* Away reads name-then-logo, home reads logo-then-name — both team
   blocks pack toward the centre column (see .sc-team.away/.home), so
   the logo nearest the score/time reads first on each side, pulling
   the whole row into one matchup rather than two edge-pinned labels. */
function teamSide(abbr, side, winner) {
  const t = getTeam(abbr);
  const loser = winner && winner !== side ? "loser" : "";
  const logo = `<img src="${t.logo}" alt="${t.name}">`;
  const name = `<span class="sc-team-name">${t.short}</span>`;
  return `<div class="sc-team ${side} ${loser}">${side === "home" ? logo + name : name + logo}</div>`;
}

/* The featured card when the featured game is live — the original
   featured-card shell (sc-vote-results / sc-bottom, same as the
   scheduled-game card) with just the matchup row swapped for the
   compact centred composition (logo/name/score/quarter) instead of the
   edge-pinned sc-main layout. Voting always reads as closed here — a
   game already underway isn't "make your pick" material, showcase mode
   or not — so resultsBar() always renders, never the vote panel. */
function renderLiveFeaturedCard(game, i = 0) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  const awayWin = game.winner === "away", homeWin = game.winner === "home";
  const place = [game.venue, game.city].filter(Boolean).join(" · ");
  const watchBtn = `<a class="btn btn-secondary" href="game.html?id=${game.id}">Watch Game Live${broadcastLogoOnly(game.broadcast)}</a>`;
  const banner = bannerHtml(game);
  const card = `
  <div class="schedule-card status-live" data-game-id="${game.id}" style="--stagger:${i};">
    <div class="sc-live-matchup">
      <div class="sc-live-row">
        <div class="sc-live-team away">
          <img class="sc-live-logo" src="${away.logo}" alt="${away.name}">
          <span class="sc-live-team-name">${away.short}</span>
        </div>
        <div class="sc-live-center">
          <div class="sc-live-score"><span class="${awayWin ? "win" : ""}">${game.away.score}</span><span class="sc-live-sep">–</span><span class="${homeWin ? "win" : ""}">${game.home.score}</span></div>
        </div>
        <div class="sc-live-team home">
          <span class="sc-live-team-name">${home.short}</span>
          <img class="sc-live-logo" src="${home.logo}" alt="${home.name}">
        </div>
      </div>
      <div class="sc-live-clock">${quarterLabel(game.statusDetail)}</div>
    </div>
    ${resultsBar(game)}
    <div class="sc-bottom">
      <span class="sc-meta">${place}</span>
      <div class="sc-actions">${watchBtn}</div>
    </div>
  </div>`;
  return banner ? `<div class="schedule-card-group">${banner}${card}</div>` : card;
}

/* `i` is the card's position within its date group — used only to
   stagger the entrance animation (see --stagger in CSS). Only the
   single next upcoming game (season-wide) renders as the full featured
   card; every other game renders as a compact row (renderCompactRow) —
   a different, denser layout, not just a scaled-down copy. */
function renderScheduleCard(game, i = 0, featured = false) {
  if (!featured) return renderCompactRow(game, i);
  if (game.status === "live") return renderLiveFeaturedCard(game, i);
  /* SHOWCASE MODE: voting stays open regardless of kickoff/game state —
     every card shows the vote options by default, and switches to
     results only once *this browser* has actually voted on it. Revert
     to the commented lines to restore normal lock-after-kickoff
     behavior (results shown for any locked/decided game, voted or not). */
  const userVote = getUserVote(game.id);
  const canVote = game.status !== "cancelled" && !userVote;
  const showResults = game.status !== "cancelled" && !!userVote;
  // const locked = isVotingLocked(game);
  // const canVote = game.status === "scheduled" && !locked && !userVote;
  // const showResults = game.status !== "cancelled" && (game.status !== "scheduled" || locked || !!userVote);
  const actions = cardActions(game);
  const place = [game.venue, game.city].filter(Boolean).join(" · ");
  const banner = bannerHtml(game);
  const card = `
  <div class="schedule-card status-${game.status}" data-game-id="${game.id}" style="--stagger:${i};">
    <div class="sc-main">
      ${teamSide(game.away.abbr, "away", game.winner)}
      <div class="sc-center">${cardCentre(game)}</div>
      ${teamSide(game.home.abbr, "home", game.winner)}
    </div>
    <div class="vote-module">${canVote ? votingPanel(game) : showResults ? resultsBar(game) : ""}</div>
    <div class="sc-bottom">
      <span class="sc-meta">${place}${broadcastHtml(game.broadcast)}</span>
      ${actions ? `<div class="sc-actions">${actions}</div>` : ""}
    </div>
  </div>`;
  return banner ? `<div class="schedule-card-group">${banner}${card}</div>` : card;
}

/* --- Compact row (every game except the single featured one) -------
   Left: kickoff time/score + broadcaster. Middle: the matchup, away
   team stacked over home team, left-aligned (not centred — this is a
   scanning list, not a single hero matchup). Right: voting or results,
   then the calendar/view action. Team name/time share the featured
   card's own type sizes (--fs-team/--fs-time) rather than a smaller
   compact-only scale. */
function compactTimeOrScore(game) {
  const scored = SCORED.includes(game.status) && game.away.score !== undefined;
  if (scored) {
    const note = game.status === "live" ? game.statusDetail
      : game.status === "final-pending" ? "Final pending"
      : game.status === "delayed" ? game.statusDetail : "";
    return `<span class="cc-clock">${game.away.score}–${game.home.score}</span>${note ? `<span class="cc-note">${note}</span>` : ""}`;
  }
  if (game.status === "postponed") return `<span class="cc-clock muted">Postponed</span>`;
  if (game.status === "cancelled") return `<span class="cc-clock muted">Cancelled</span>`;
  return `<span class="cc-clock">${kickoffTimeET(game.scheduledAt)}</span>`;
}

function compactTeamRow(abbr, winner, side) {
  const t = getTeam(abbr);
  const market = t.name.replace(t.short, "").trim();
  const loser = winner && winner !== side ? "loser" : "";
  return `
    <div class="cc-team ${loser}">
      <img src="${t.logo}" alt="">
      <span class="cc-market">${market}</span>
      <span class="cc-nick">${t.short}</span>
    </div>`;
}

/* A compact "who wins" choice — the whole side is clickable, same
   handleVoteClick as the featured card's vote-option, just laid out as
   one slim bordered pill instead of a tall two-box grid. */
function compactVoteChoice(game) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  return `
    <div class="cc-vote">
      <div class="cc-vote-choice">
        <button type="button" class="cc-vote-side" data-side="away" onclick="handleVoteClick('${game.id}','away')"><img src="${away.logo}" alt="">${away.short}</button>
        <span class="cc-vote-sep">vs</span>
        <button type="button" class="cc-vote-side" data-side="home" onclick="handleVoteClick('${game.id}','home')">${home.short}<img src="${home.logo}" alt=""></button>
      </div>
    </div>`;
}

function compactResults(game) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  const { homePct, awayPct } = getVotePercentages(game);
  return `
    <div class="cc-results">
      <div class="cc-results-labels"><span>${away.short} <strong data-animate-pct="${awayPct}">0%</strong></span><span><strong data-animate-pct="${homePct}">0%</strong> ${home.short}</span></div>
      <div class="cc-results-bar">
        <div class="cc-results-fill" data-animate-width="${awayPct}" style="width:0%; background:${away.color};"></div>
        <div class="cc-results-fill" data-animate-width="${homePct}" style="width:0%; background:${home.color};"></div>
      </div>
    </div>`;
}

function renderCompactRow(game, i = 0) {
  /* SHOWCASE MODE — see the matching note in renderScheduleCard(). */
  const userVote = getUserVote(game.id);
  const canVote = game.status !== "cancelled" && !userVote;
  const showVote = game.status !== "cancelled" && !!userVote;
  // const locked = isVotingLocked(game);
  // const canVote = game.status === "scheduled" && !locked && !userVote;
  // const showVote = game.status !== "cancelled" && (game.status !== "scheduled" || locked || !!userVote);
  const actions = cardActions(game);
  const banner = bannerHtml(game);
  const row = `
  <div class="cc-row status-${game.status}" data-game-id="${game.id}" style="--stagger:${i};">
    <div class="cc-time">
      ${compactTimeOrScore(game)}
      ${broadcastHtml(game.broadcast)}
    </div>
    <div class="cc-matchup">
      ${compactTeamRow(game.away.abbr, game.winner, "away")}
      ${compactTeamRow(game.home.abbr, game.winner, "home")}
    </div>
    <div class="cc-vote-slot vote-module">${canVote ? compactVoteChoice(game) : showVote ? compactResults(game) : ""}</div>
    ${actions ? `<div class="cc-action">${actions}</div>` : ""}
  </div>`;
  return banner ? `<div class="schedule-card-group">${banner}${row}</div>` : row;
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
  const results = game.status === "cancelled" ? "" : resultsBar(game);
  switch (game.status) {
    case "scheduled":
      return `
        <div class="card-bottom"><span>${kickoffTimeET(game.scheduledAt)}${kickoffTimeLocalNote(game.scheduledAt) ? ` · ${kickoffTimeLocalNote(game.scheduledAt)}` : ""}</span><span>${broadcastHtml(game.broadcast) || "TV TBD"}</span></div>
        ${canVote ? votingPanel(game) : results}
        <div class="sc-actions" style="margin-top:12px;">${calendarButton(game)}</div>`;
    case "live":
    case "delayed":
      return `
        <div class="card-bottom"><span class="situation">${game.statusDetail}</span><span>${broadcastHtml(game.broadcast)}</span></div>
        ${results}`;
    case "final-pending":
      return `
        <div class="card-bottom"><span class="situation">Final Pending</span><span>${broadcastHtml(game.broadcast)}</span></div>
        ${results}`;
    case "final":
      return `
        <div class="card-bottom"><span>${broadcastHtml(game.broadcast)}</span></div>
        ${results}${predictionHtml(game)}`;
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

/* Disables a card's vote buttons the instant a pick is clicked, so a
   second click can't slip in during the animation. */
function lockVoteButtons(cardEl) {
  cardEl.querySelectorAll(".vote-option, .cc-vote-side").forEach((btn) => {
    btn.disabled = true;
    btn.style.pointerEvents = "none";
  });
}

/* The broadcast-style "sweep in → VOTED FOR {team} → hold → sweep
   out" confirmation. Takes over the whole `cardEl` (.schedule-card or
   .cc-row); `slot` is the .vote-module inside it, where the real
   results markup gets swapped in immediately, hidden behind the
   opaque animation layer covering the card — the swap itself never
   paints; the closing wipe's clip-path is what "reveals" the card
   again. Height is pinned for the sequence's duration so nothing
   below the card on the page shifts. `prefers-reduced-motion` gets a
   plain 180ms cross-fade instead. */
function playVoteConfirmAnimation(cardEl, slot, resultsHtml, team) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prevOverflow = cardEl.style.overflow;
  cardEl.style.height = `${cardEl.getBoundingClientRect().height}px`;
  cardEl.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.className = cardEl.classList.contains("schedule-card") ? "vote-anim-layer is-featured" : "vote-anim-layer";
  overlay.style.setProperty("--team-color", team.color);
  cardEl.appendChild(overlay);

  // Swap the vote/results slot's content to the results markup now —
  // from this point the whole card is hidden behind the opaque
  // overlay above it, so the swap itself never paints.
  Array.from(slot.children).forEach((child) => child.remove());
  const wrap = document.createElement("div");
  wrap.innerHTML = resultsHtml;
  while (wrap.firstChild) slot.appendChild(wrap.firstChild);
  requestAnimationFrame(() => { cardEl.style.height = `${cardEl.scrollHeight}px`; });

  const finish = () => {
    overlay.remove();
    cardEl.style.height = "";
    cardEl.style.overflow = prevOverflow;
    animateVoteUI(cardEl);
  };

  if (reduced) {
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("wipe")));
    overlay.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 400); // fallback if the transition doesn't fire
    return;
  }

  overlay.innerHTML = `
    <div class="vote-anim-line" style="top:36%; width:52%; animation-delay:0ms;"></div>
    <div class="vote-anim-line" style="top:52%; width:38%; animation-delay:55ms;"></div>
    <div class="vote-anim-line" style="top:66%; width:46%; animation-delay:105ms;"></div>
    <div class="vote-anim-content">
      <span class="vote-anim-label">Voted for</span>
      <div class="vote-anim-team">
        <img class="vote-anim-logo" src="${team.logo}" alt="">
        <span class="vote-anim-name">${team.short}</span>
      </div>
    </div>
    <div class="vote-anim-wipe-line"></div>`;
  requestAnimationFrame(() => overlay.querySelectorAll(".vote-anim-line").forEach((l) => l.classList.add("play")));
  setTimeout(() => overlay.querySelector(".vote-anim-label").classList.add("in"), 220);
  setTimeout(() => overlay.querySelector(".vote-anim-team").classList.add("in"), 300);
  setTimeout(() => {
    overlay.classList.add("wipe");
    overlay.querySelector(".vote-anim-wipe-line").classList.add("play");
    overlay.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 560); // fallback if the transition doesn't fire
  }, 1520);
}

/* Re-render whichever shape this game is currently drawn as. Voting has
   a two-step feel: an immediate press/checkmark on the option just
   clicked, then — after a beat — the card swaps to the results view.
   The vote itself commits (and locks) only at that second step. */
function handleVoteClick(gameId, side) {
  const game = getGameById(gameId);
  // SHOWCASE MODE — voting stays open regardless of lock state; see castVote().
  if (!game || game.status === "cancelled" || getUserVote(gameId)) return;
  document.querySelectorAll(`[data-game-id="${gameId}"]`).forEach((cardEl) => {
    lockVoteButtons(cardEl);
    cardEl.querySelectorAll(".vote-option, .cc-vote-side").forEach((opt) => {
      const picked = opt.dataset.side === side;
      opt.classList.toggle("selected", picked);
      opt.classList.toggle("unselected", !picked);
      const indicator = opt.querySelector(".vote-indicator");
      if (picked && indicator) indicator.innerHTML = CHECK_ICON;
    });
  });
  setTimeout(() => {
    if (!castVote(gameId, side)) return;
    const updated = getGameById(gameId);
    const pickedTeam = getTeam(side === "home" ? updated.home.abbr : updated.away.abbr);
    document.querySelectorAll(`[data-game-id="${gameId}"]`).forEach((el) => {
      // Featured/compact cards carry a .vote-module — the animation
      // covers the whole card, but only the vote/results slot's
      // content actually changes (team names, score, banner, venue,
      // actions never re-render).
      const slot = el.querySelector(".vote-module");
      if (slot) {
        const resultsHtml = el.classList.contains("cc-row") ? compactResults(updated) : resultsBar(updated);
        playVoteConfirmAnimation(el, slot, resultsHtml, pickedTeam);
        return;
      }
      // Other shapes (Full Season rows, the legacy article-embed card)
      // have no vote-module to animate in place — full re-render as before.
      el.outerHTML = el.classList.contains("schedule-row") ? renderScheduleRow(updated) : renderGameCard(updated);
    });
    animateVoteUI(document);
  }, 260);
}
