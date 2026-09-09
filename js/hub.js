/* Schedule Hub — Week View + Full Season (PRD §5), plus a team filter and
   a flat, borderless multi-week strip (six weeks visible at once, arrows
   page the window, tapping a week selects it — no boxes/pills around the
   tabs). Deep-links from the newsletter CTA arrive as ?week=N (stands in
   for /nfl/schedule/week/N until this is server-routed) and open straight
   to that week. */

let currentView = "week"; // "week" | "season"
let currentWeek = getCurrentOrNextWeek();
let currentTeamFilter = "";
let stripStart = Math.max(1, Math.min(currentWeek, 18 - 5)); // first week shown in the 6-wide strip

function weekDateRange(week, short = false) {
  const games = getGamesForWeek(week);
  const dates = games.map((g) => new Date(g.scheduledAt));
  const min = new Date(Math.min(...dates)), max = new Date(Math.max(...dates));
  if (!short) {
    const fmt = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return `${fmt(min)} – ${fmt(max)}`;
  }
  const month = min.toLocaleDateString(undefined, { month: "short" }).toUpperCase();
  return `${min.getDate()} ${month} - ${max.getDate()}`;
}

function applyTeamFilter(games) {
  if (!currentTeamFilter) return games;
  return games.filter((g) => g.away.abbr === currentTeamFilter || g.home.abbr === currentTeamFilter);
}

function populateTeamFilter() {
  const sel = document.getElementById("teamFilterSelect");
  const options = Object.keys(TEAMS).sort((a, b) => TEAMS[a].name.localeCompare(TEAMS[b].name));
  sel.innerHTML = `<option value="">Team Schedules</option>` +
    options.map((abbr) => `<option value="${abbr}">${TEAMS[abbr].name}</option>`).join("");
  sel.addEventListener("change", () => {
    currentTeamFilter = sel.value;
    track("week_or_filter_changed", { to: currentTeamFilter || "all", method: "team_select" });
    currentView === "week" ? renderWeekView() : renderFullSeason();
  });
}

/* Renders exactly 6 tabs (stripStart..stripStart+5), flat text only — no
   border/background on the tabs themselves. The flanking arrows page
   this window; clicking a tab selects it without moving the window. */
function renderWeekStrip() {
  const strip = document.getElementById("weekStrip");
  const weeks = Array.from({ length: 6 }, (_, i) => stripStart + i);
  strip.innerHTML = weeks.map((w) => `
    <button class="week-tab ${w === currentWeek ? "active" : ""}" data-week="${w}">
      <span class="wt-num">Week ${w}</span>
      <span class="wt-range">${weekDateRange(w, true)}</span>
    </button>
  `).join("");
  strip.querySelectorAll(".week-tab").forEach((tab) => {
    tab.addEventListener("click", () => selectWeek(Number(tab.dataset.week), "strip"));
  });
}

function selectWeek(week, method) {
  currentWeek = Math.min(18, Math.max(1, week));
  track("week_or_filter_changed", { to: currentWeek, method });
  renderWeekStrip();
  renderWeekView();
}

/* Like selectWeek, but also recenters the strip window — for jumps that
   can land far outside the currently visible 6 weeks (deep link, Full
   Season row). */
function jumpToWeek(week, method) {
  currentWeek = Math.min(18, Math.max(1, week));
  stripStart = Math.max(1, Math.min(currentWeek, 18 - 5));
  track("week_or_filter_changed", { to: currentWeek, method });
  renderWeekStrip();
  renderWeekView();
}

function stepStrip(delta) {
  stripStart = Math.max(1, Math.min(stripStart + delta, 18 - 5));
  renderWeekStrip();
}

function groupByDate(games) {
  const byDate = {};
  games.forEach((g) => { (byDate[g.dateLabel] ||= []).push(g); });
  return byDate;
}

function renderWeekView() {
  const games = applyTeamFilter(getGamesForWeek(currentWeek));
  const root = document.getElementById("scheduleRoot");
  if (!games.length) {
    root.innerHTML = `<div class="empty-state"><strong>No games</strong>${getTeam(currentTeamFilter).name} isn't scheduled this week.</div>`;
    return;
  }
  const byDate = groupByDate(games);
  root.innerHTML = Object.entries(byDate).map(([date, gs]) => `
    <div class="week-group">
      <div class="date-heading">${date}</div>
      <div class="row-header"><span>Matchup</span><span>Status</span><span>Location</span><span>Vote / Calendar</span></div>
      <div class="game-row-list">${gs.map(renderGameRow).join("")}</div>
    </div>
  `).join("");
}

/* Full Season is a plain list of weeks — not a grid of every card — so
   it stays scannable at a glance. Selecting a row jumps into Week View. */
function renderFullSeason() {
  const rows = getWeeks().map((w) => {
    const games = applyTeamFilter(getGamesForWeek(w));
    if (!games.length) return "";
    return `
      <button class="week-list-row" data-week="${w}">
        <span class="wl-left"><span class="wl-num">Week ${w}</span><span class="wl-range">${weekDateRange(w)}</span></span>
        <span class="wl-count">${games.length} game${games.length === 1 ? "" : "s"}</span>
      </button>`;
  }).join("");
  document.getElementById("scheduleRoot").innerHTML = `<div class="week-list">${rows}</div>`;
  document.querySelectorAll(".week-list-row").forEach((row) => {
    row.addEventListener("click", () => {
      jumpToWeek(Number(row.dataset.week), "full_season_row");
      setView("week");
    });
  });
}

function setView(view) {
  currentView = view;
  document.querySelectorAll(".view-toggle button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  document.getElementById("weekNav").hidden = view !== "week";
  if (view === "week") { renderWeekStrip(); renderWeekView(); }
  else { renderFullSeason(); track("full_schedule_viewed", {}); }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const deepLinkWeek = Number(params.get("week"));
  if (deepLinkWeek >= 1 && deepLinkWeek <= 18) {
    currentWeek = deepLinkWeek;
    stripStart = Math.max(1, Math.min(currentWeek, 18 - 5));
    track("newsletter_cta_landed", { week: deepLinkWeek, source: getTrafficSource() });
  }
  track("schedule_hub_visited", { week: currentWeek });

  populateTeamFilter();
  document.getElementById("weekPrev").addEventListener("click", () => stepStrip(-1));
  document.getElementById("weekNext").addEventListener("click", () => stepStrip(1));
  document.querySelectorAll(".view-toggle button").forEach((b) => {
    b.addEventListener("click", () => setView(b.dataset.view));
  });
  setView("week");
});
