/* Schedule Hub — Week View + Full Season (PRD §5), plus a team filter.
   Redesigned for a 50+ audience: a single big "Week N" stepper instead of
   a multi-tile carousel, and a plain scannable week list instead of a
   288-card Full Season grid. Deep-links from the newsletter CTA arrive
   as ?week=N (stands in for /nfl/schedule/week/N until this is
   server-routed) and open straight to that week. */

let currentView = "week"; // "week" | "season"
let currentWeek = getCurrentOrNextWeek();
let currentTeamFilter = "";

function weekDateRange(week) {
  const games = getGamesForWeek(week);
  const dates = games.map((g) => new Date(g.scheduledAt));
  const min = new Date(Math.min(...dates)), max = new Date(Math.max(...dates));
  const fmt = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(min)} – ${fmt(max)}`;
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

function renderWeekStepper() {
  document.getElementById("weekLabelNum").textContent = `Week ${currentWeek}`;
  document.getElementById("weekLabelRange").textContent = weekDateRange(currentWeek);
  const jump = document.getElementById("weekJumpSelect");
  if (!jump.options.length) {
    jump.innerHTML = getWeeks().map((w) => `<option value="${w}">Jump to Week ${w}</option>`).join("");
  }
  jump.value = String(currentWeek);
}

function goToWeek(week, method) {
  currentWeek = Math.min(18, Math.max(1, week));
  track("week_or_filter_changed", { to: currentWeek, method });
  renderWeekStepper();
  renderWeekView();
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
      <div class="game-grid">${gs.map(renderGameCard).join("")}</div>
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
      goToWeek(Number(row.dataset.week), "full_season_row");
      setView("week");
    });
  });
}

function setView(view) {
  currentView = view;
  document.querySelectorAll(".view-toggle button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  document.getElementById("weekNav").hidden = view !== "week";
  if (view === "week") { renderWeekStepper(); renderWeekView(); }
  else { renderFullSeason(); track("full_schedule_viewed", {}); }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const deepLinkWeek = Number(params.get("week"));
  if (deepLinkWeek >= 1 && deepLinkWeek <= 18) {
    currentWeek = deepLinkWeek;
    track("newsletter_cta_landed", { week: deepLinkWeek, source: getTrafficSource() });
  }
  track("schedule_hub_visited", { week: currentWeek });

  populateTeamFilter();
  document.getElementById("weekPrev").addEventListener("click", () => goToWeek(currentWeek - 1, "step"));
  document.getElementById("weekNext").addEventListener("click", () => goToWeek(currentWeek + 1, "step"));
  document.getElementById("weekJumpSelect").addEventListener("change", (e) => goToWeek(Number(e.target.value), "jump_select"));
  document.querySelectorAll(".view-toggle button").forEach((b) => {
    b.addEventListener("click", () => setView(b.dataset.view));
  });
  setView("week");
});
