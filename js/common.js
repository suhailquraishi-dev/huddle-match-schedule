/* Add to Schedule chooser, shared across pages (PRD §9) */

/* Navbar mega-menus open on hover (mouseenter/mouseleave don't bubble,
   so a nested <details> — e.g. NFL inside Sports — opens independently
   without closing its parent), and still toggle on click/tap. */
function wireNavDropdowns() {
  document.querySelectorAll(".nav-dropdown, .nav-subdetails").forEach((d) => {
    d.addEventListener("mouseenter", () => { d.open = true; });
    d.addEventListener("mouseleave", () => { d.open = false; });
  });
}
document.addEventListener("DOMContentLoaded", wireNavDropdowns);

/* Mobile hamburger toggle (PRD §14 — Mobile-first UI) */
function wireNavToggle() {
  const toggle = document.getElementById("navToggle");
  const menu = document.querySelector(".navbar-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}
document.addEventListener("DOMContentLoaded", wireNavToggle);

/* --- Add to Calendar (.ics / Google Calendar / copy link) — PRD §8 --- */
let pendingGame = null;

function openScheduleModal(game) {
  pendingGame = game;
  track("calendar_cta_clicked", { game_id: game.id, game_state: game.status });
  document.getElementById("scheduleModal").classList.add("open");
}
function closeScheduleModal() {
  document.getElementById("scheduleModal").classList.remove("open");
  pendingGame = null;
}

function icsDate(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildEventPayload(game) {
  const away = getTeam(game.away.abbr), home = getTeam(game.home.abbr);
  const start = new Date(game.scheduledAt);
  const end = new Date(start.getTime() + (3 * 60 + 30) * 60000);
  return {
    title: `${away.abbr.toUpperCase()} @ ${home.abbr.toUpperCase()}`,
    start, end,
    location: `${game.venue}, ${game.city}`,
    description: `${away.name} at ${home.name}. Broadcast: ${game.broadcast || "TBD"}. essentiallysports.com/nfl/schedule/game/${game.id}`,
    uid: `${game.id}@huddle.essentiallysports.com`,
  };
}

function downloadIcs(game) {
  const ev = buildEventPayload(game);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//EssentiallySports//Huddle Match Schedule//EN",
    "BEGIN:VEVENT",
    `UID:${ev.uid}`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(ev.start.toISOString())}`,
    `DTEND:${icsDate(ev.end.toISOString())}`,
    `SUMMARY:${ev.title}`,
    `LOCATION:${ev.location}`,
    `DESCRIPTION:${ev.description}`,
    "STATUS:CONFIRMED",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${game.id}.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function openGoogleCalendar(game) {
  const ev = buildEventPayload(game);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", ev.title);
  url.searchParams.set("dates", `${fmt(ev.start)}/${fmt(ev.end)}`);
  url.searchParams.set("location", ev.location);
  url.searchParams.set("details", ev.description);
  window.open(url.toString(), "_blank", "noopener");
}

function copyEventLink(game) {
  const link = `https://essentiallysports.com/nfl/schedule/game/${game.id}`;
  navigator.clipboard?.writeText(link).catch(() => {});
  alert(`Copied: ${link}`);
}

/* Choosing a provider confirms success on the card itself — the button
   flips to "Added to Calendar" and stays that way (change doc §9). */
function completeCalendarAdd(provider, action) {
  if (!pendingGame) return;
  const game = pendingGame;
  track("calendar_provider_selected", { game_id: game.id, provider });
  action(game);
  if (typeof markOnCalendar === "function") markOnCalendar(game.id);
  closeScheduleModal();
}

function wireScheduleModal() {
  document.getElementById("optGoogle")?.addEventListener("click", () => completeCalendarAdd("google", openGoogleCalendar));
  document.getElementById("optIcs")?.addEventListener("click", () => completeCalendarAdd("ics", downloadIcs));
  document.getElementById("optCopy")?.addEventListener("click", () => completeCalendarAdd("copy_link", copyEventLink));
  document.getElementById("scheduleModal")?.addEventListener("click", (e) => {
    if (e.target.id === "scheduleModal") closeScheduleModal();
  });
}
document.addEventListener("DOMContentLoaded", wireScheduleModal);
