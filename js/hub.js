/* Schedule Hub — Week View + Full Season (final change doc §3, §7, §8).

   Week navigation is symmetrical: the arrows always move the selected
   week by one, and the surrounding-weeks strip follows the selection
   (desktop). On mobile the strip collapses to just the current week via
   CSS, which leaves exactly previous / current / next.

   Deep-links from the newsletter CTA arrive as ?week=N (stands in for
   /nfl/schedule/week/N until this is server-routed). */

const WEEKS_VISIBLE = 5;

let currentView = "week"; // "week" | "season"
let currentWeek = getCurrentOrNextWeek();
let currentTeamFilter = "";

function weekDateRange(week, short = false) {
  const dates = getGamesForWeek(week).map((g) => new Date(g.scheduledAt));
  const min = new Date(Math.min(...dates)), max = new Date(Math.max(...dates));
  if (!short) {
    const fmt = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return `${fmt(min)} – ${fmt(max)}`;
  }
  /* Short form for the week tabs. The month rides the end date so the
     range never reads as an open-ended "11 SEPT - 17"; when the week
     straddles two months both are named. */
  const mon = (d) => d.toLocaleDateString(undefined, { month: "short" }).toUpperCase();
  return mon(min) === mon(max)
    ? `${min.getDate()} - ${max.getDate()} ${mon(max)}`
    : `${min.getDate()} ${mon(min)} - ${max.getDate()} ${mon(max)}`;
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
    render();
  });
}

/* The visible window keeps the selected week centred where possible, so
   prev/next always reads symmetrically. */
function visibleWeeks() {
  const half = Math.floor(WEEKS_VISIBLE / 2);
  const start = Math.max(1, Math.min(currentWeek - half, 18 - (WEEKS_VISIBLE - 1)));
  return Array.from({ length: WEEKS_VISIBLE }, (_, i) => start + i);
}

function renderWeekNav() {
  const strip = document.getElementById("weekStrip");
  strip.innerHTML = visibleWeeks().map((w) => `
    <button class="week-tab ${w === currentWeek ? "active" : ""}" data-week="${w}" aria-current="${w === currentWeek}">
      <span class="wt-num">Week ${w}</span>
      <span class="wt-range">${weekDateRange(w, true)}</span>
    </button>
  `).join("");
  strip.querySelectorAll(".week-tab").forEach((tab) => {
    tab.addEventListener("click", () => goToWeek(Number(tab.dataset.week), "strip"));
  });
  document.getElementById("weekPrev").disabled = currentWeek <= 1;
  document.getElementById("weekNext").disabled = currentWeek >= 18;
}

function goToWeek(week, method) {
  const next = Math.min(18, Math.max(1, week));
  if (next === currentWeek) return;
  currentWeek = next;
  track("week_or_filter_changed", { to: currentWeek, method });
  renderWeekNav();
  renderWeekView();
}

/* Cards carry their own day/date (§6), so Week View doesn't repeat it in
   a group heading — the games are simply listed in kickoff order. */
function renderWeekView() {
  const games = applyTeamFilter(getGamesForWeek(currentWeek))
    .slice()
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  const root = document.getElementById("scheduleRoot");
  if (!games.length) {
    root.innerHTML = `<div class="empty-state"><strong>No games this week</strong>${getTeam(currentTeamFilter).name} isn't scheduled in Week ${currentWeek}.</div>`;
    return;
  }
  root.innerHTML = `<div class="schedule-list">${games.map(renderScheduleCard).join("")}</div>`;
}

/* Full Season prioritises scanning: grouped by week, compact rows (§8) */
function renderFullSeason() {
  const root = document.getElementById("scheduleRoot");
  const groups = getWeeks().map((w) => {
    const games = applyTeamFilter(getGamesForWeek(w));
    if (!games.length) return "";
    return `
      <div class="week-group">
        <div class="week-heading">Week ${w} <span class="wh-range">${weekDateRange(w)}</span></div>
        <div class="season-rows">
          <div class="season-head"><span>Date</span><span>Matchup</span><span>Time</span><span>Status</span><span></span></div>
          ${games.map(renderScheduleRow).join("")}
        </div>
      </div>`;
  }).join("");
  root.innerHTML = groups ||
    `<div class="empty-state"><strong>No games</strong>${getTeam(currentTeamFilter).name} has no games this season.</div>`;
}

function render() {
  if (currentView === "week") renderWeekView();
  else renderFullSeason();
}

function setView(view) {
  currentView = view;
  document.querySelectorAll(".view-toggle button").forEach((b) => {
    const on = b.dataset.view === view;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
  });
  document.getElementById("weekNav").hidden = view !== "week";
  if (view === "week") { renderWeekNav(); renderWeekView(); }
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
  document.getElementById("weekPrev").addEventListener("click", () => goToWeek(currentWeek - 1, "prev"));
  document.getElementById("weekNext").addEventListener("click", () => goToWeek(currentWeek + 1, "next"));
  document.querySelectorAll(".view-toggle button").forEach((b) => {
    b.addEventListener("click", () => setView(b.dataset.view));
  });
  setView("week");
});
