/* Canonical schedule data for the NFL Schedule Hub (PRD "2026 NFL Schedule
   Hub — V1"). Week 1 uses real matchups/venues pulled from ESPN's NFL
   schedule (espn.in/nfl/schedule); weeks 2-18 are deterministically
   generated placeholders (real stadiums, plausible slots) standing in for
   the licensed schedule feed described in §11 until a real API is wired
   up. Game IDs follow the PRD's own convention: {away}-{home}-2026-w{week}.
   Team logos: assets/team-logos/{abbr}.png (ESPN CDN, downloaded locally). */

/* `color` is each team's primary brand color, reused from the exact
   values already sourced for the Sports-nav team pills (essentiallysports.com
   NFL flyout) — one source of truth for team color across the app. */
const TEAMS = {
  ari: { name: "Arizona Cardinals",      short: "Cardinals",  color: "#8E223D" },
  atl: { name: "Atlanta Falcons",        short: "Falcons",    color: "#BC1E23" },
  bal: { name: "Baltimore Ravens",       short: "Ravens",     color: "#BC930E" },
  buf: { name: "Buffalo Bills",          short: "Bills",      color: "#032982" },
  car: { name: "Carolina Panthers",      short: "Panthers",   color: "#070D14" },
  chi: { name: "Chicago Bears",          short: "Bears",      color: "#0B162A" },
  cin: { name: "Cincinnati Bengals",     short: "Bengals",    color: "#000000" },
  cle: { name: "Cleveland Browns",       short: "Browns",     color: "#FF470F" },
  dal: { name: "Dallas Cowboys",         short: "Cowboys",    color: "#002A5B" },
  den: { name: "Denver Broncos",         short: "Broncos",    color: "#FA5E2A" },
  det: { name: "Detroit Lions",          short: "Lions",      color: "#006FAB" },
  gb:  { name: "Green Bay Packers",      short: "Packers",    color: "#FCBE15" },
  hou: { name: "Houston Texans",         short: "Texans",     color: "#F20028" },
  ind: { name: "Indianapolis Colts",     short: "Colts",      color: "#CCD1D1" },
  jax: { name: "Jacksonville Jaguars",   short: "Jaguars",    color: "#006778" },
  kc:  { name: "Kansas City Chiefs",     short: "Chiefs",     color: "#FFC20E" },
  lv:  { name: "Las Vegas Raiders",      short: "Raiders",    color: "#000000" },
  lac: { name: "Los Angeles Chargers",   short: "Chargers",   color: "#007CC3" },
  lar: { name: "Los Angeles Rams",       short: "Rams",       color: "#FDCF00" },
  mia: { name: "Miami Dolphins",         short: "Dolphins",   color: "#00C8D7" },
  min: { name: "Minnesota Vikings",      short: "Vikings",    color: "#FFC62F" },
  ne:  { name: "New England Patriots",   short: "Patriots",   color: "#013569" },
  no:  { name: "New Orleans Saints",     short: "Saints",     color: "#D1BA8B" },
  nyg: { name: "New York Giants",        short: "Giants",     color: "#A71930" },
  nyj: { name: "New York Jets",          short: "Jets",       color: "#115740" },
  phi: { name: "Philadelphia Eagles",    short: "Eagles",     color: "#241D1F" },
  pit: { name: "Pittsburgh Steelers",    short: "Steelers",   color: "#A5ACAF" },
  sf:  { name: "San Francisco 49ers",    short: "49ers",      color: "#930000" },
  sea: { name: "Seattle Seahawks",       short: "Seahawks",   color: "#69BE28" },
  tb:  { name: "Tampa Bay Buccaneers",   short: "Buccaneers", color: "#000000" },
  ten: { name: "Tennessee Titans",       short: "Titans",     color: "#579AD1" },
  wsh: { name: "Washington Commanders",  short: "Commanders", color: "#591414" },
};

const STADIUMS = {
  ari: { venue: "State Farm Stadium", city: "Glendale, AZ" },
  atl: { venue: "Mercedes-Benz Stadium", city: "Atlanta, GA" },
  bal: { venue: "M&T Bank Stadium", city: "Baltimore, MD" },
  buf: { venue: "Highmark Stadium", city: "Orchard Park, NY" },
  car: { venue: "Bank of America Stadium", city: "Charlotte, NC" },
  chi: { venue: "Soldier Field", city: "Chicago, IL" },
  cin: { venue: "Paycor Stadium", city: "Cincinnati, OH" },
  cle: { venue: "Huntington Bank Field", city: "Cleveland, OH" },
  dal: { venue: "AT&T Stadium", city: "Arlington, TX" },
  den: { venue: "Empower Field at Mile High", city: "Denver, CO" },
  det: { venue: "Ford Field", city: "Detroit, MI" },
  gb:  { venue: "Lambeau Field", city: "Green Bay, WI" },
  hou: { venue: "NRG Stadium", city: "Houston, TX" },
  ind: { venue: "Lucas Oil Stadium", city: "Indianapolis, IN" },
  jax: { venue: "EverBank Stadium", city: "Jacksonville, FL" },
  kc:  { venue: "Arrowhead Stadium", city: "Kansas City, MO" },
  lv:  { venue: "Allegiant Stadium", city: "Las Vegas, NV" },
  lac: { venue: "SoFi Stadium", city: "Inglewood, CA" },
  lar: { venue: "SoFi Stadium", city: "Inglewood, CA" },
  mia: { venue: "Hard Rock Stadium", city: "Miami Gardens, FL" },
  min: { venue: "U.S. Bank Stadium", city: "Minneapolis, MN" },
  ne:  { venue: "Gillette Stadium", city: "Foxborough, MA" },
  no:  { venue: "Caesars Superdome", city: "New Orleans, LA" },
  nyg: { venue: "MetLife Stadium", city: "East Rutherford, NJ" },
  nyj: { venue: "MetLife Stadium", city: "East Rutherford, NJ" },
  phi: { venue: "Lincoln Financial Field", city: "Philadelphia, PA" },
  pit: { venue: "Acrisure Stadium", city: "Pittsburgh, PA" },
  sf:  { venue: "Levi's Stadium", city: "Santa Clara, CA" },
  sea: { venue: "Lumen Field", city: "Seattle, WA" },
  tb:  { venue: "Raymond James Stadium", city: "Tampa, FL" },
  ten: { venue: "Nissan Stadium", city: "Nashville, TN" },
  wsh: { venue: "Northwest Stadium", city: "Landover, MD" },
};

const WEEK1_GAMES = [
  {
    id: "ne-sea-2026-w1", week: 1, status: "final", statusDetail: "FINAL",
    dateLabel: "Thu, Sep 10", scheduledAt: "2026-09-10T20:20:00-04:00",
    venue: "Lumen Field", city: "Seattle, WA", broadcast: "Prime Video",
    away: { abbr: "ne", score: 17 }, home: { abbr: "sea", score: 24 }, winner: "home",
  },
  {
    id: "sf-lar-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Fri, Sep 11", scheduledAt: "2026-09-11T06:30:00-04:00",
    venue: "Melbourne Cricket Ground", city: "Melbourne, VIC, Australia", broadcast: "NFL Network",
    away: { abbr: "sf" }, home: { abbr: "lar" },
  },
  {
    id: "tb-cin-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T13:00:00-04:00",
    venue: "Paycor Stadium", city: "Cincinnati, OH", broadcast: "CBS",
    away: { abbr: "tb" }, home: { abbr: "cin" },
  },
  {
    id: "no-det-2026-w1", week: 1, status: "final-pending", statusDetail: "Final Pending",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T13:00:00-04:00",
    venue: "Ford Field", city: "Detroit, MI", broadcast: "FOX",
    away: { abbr: "no", score: 16 }, home: { abbr: "det", score: 31 },
  },
  {
    id: "nyj-ten-2026-w1", week: 1, status: "live", statusDetail: "Q3 08:41",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T13:00:00-04:00",
    venue: "Nissan Stadium", city: "Nashville, TN", broadcast: "CBS",
    away: { abbr: "nyj", score: 14 }, home: { abbr: "ten", score: 17 },
  },
  {
    id: "bal-ind-2026-w1", week: 1, status: "live", statusDetail: "HALF",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T13:00:00-04:00",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN", broadcast: "CBS",
    away: { abbr: "bal", score: 10 }, home: { abbr: "ind", score: 13 },
  },
  {
    id: "atl-pit-2026-w1", week: 1, status: "delayed", statusDetail: "Delayed — Weather",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T13:00:00-04:00",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA", broadcast: "FOX",
    away: { abbr: "atl", score: 7 }, home: { abbr: "pit", score: 3 },
  },
  {
    id: "chi-car-2026-w1", week: 1, status: "postponed", statusDetail: "Postponed",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-16T19:00:00-04:00",
    rescheduledFrom: "Sun, Sep 13, 1:00 PM ET",
    venue: "Bank of America Stadium", city: "Charlotte, NC", broadcast: "FOX",
    away: { abbr: "chi" }, home: { abbr: "car" },
  },
  {
    id: "cle-jax-2026-w1", week: 1, status: "cancelled", statusDetail: "Cancelled",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T13:00:00-04:00",
    venue: "EverBank Stadium", city: "Jacksonville, FL", broadcast: "CBS",
    away: { abbr: "cle" }, home: { abbr: "jax" },
  },
  {
    id: "buf-hou-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T13:00:00-04:00",
    venue: "NRG Stadium", city: "Houston, TX", broadcast: "CBS",
    away: { abbr: "buf" }, home: { abbr: "hou" },
  },
  {
    id: "mia-lv-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T16:25:00-04:00",
    venue: "Allegiant Stadium", city: "Las Vegas, NV", broadcast: "CBS",
    away: { abbr: "mia" }, home: { abbr: "lv" },
  },
  {
    id: "gb-min-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T16:25:00-04:00",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN", broadcast: "FOX",
    away: { abbr: "gb" }, home: { abbr: "min" },
  },
  {
    id: "wsh-phi-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T16:25:00-04:00",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA", broadcast: "FOX",
    away: { abbr: "wsh" }, home: { abbr: "phi" },
  },
  {
    id: "ari-lar-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T16:25:00-04:00",
    venue: "SoFi Stadium", city: "Inglewood, CA", broadcast: "CBS",
    away: { abbr: "ari" }, home: { abbr: "lar" },
  },
  {
    id: "dal-nyg-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Sun, Sep 13", scheduledAt: "2026-09-13T20:20:00-04:00",
    venue: "MetLife Stadium", city: "East Rutherford, NJ", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "dal" }, home: { abbr: "nyg" },
  },
  {
    id: "den-kc-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    dateLabel: "Mon, Sep 14", scheduledAt: "2026-09-14T20:15:00-04:00",
    venue: "Arrowhead Stadium", city: "Kansas City, MO", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "den" }, home: { abbr: "kc" },
  },
];

/* Deterministic PRNG (mulberry32) so generated weeks are stable across
   reloads without hand-authoring ~270 placeholder games. */
function seededRandom(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h;
}

const BROADCASTS = ["CBS", "FOX", "NBC", "ESPN", "Prime Video"];
const ABBRS = Object.keys(TEAMS);

function generateWeek(week) {
  const rand = seededRandom(hashSeed(`week-${week}`));
  const shuffled = [...ABBRS].sort(() => rand() - 0.5);
  const thursday = new Date("2026-09-10T00:00:00-04:00");
  thursday.setDate(thursday.getDate() + 7 * (week - 1));
  const sunday = new Date(thursday); sunday.setDate(sunday.getDate() + 3);
  const monday = new Date(sunday); monday.setDate(monday.getDate() + 1);
  const dateLabel = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const games = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    const idx = i / 2;
    const flip = rand() > 0.5;
    const away = flip ? shuffled[i] : shuffled[i + 1];
    const home = flip ? shuffled[i + 1] : shuffled[i];
    let kickoff, dl;
    if (idx === 0) { kickoff = new Date(thursday); kickoff.setHours(20, 20, 0, 0); dl = dateLabel(thursday); }
    else if (idx === 14) { kickoff = new Date(sunday); kickoff.setHours(20, 20, 0, 0); dl = dateLabel(sunday); }
    else if (idx === 15) { kickoff = new Date(monday); kickoff.setHours(20, 15, 0, 0); dl = dateLabel(monday); }
    else if (idx >= 12) { kickoff = new Date(sunday); kickoff.setHours(16, 25, 0, 0); dl = dateLabel(sunday); }
    else { kickoff = new Date(sunday); kickoff.setHours(13, 0, 0, 0); dl = dateLabel(sunday); }
    const stad = STADIUMS[home];
    games.push({
      id: `${away}-${home}-2026-w${week}`, week, status: "scheduled", statusDetail: "Scheduled",
      dateLabel: dl, scheduledAt: kickoff.toISOString(),
      venue: stad.venue, city: stad.city, broadcast: BROADCASTS[idx % BROADCASTS.length],
      away: { abbr: away }, home: { abbr: home },
    });
  }
  return games;
}

const GAMES = WEEK1_GAMES.concat(
  Array.from({ length: 17 }, (_, i) => generateWeek(i + 2)).flat()
);

/* Mock community-vote baseline per game (PRD §7/§11 — first-party voting
   data; this stands in for that store until a real backend exists). The
   viewer's own vote, read from localStorage, is merged on top by voting.js. */
GAMES.forEach((g) => {
  const rand = seededRandom(hashSeed(`votes-${g.id}`));
  const total = Math.floor(80 + rand() * 900);
  const homeShare = 0.3 + rand() * 0.4;
  const home = Math.round(total * homeShare);
  g.votes = { home, away: Math.max(0, total - home) };
});

function teamLogo(abbr) {
  return `assets/team-logos/${abbr}.png`;
}

function getTeam(abbr) {
  const t = TEAMS[abbr] || { name: abbr.toUpperCase(), short: abbr.toUpperCase() };
  return { abbr, logo: teamLogo(abbr), ...t };
}

function getGameById(id) {
  return GAMES.find((g) => g.id === id);
}

function getGamesForWeek(week) {
  return GAMES.filter((g) => g.week === week);
}

function getWeeks() {
  return Array.from({ length: 18 }, (_, i) => i + 1);
}

function getCurrentOrNextWeek(now = new Date()) {
  for (let w = 1; w <= 18; w++) {
    const weekGames = getGamesForWeek(w);
    const lastKickoff = Math.max(...weekGames.map((g) => new Date(g.scheduledAt).getTime()));
    if (now.getTime() <= lastKickoff) return w;
  }
  return 18;
}

function getUpcomingGamesForTeam(abbr, limit = 3, now = new Date()) {
  return GAMES
    .filter((g) => (g.away.abbr === abbr || g.home.abbr === abbr) && new Date(g.scheduledAt) > now)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    .slice(0, limit);
}

/* The single next game to be played, season-wide — Week View features
   this one as a big card and renders every other game compact. Only
   "scheduled"/"postponed" games are eligible (live is happening now,
   not "next"; final/cancelled are done). */
function getNextUpcomingGame(now = new Date()) {
  return GAMES
    .filter((g) => (g.status === "scheduled" || g.status === "postponed") && new Date(g.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];
}
