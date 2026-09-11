/* Canonical schedule data for the NFL Schedule Hub. All 272 games across
   all 18 weeks of the real 2026 NFL regular season, pulled directly from
   ESPN's own schedule feed (espn.in/nfl/schedule, window.__espnfitt__ ->
   page.content.events) — real matchups, real UTC kickoff times, real
   venues (including the Wednesday-night opener and the Melbourne/Rio
   international games), and real final scores for games already played.
   Status only distinguishes "final" (already played) vs "scheduled"
   (not yet played) since that's genuinely all two states exist in the
   live feed at the time this was pulled — there's no fabricated
   in-between live/delayed/postponed/cancelled state dressed up as real.
   Broadcast is only set for the three fixed weekly network slots
   (Thursday/Sunday/Monday night) plus the confirmed real opener (NBC);
   early/late Sunday slots are intentionally left unset rather than
   guessing the CBS/FOX split, since that data isn't in the feed.
   Game IDs follow the existing convention: {away}-{home}-2026-w{week}.
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

const GAMES = [
  {
    id: "ne-sea-2026-w1", week: 1, status: "final", statusDetail: "Final",
    scheduledAt: "2026-09-10T00:20:00Z",
    venue: "Lumen Field", city: "Seattle, WA", broadcast: "NBC",
    away: { abbr: "ne", score: 10 }, home: { abbr: "sea", score: 13 }, winner: "home",
  },
  {
    id: "sf-lar-2026-w1", week: 1, status: "live", statusDetail: "4th Quarter",
    scheduledAt: "2026-09-11T00:35:00Z",
    venue: "Melbourne Cricket Ground", city: "Melbourne, VIC, Australia", broadcast: "Prime Video",
    away: { abbr: "sf", score: 27 }, home: { abbr: "lar", score: 7 },
  },
  {
    id: "tb-cin-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T17:00:00Z",
    venue: "Paycor Stadium", city: "Cincinnati, OH",
    away: { abbr: "tb" }, home: { abbr: "cin" },
  },
  {
    id: "no-det-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T17:00:00Z",
    venue: "Ford Field", city: "Detroit, MI",
    away: { abbr: "no" }, home: { abbr: "det" },
  },
  {
    id: "nyj-ten-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T17:00:00Z",
    venue: "Nissan Stadium", city: "Nashville, TN",
    away: { abbr: "nyj" }, home: { abbr: "ten" },
  },
  {
    id: "bal-ind-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T17:00:00Z",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN",
    away: { abbr: "bal" }, home: { abbr: "ind" },
  },
  {
    id: "atl-pit-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T17:00:00Z",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA",
    away: { abbr: "atl" }, home: { abbr: "pit" },
  },
  {
    id: "chi-car-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T17:00:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC",
    away: { abbr: "chi" }, home: { abbr: "car" },
  },
  {
    id: "cle-jax-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T17:00:00Z",
    venue: "EverBank Stadium", city: "Jacksonville, FL",
    away: { abbr: "cle" }, home: { abbr: "jax" },
  },
  {
    id: "buf-hou-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T17:00:00Z",
    venue: "Reliant Stadium", city: "Houston, TX",
    away: { abbr: "buf" }, home: { abbr: "hou" },
  },
  {
    id: "mia-lv-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T20:25:00Z",
    venue: "Allegiant Stadium", city: "Las Vegas, NV",
    away: { abbr: "mia" }, home: { abbr: "lv" },
  },
  {
    id: "gb-min-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T20:25:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN",
    away: { abbr: "gb" }, home: { abbr: "min" },
  },
  {
    id: "wsh-phi-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T20:25:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA",
    away: { abbr: "wsh" }, home: { abbr: "phi" },
  },
  {
    id: "ari-lac-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-13T20:25:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "ari" }, home: { abbr: "lac" },
  },
  {
    id: "dal-nyg-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-14T00:20:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "dal" }, home: { abbr: "nyg" },
  },
  {
    id: "den-kc-2026-w1", week: 1, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-15T00:15:00Z",
    venue: "Arrowhead Stadium", city: "Kansas City, MO", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "den" }, home: { abbr: "kc" },
  },
  {
    id: "det-buf-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-18T00:15:00Z",
    venue: "Highmark Stadium", city: "Orchard Park, NY", broadcast: "Prime Video",
    away: { abbr: "det" }, home: { abbr: "buf" },
  },
  {
    id: "car-atl-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T17:00:00Z",
    venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",
    away: { abbr: "car" }, home: { abbr: "atl" },
  },
  {
    id: "min-chi-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T17:00:00Z",
    venue: "Soldier Field", city: "Chicago, IL",
    away: { abbr: "min" }, home: { abbr: "chi" },
  },
  {
    id: "phi-ten-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T17:00:00Z",
    venue: "Nissan Stadium", city: "Nashville, TN",
    away: { abbr: "phi" }, home: { abbr: "ten" },
  },
  {
    id: "pit-ne-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T17:00:00Z",
    venue: "Gillette Stadium", city: "Foxborough, MA",
    away: { abbr: "pit" }, home: { abbr: "ne" },
  },
  {
    id: "gb-nyj-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T17:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "gb" }, home: { abbr: "nyj" },
  },
  {
    id: "cle-tb-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T17:00:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL",
    away: { abbr: "cle" }, home: { abbr: "tb" },
  },
  {
    id: "no-bal-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T17:00:00Z",
    venue: "M&T Bank Stadium", city: "Baltimore, MD",
    away: { abbr: "no" }, home: { abbr: "bal" },
  },
  {
    id: "cin-hou-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T17:00:00Z",
    venue: "Reliant Stadium", city: "Houston, TX",
    away: { abbr: "cin" }, home: { abbr: "hou" },
  },
  {
    id: "jax-den-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T20:05:00Z",
    venue: "Empower Field at Mile High", city: "Denver, CO",
    away: { abbr: "jax" }, home: { abbr: "den" },
  },
  {
    id: "lv-lac-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T20:05:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "lv" }, home: { abbr: "lac" },
  },
  {
    id: "wsh-dal-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T20:25:00Z",
    venue: "AT&T Stadium", city: "Arlington, TX",
    away: { abbr: "wsh" }, home: { abbr: "dal" },
  },
  {
    id: "sea-ari-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T20:25:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "sea" }, home: { abbr: "ari" },
  },
  {
    id: "mia-sf-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-20T20:25:00Z",
    venue: "Levi's Stadium", city: "Santa Clara, CA",
    away: { abbr: "mia" }, home: { abbr: "sf" },
  },
  {
    id: "ind-kc-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-21T00:20:00Z",
    venue: "Arrowhead Stadium", city: "Kansas City, MO", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "ind" }, home: { abbr: "kc" },
  },
  {
    id: "nyg-lar-2026-w2", week: 2, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-22T00:15:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "nyg" }, home: { abbr: "lar" },
  },
  {
    id: "atl-gb-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-25T00:15:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI", broadcast: "Prime Video",
    away: { abbr: "atl" }, home: { abbr: "gb" },
  },
  {
    id: "lac-buf-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "Highmark Stadium", city: "Orchard Park, NY",
    away: { abbr: "lac" }, home: { abbr: "buf" },
  },
  {
    id: "car-cle-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "Huntington Bank Field", city: "Cleveland, OH",
    away: { abbr: "car" }, home: { abbr: "cle" },
  },
  {
    id: "nyj-det-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "Ford Field", city: "Detroit, MI",
    away: { abbr: "nyj" }, home: { abbr: "det" },
  },
  {
    id: "hou-ind-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN",
    away: { abbr: "hou" }, home: { abbr: "ind" },
  },
  {
    id: "kc-mia-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "Hard Rock Stadium", city: "Miami Gardens, FL",
    away: { abbr: "kc" }, home: { abbr: "mia" },
  },
  {
    id: "ten-nyg-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "ten" }, home: { abbr: "nyg" },
  },
  {
    id: "cin-pit-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA",
    away: { abbr: "cin" }, home: { abbr: "pit" },
  },
  {
    id: "sea-wsh-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "Northwest Stadium", city: "Landover, MD",
    away: { abbr: "sea" }, home: { abbr: "wsh" },
  },
  {
    id: "ne-jax-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T17:00:00Z",
    venue: "EverBank Stadium", city: "Jacksonville, FL",
    away: { abbr: "ne" }, home: { abbr: "jax" },
  },
  {
    id: "ari-sf-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T20:05:00Z",
    venue: "Levi's Stadium", city: "Santa Clara, CA",
    away: { abbr: "ari" }, home: { abbr: "sf" },
  },
  {
    id: "min-tb-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T20:05:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL",
    away: { abbr: "min" }, home: { abbr: "tb" },
  },
  {
    id: "bal-dal-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T20:25:00Z",
    venue: "Maracanã Stadium", city: "Rio De Janeiro, Brazil",
    away: { abbr: "bal" }, home: { abbr: "dal" },
  },
  {
    id: "lv-no-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-27T20:25:00Z",
    venue: "Caesars Superdome", city: "New Orleans, LA",
    away: { abbr: "lv" }, home: { abbr: "no" },
  },
  {
    id: "lar-den-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-28T00:20:00Z",
    venue: "Empower Field at Mile High", city: "Denver, CO", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "lar" }, home: { abbr: "den" },
  },
  {
    id: "phi-chi-2026-w3", week: 3, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-09-29T00:15:00Z",
    venue: "Soldier Field", city: "Chicago, IL", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "phi" }, home: { abbr: "chi" },
  },
  {
    id: "pit-cle-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-02T00:15:00Z",
    venue: "Huntington Bank Field", city: "Cleveland, OH", broadcast: "Prime Video",
    away: { abbr: "pit" }, home: { abbr: "cle" },
  },
  {
    id: "ind-wsh-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T13:30:00Z",
    venue: "Tottenham Hotspur Stadium", city: "London, England",
    away: { abbr: "ind" }, home: { abbr: "wsh" },
  },
  {
    id: "ne-buf-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T17:00:00Z",
    venue: "Highmark Stadium", city: "Orchard Park, NY",
    away: { abbr: "ne" }, home: { abbr: "buf" },
  },
  {
    id: "nyj-chi-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T17:00:00Z",
    venue: "Soldier Field", city: "Chicago, IL",
    away: { abbr: "nyj" }, home: { abbr: "chi" },
  },
  {
    id: "jax-cin-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T17:00:00Z",
    venue: "Paycor Stadium", city: "Cincinnati, OH",
    away: { abbr: "jax" }, home: { abbr: "cin" },
  },
  {
    id: "ari-nyg-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T17:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "ari" }, home: { abbr: "nyg" },
  },
  {
    id: "lar-phi-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T17:00:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA",
    away: { abbr: "lar" }, home: { abbr: "phi" },
  },
  {
    id: "gb-tb-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T17:00:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL",
    away: { abbr: "gb" }, home: { abbr: "tb" },
  },
  {
    id: "ten-bal-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T17:00:00Z",
    venue: "M&T Bank Stadium", city: "Baltimore, MD",
    away: { abbr: "ten" }, home: { abbr: "bal" },
  },
  {
    id: "dal-hou-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T17:00:00Z",
    venue: "Reliant Stadium", city: "Houston, TX",
    away: { abbr: "dal" }, home: { abbr: "hou" },
  },
  {
    id: "mia-min-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T20:05:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN",
    away: { abbr: "mia" }, home: { abbr: "min" },
  },
  {
    id: "kc-lv-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T20:25:00Z",
    venue: "Allegiant Stadium", city: "Las Vegas, NV",
    away: { abbr: "kc" }, home: { abbr: "lv" },
  },
  {
    id: "den-sf-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T20:25:00Z",
    venue: "Levi's Stadium", city: "Santa Clara, CA",
    away: { abbr: "den" }, home: { abbr: "sf" },
  },
  {
    id: "lac-sea-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-04T20:25:00Z",
    venue: "Lumen Field", city: "Seattle, WA",
    away: { abbr: "lac" }, home: { abbr: "sea" },
  },
  {
    id: "det-car-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-05T00:20:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "det" }, home: { abbr: "car" },
  },
  {
    id: "atl-no-2026-w4", week: 4, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-06T00:15:00Z",
    venue: "Caesars Superdome", city: "New Orleans, LA", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "atl" }, home: { abbr: "no" },
  },
  {
    id: "tb-dal-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-09T00:15:00Z",
    venue: "AT&T Stadium", city: "Arlington, TX", broadcast: "Prime Video",
    away: { abbr: "tb" }, home: { abbr: "dal" },
  },
  {
    id: "phi-jax-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T13:30:00Z",
    venue: "Tottenham Hotspur Stadium", city: "London, England",
    away: { abbr: "phi" }, home: { abbr: "jax" },
  },
  {
    id: "hou-ten-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T17:00:00Z",
    venue: "Nissan Stadium", city: "Nashville, TN",
    away: { abbr: "hou" }, home: { abbr: "ten" },
  },
  {
    id: "cin-mia-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T17:00:00Z",
    venue: "Hard Rock Stadium", city: "Miami Gardens, FL",
    away: { abbr: "cin" }, home: { abbr: "mia" },
  },
  {
    id: "lv-ne-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T17:00:00Z",
    venue: "Gillette Stadium", city: "Foxborough, MA",
    away: { abbr: "lv" }, home: { abbr: "ne" },
  },
  {
    id: "min-no-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T17:00:00Z",
    venue: "Caesars Superdome", city: "New Orleans, LA",
    away: { abbr: "min" }, home: { abbr: "no" },
  },
  {
    id: "cle-nyj-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T17:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "cle" }, home: { abbr: "nyj" },
  },
  {
    id: "ind-pit-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T17:00:00Z",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA",
    away: { abbr: "ind" }, home: { abbr: "pit" },
  },
  {
    id: "nyg-wsh-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T17:00:00Z",
    venue: "Northwest Stadium", city: "Landover, MD",
    away: { abbr: "nyg" }, home: { abbr: "wsh" },
  },
  {
    id: "den-lac-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T20:05:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "den" }, home: { abbr: "lac" },
  },
  {
    id: "chi-gb-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T20:25:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI",
    away: { abbr: "chi" }, home: { abbr: "gb" },
  },
  {
    id: "det-ari-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T20:25:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "det" }, home: { abbr: "ari" },
  },
  {
    id: "sf-sea-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-11T20:25:00Z",
    venue: "Lumen Field", city: "Seattle, WA",
    away: { abbr: "sf" }, home: { abbr: "sea" },
  },
  {
    id: "bal-atl-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-12T00:20:00Z",
    venue: "Mercedes-Benz Stadium", city: "Atlanta, GA", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "bal" }, home: { abbr: "atl" },
  },
  {
    id: "buf-lar-2026-w5", week: 5, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-13T00:15:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "buf" }, home: { abbr: "lar" },
  },
  {
    id: "sea-den-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-16T00:15:00Z",
    venue: "Empower Field at Mile High", city: "Denver, CO", broadcast: "Prime Video",
    away: { abbr: "sea" }, home: { abbr: "den" },
  },
  {
    id: "hou-jax-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T13:30:00Z",
    venue: "Wembley Stadium", city: "London, England",
    away: { abbr: "hou" }, home: { abbr: "jax" },
  },
  {
    id: "chi-atl-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T17:00:00Z",
    venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",
    away: { abbr: "chi" }, home: { abbr: "atl" },
  },
  {
    id: "bal-cle-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T17:00:00Z",
    venue: "Huntington Bank Field", city: "Cleveland, OH",
    away: { abbr: "bal" }, home: { abbr: "cle" },
  },
  {
    id: "ten-ind-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T17:00:00Z",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN",
    away: { abbr: "ten" }, home: { abbr: "ind" },
  },
  {
    id: "nyj-ne-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T17:00:00Z",
    venue: "Gillette Stadium", city: "Foxborough, MA",
    away: { abbr: "nyj" }, home: { abbr: "ne" },
  },
  {
    id: "no-nyg-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T17:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "no" }, home: { abbr: "nyg" },
  },
  {
    id: "car-phi-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T17:00:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA",
    away: { abbr: "car" }, home: { abbr: "phi" },
  },
  {
    id: "pit-tb-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T17:00:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL",
    away: { abbr: "pit" }, home: { abbr: "tb" },
  },
  {
    id: "ari-lar-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T20:05:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "ari" }, home: { abbr: "lar" },
  },
  {
    id: "lac-kc-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T20:25:00Z",
    venue: "Arrowhead Stadium", city: "Kansas City, MO",
    away: { abbr: "lac" }, home: { abbr: "kc" },
  },
  {
    id: "buf-lv-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-18T20:25:00Z",
    venue: "Allegiant Stadium", city: "Las Vegas, NV",
    away: { abbr: "buf" }, home: { abbr: "lv" },
  },
  {
    id: "dal-gb-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-19T00:20:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "dal" }, home: { abbr: "gb" },
  },
  {
    id: "wsh-sf-2026-w6", week: 6, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-20T00:15:00Z",
    venue: "Levi's Stadium", city: "Santa Clara, CA", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "wsh" }, home: { abbr: "sf" },
  },
  {
    id: "ne-chi-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-23T00:15:00Z",
    venue: "Soldier Field", city: "Chicago, IL", broadcast: "Prime Video",
    away: { abbr: "ne" }, home: { abbr: "chi" },
  },
  {
    id: "pit-no-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T13:30:00Z",
    venue: "Stade de France", city: "Saint-Denis, France",
    away: { abbr: "pit" }, home: { abbr: "no" },
  },
  {
    id: "sf-atl-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T17:00:00Z",
    venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",
    away: { abbr: "sf" }, home: { abbr: "atl" },
  },
  {
    id: "cle-ten-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T17:00:00Z",
    venue: "Nissan Stadium", city: "Nashville, TN",
    away: { abbr: "cle" }, home: { abbr: "ten" },
  },
  {
    id: "ind-min-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T17:00:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN",
    away: { abbr: "ind" }, home: { abbr: "min" },
  },
  {
    id: "mia-nyj-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T17:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "mia" }, home: { abbr: "nyj" },
  },
  {
    id: "tb-car-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T17:00:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC",
    away: { abbr: "tb" }, home: { abbr: "car" },
  },
  {
    id: "cin-bal-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T17:00:00Z",
    venue: "M&T Bank Stadium", city: "Baltimore, MD",
    away: { abbr: "cin" }, home: { abbr: "bal" },
  },
  {
    id: "nyg-hou-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T17:00:00Z",
    venue: "Reliant Stadium", city: "Houston, TX",
    away: { abbr: "nyg" }, home: { abbr: "hou" },
  },
  {
    id: "den-ari-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T20:05:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "den" }, home: { abbr: "ari" },
  },
  {
    id: "gb-det-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T20:25:00Z",
    venue: "Ford Field", city: "Detroit, MI",
    away: { abbr: "gb" }, home: { abbr: "det" },
  },
  {
    id: "lar-lv-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-25T20:25:00Z",
    venue: "Allegiant Stadium", city: "Las Vegas, NV",
    away: { abbr: "lar" }, home: { abbr: "lv" },
  },
  {
    id: "kc-sea-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-26T00:20:00Z",
    venue: "Lumen Field", city: "Seattle, WA", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "kc" }, home: { abbr: "sea" },
  },
  {
    id: "dal-phi-2026-w7", week: 7, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-27T00:15:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "dal" }, home: { abbr: "phi" },
  },
  {
    id: "car-gb-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-10-30T00:15:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI", broadcast: "Prime Video",
    away: { abbr: "car" }, home: { abbr: "gb" },
  },
  {
    id: "bal-buf-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T18:00:00Z",
    venue: "Highmark Stadium", city: "Orchard Park, NY",
    away: { abbr: "bal" }, home: { abbr: "buf" },
  },
  {
    id: "ten-cin-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T18:00:00Z",
    venue: "Paycor Stadium", city: "Cincinnati, OH",
    away: { abbr: "ten" }, home: { abbr: "cin" },
  },
  {
    id: "ari-dal-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T18:00:00Z",
    venue: "AT&T Stadium", city: "Arlington, TX",
    away: { abbr: "ari" }, home: { abbr: "dal" },
  },
  {
    id: "min-det-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T18:00:00Z",
    venue: "Ford Field", city: "Detroit, MI",
    away: { abbr: "min" }, home: { abbr: "det" },
  },
  {
    id: "lv-nyj-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T18:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "lv" }, home: { abbr: "nyj" },
  },
  {
    id: "cle-pit-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T18:00:00Z",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA",
    away: { abbr: "cle" }, home: { abbr: "pit" },
  },
  {
    id: "atl-tb-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T18:00:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL",
    away: { abbr: "atl" }, home: { abbr: "tb" },
  },
  {
    id: "ind-jax-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T18:00:00Z",
    venue: "EverBank Stadium", city: "Jacksonville, FL",
    away: { abbr: "ind" }, home: { abbr: "jax" },
  },
  {
    id: "lac-lar-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T21:05:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "lac" }, home: { abbr: "lar" },
  },
  {
    id: "kc-den-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T21:25:00Z",
    venue: "Empower Field at Mile High", city: "Denver, CO",
    away: { abbr: "kc" }, home: { abbr: "den" },
  },
  {
    id: "ne-mia-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-01T21:25:00Z",
    venue: "Hard Rock Stadium", city: "Miami Gardens, FL",
    away: { abbr: "ne" }, home: { abbr: "mia" },
  },
  {
    id: "phi-wsh-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-02T01:20:00Z",
    venue: "Northwest Stadium", city: "Landover, MD", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "phi" }, home: { abbr: "wsh" },
  },
  {
    id: "chi-sea-2026-w8", week: 8, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-03T01:15:00Z",
    venue: "Lumen Field", city: "Seattle, WA", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "chi" }, home: { abbr: "sea" },
  },
  {
    id: "jax-bal-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-06T01:15:00Z",
    venue: "M&T Bank Stadium", city: "Baltimore, MD", broadcast: "Prime Video",
    away: { abbr: "jax" }, home: { abbr: "bal" },
  },
  {
    id: "cin-atl-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T14:30:00Z",
    venue: "Santiago Bernabéu", city: "Madrid, Spain",
    away: { abbr: "cin" }, home: { abbr: "atl" },
  },
  {
    id: "dal-ind-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T18:00:00Z",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN",
    away: { abbr: "dal" }, home: { abbr: "ind" },
  },
  {
    id: "nyj-kc-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T18:00:00Z",
    venue: "Arrowhead Stadium", city: "Kansas City, MO",
    away: { abbr: "nyj" }, home: { abbr: "kc" },
  },
  {
    id: "det-mia-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T18:00:00Z",
    venue: "Hard Rock Stadium", city: "Miami Gardens, FL",
    away: { abbr: "det" }, home: { abbr: "mia" },
  },
  {
    id: "cle-no-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T18:00:00Z",
    venue: "Caesars Superdome", city: "New Orleans, LA",
    away: { abbr: "cle" }, home: { abbr: "no" },
  },
  {
    id: "nyg-phi-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T18:00:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA",
    away: { abbr: "nyg" }, home: { abbr: "phi" },
  },
  {
    id: "lar-wsh-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T18:00:00Z",
    venue: "Northwest Stadium", city: "Landover, MD",
    away: { abbr: "lar" }, home: { abbr: "wsh" },
  },
  {
    id: "den-car-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T18:00:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC",
    away: { abbr: "den" }, home: { abbr: "car" },
  },
  {
    id: "hou-lac-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T21:05:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "hou" }, home: { abbr: "lac" },
  },
  {
    id: "lv-sf-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T21:05:00Z",
    venue: "Levi's Stadium", city: "Santa Clara, CA",
    away: { abbr: "lv" }, home: { abbr: "sf" },
  },
  {
    id: "gb-ne-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T21:25:00Z",
    venue: "Gillette Stadium", city: "Foxborough, MA",
    away: { abbr: "gb" }, home: { abbr: "ne" },
  },
  {
    id: "ari-sea-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-08T21:25:00Z",
    venue: "Lumen Field", city: "Seattle, WA",
    away: { abbr: "ari" }, home: { abbr: "sea" },
  },
  {
    id: "tb-chi-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-09T01:20:00Z",
    venue: "Soldier Field", city: "Chicago, IL", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "tb" }, home: { abbr: "chi" },
  },
  {
    id: "buf-min-2026-w9", week: 9, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-10T01:15:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "buf" }, home: { abbr: "min" },
  },
  {
    id: "wsh-nyg-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-13T01:15:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ", broadcast: "Prime Video",
    away: { abbr: "wsh" }, home: { abbr: "nyg" },
  },
  {
    id: "ne-det-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T14:30:00Z",
    venue: "FC Bayern Munich Stadium", city: "Munich, Germany",
    away: { abbr: "ne" }, home: { abbr: "det" },
  },
  {
    id: "kc-atl-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T18:00:00Z",
    venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",
    away: { abbr: "kc" }, home: { abbr: "atl" },
  },
  {
    id: "hou-cle-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T18:00:00Z",
    venue: "Huntington Bank Field", city: "Cleveland, OH",
    away: { abbr: "hou" }, home: { abbr: "cle" },
  },
  {
    id: "min-gb-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T18:00:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI",
    away: { abbr: "min" }, home: { abbr: "gb" },
  },
  {
    id: "jax-ten-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T18:00:00Z",
    venue: "Nissan Stadium", city: "Nashville, TN",
    away: { abbr: "jax" }, home: { abbr: "ten" },
  },
  {
    id: "mia-ind-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T18:00:00Z",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN",
    away: { abbr: "mia" }, home: { abbr: "ind" },
  },
  {
    id: "car-no-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T18:00:00Z",
    venue: "Caesars Superdome", city: "New Orleans, LA",
    away: { abbr: "car" }, home: { abbr: "no" },
  },
  {
    id: "buf-nyj-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T18:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "buf" }, home: { abbr: "nyj" },
  },
  {
    id: "sea-lv-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T21:05:00Z",
    venue: "Allegiant Stadium", city: "Las Vegas, NV",
    away: { abbr: "sea" }, home: { abbr: "lv" },
  },
  {
    id: "lar-ari-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T21:05:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "lar" }, home: { abbr: "ari" },
  },
  {
    id: "sf-dal-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-15T21:25:00Z",
    venue: "AT&T Stadium", city: "Arlington, TX",
    away: { abbr: "sf" }, home: { abbr: "dal" },
  },
  {
    id: "pit-cin-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-16T01:20:00Z",
    venue: "Paycor Stadium", city: "Cincinnati, OH", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "pit" }, home: { abbr: "cin" },
  },
  {
    id: "lac-bal-2026-w10", week: 10, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-17T01:15:00Z",
    venue: "M&T Bank Stadium", city: "Baltimore, MD", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "lac" }, home: { abbr: "bal" },
  },
  {
    id: "ind-hou-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-20T01:15:00Z",
    venue: "Reliant Stadium", city: "Houston, TX", broadcast: "Prime Video",
    away: { abbr: "ind" }, home: { abbr: "hou" },
  },
  {
    id: "mia-buf-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T18:00:00Z",
    venue: "Highmark Stadium", city: "Orchard Park, NY",
    away: { abbr: "mia" }, home: { abbr: "buf" },
  },
  {
    id: "no-chi-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T18:00:00Z",
    venue: "Soldier Field", city: "Chicago, IL",
    away: { abbr: "no" }, home: { abbr: "chi" },
  },
  {
    id: "ten-dal-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T18:00:00Z",
    venue: "AT&T Stadium", city: "Arlington, TX",
    away: { abbr: "ten" }, home: { abbr: "dal" },
  },
  {
    id: "tb-det-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T18:00:00Z",
    venue: "Ford Field", city: "Detroit, MI",
    away: { abbr: "tb" }, home: { abbr: "det" },
  },
  {
    id: "ari-kc-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T18:00:00Z",
    venue: "Arrowhead Stadium", city: "Kansas City, MO",
    away: { abbr: "ari" }, home: { abbr: "kc" },
  },
  {
    id: "jax-nyg-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T18:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "jax" }, home: { abbr: "nyg" },
  },
  {
    id: "bal-car-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T18:00:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC",
    away: { abbr: "bal" }, home: { abbr: "car" },
  },
  {
    id: "nyj-lac-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T21:05:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "nyj" }, home: { abbr: "lac" },
  },
  {
    id: "lv-den-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T21:25:00Z",
    venue: "Empower Field at Mile High", city: "Denver, CO",
    away: { abbr: "lv" }, home: { abbr: "den" },
  },
  {
    id: "pit-phi-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-22T21:25:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA",
    away: { abbr: "pit" }, home: { abbr: "phi" },
  },
  {
    id: "min-sf-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-23T01:20:00Z",
    venue: "Estadio Banorte", city: "Mexico City, Mexico", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "min" }, home: { abbr: "sf" },
  },
  {
    id: "cin-wsh-2026-w11", week: 11, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-24T01:15:00Z",
    venue: "Northwest Stadium", city: "Landover, MD", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "cin" }, home: { abbr: "wsh" },
  },
  {
    id: "gb-lar-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-26T01:00:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "gb" }, home: { abbr: "lar" },
  },
  {
    id: "chi-det-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-26T18:00:00Z",
    venue: "Ford Field", city: "Detroit, MI", broadcast: "Prime Video",
    away: { abbr: "chi" }, home: { abbr: "det" },
  },
  {
    id: "phi-dal-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-26T21:30:00Z",
    venue: "AT&T Stadium", city: "Arlington, TX", broadcast: "Prime Video",
    away: { abbr: "phi" }, home: { abbr: "dal" },
  },
  {
    id: "kc-buf-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-27T01:20:00Z",
    venue: "Highmark Stadium", city: "Orchard Park, NY", broadcast: "Prime Video",
    away: { abbr: "kc" }, home: { abbr: "buf" },
  },
  {
    id: "den-pit-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-27T20:00:00Z",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA",
    away: { abbr: "den" }, home: { abbr: "pit" },
  },
  {
    id: "no-cin-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T18:00:00Z",
    venue: "Paycor Stadium", city: "Cincinnati, OH",
    away: { abbr: "no" }, home: { abbr: "cin" },
  },
  {
    id: "lv-cle-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T18:00:00Z",
    venue: "Huntington Bank Field", city: "Cleveland, OH",
    away: { abbr: "lv" }, home: { abbr: "cle" },
  },
  {
    id: "nyg-ind-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T18:00:00Z",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN",
    away: { abbr: "nyg" }, home: { abbr: "ind" },
  },
  {
    id: "nyj-mia-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T18:00:00Z",
    venue: "Hard Rock Stadium", city: "Miami Gardens, FL",
    away: { abbr: "nyj" }, home: { abbr: "mia" },
  },
  {
    id: "atl-min-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T18:00:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN",
    away: { abbr: "atl" }, home: { abbr: "min" },
  },
  {
    id: "bal-hou-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T18:00:00Z",
    venue: "Reliant Stadium", city: "Houston, TX",
    away: { abbr: "bal" }, home: { abbr: "hou" },
  },
  {
    id: "ten-jax-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T21:05:00Z",
    venue: "EverBank Stadium", city: "Jacksonville, FL",
    away: { abbr: "ten" }, home: { abbr: "jax" },
  },
  {
    id: "wsh-ari-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T21:25:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "wsh" }, home: { abbr: "ari" },
  },
  {
    id: "sea-sf-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-29T21:25:00Z",
    venue: "Levi's Stadium", city: "Santa Clara, CA",
    away: { abbr: "sea" }, home: { abbr: "sf" },
  },
  {
    id: "ne-lac-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-11-30T01:20:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "ne" }, home: { abbr: "lac" },
  },
  {
    id: "car-tb-2026-w12", week: 12, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-01T01:15:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "car" }, home: { abbr: "tb" },
  },
  {
    id: "kc-lar-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-04T01:15:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA", broadcast: "Prime Video",
    away: { abbr: "kc" }, home: { abbr: "lar" },
  },
  {
    id: "det-atl-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T18:00:00Z",
    venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",
    away: { abbr: "det" }, home: { abbr: "atl" },
  },
  {
    id: "jax-chi-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T18:00:00Z",
    venue: "Soldier Field", city: "Chicago, IL",
    away: { abbr: "jax" }, home: { abbr: "chi" },
  },
  {
    id: "cin-cle-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T18:00:00Z",
    venue: "Huntington Bank Field", city: "Cleveland, OH",
    away: { abbr: "cin" }, home: { abbr: "cle" },
  },
  {
    id: "wsh-ten-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T18:00:00Z",
    venue: "Nissan Stadium", city: "Nashville, TN",
    away: { abbr: "wsh" }, home: { abbr: "ten" },
  },
  {
    id: "gb-no-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T18:00:00Z",
    venue: "Caesars Superdome", city: "New Orleans, LA",
    away: { abbr: "gb" }, home: { abbr: "no" },
  },
  {
    id: "sf-nyg-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T18:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "sf" }, home: { abbr: "nyg" },
  },
  {
    id: "lac-tb-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T18:00:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL",
    away: { abbr: "lac" }, home: { abbr: "tb" },
  },
  {
    id: "mia-den-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T21:05:00Z",
    venue: "Empower Field at Mile High", city: "Denver, CO",
    away: { abbr: "mia" }, home: { abbr: "den" },
  },
  {
    id: "phi-ari-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T21:05:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "phi" }, home: { abbr: "ari" },
  },
  {
    id: "car-min-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T21:25:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN",
    away: { abbr: "car" }, home: { abbr: "min" },
  },
  {
    id: "buf-ne-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-06T21:25:00Z",
    venue: "Gillette Stadium", city: "Foxborough, MA",
    away: { abbr: "buf" }, home: { abbr: "ne" },
  },
  {
    id: "hou-pit-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-07T01:20:00Z",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "hou" }, home: { abbr: "pit" },
  },
  {
    id: "dal-sea-2026-w13", week: 13, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-08T01:15:00Z",
    venue: "Lumen Field", city: "Seattle, WA", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "dal" }, home: { abbr: "sea" },
  },
  {
    id: "min-ne-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-11T01:15:00Z",
    venue: "Gillette Stadium", city: "Foxborough, MA", broadcast: "Prime Video",
    away: { abbr: "min" }, home: { abbr: "ne" },
  },
  {
    id: "atl-cle-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T18:00:00Z",
    venue: "Huntington Bank Field", city: "Cleveland, OH",
    away: { abbr: "atl" }, home: { abbr: "cle" },
  },
  {
    id: "ten-det-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T18:00:00Z",
    venue: "Ford Field", city: "Detroit, MI",
    away: { abbr: "ten" }, home: { abbr: "det" },
  },
  {
    id: "chi-mia-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T18:00:00Z",
    venue: "Hard Rock Stadium", city: "Miami Gardens, FL",
    away: { abbr: "chi" }, home: { abbr: "mia" },
  },
  {
    id: "den-nyj-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T18:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "den" }, home: { abbr: "nyj" },
  },
  {
    id: "ind-phi-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T18:00:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA",
    away: { abbr: "ind" }, home: { abbr: "phi" },
  },
  {
    id: "hou-wsh-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T18:00:00Z",
    venue: "Northwest Stadium", city: "Landover, MD",
    away: { abbr: "hou" }, home: { abbr: "wsh" },
  },
  {
    id: "no-car-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T18:00:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC",
    away: { abbr: "no" }, home: { abbr: "car" },
  },
  {
    id: "tb-bal-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T18:00:00Z",
    venue: "M&T Bank Stadium", city: "Baltimore, MD",
    away: { abbr: "tb" }, home: { abbr: "bal" },
  },
  {
    id: "lac-lv-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T21:05:00Z",
    venue: "Allegiant Stadium", city: "Las Vegas, NV",
    away: { abbr: "lac" }, home: { abbr: "lv" },
  },
  {
    id: "kc-cin-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T21:25:00Z",
    venue: "Paycor Stadium", city: "Cincinnati, OH",
    away: { abbr: "kc" }, home: { abbr: "cin" },
  },
  {
    id: "lar-sf-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T21:25:00Z",
    venue: "Levi's Stadium", city: "Santa Clara, CA",
    away: { abbr: "lar" }, home: { abbr: "sf" },
  },
  {
    id: "nyg-sea-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-13T21:25:00Z",
    venue: "Lumen Field", city: "Seattle, WA",
    away: { abbr: "nyg" }, home: { abbr: "sea" },
  },
  {
    id: "buf-gb-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-14T01:20:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "buf" }, home: { abbr: "gb" },
  },
  {
    id: "pit-jax-2026-w14", week: 14, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-15T01:15:00Z",
    venue: "EverBank Stadium", city: "Jacksonville, FL", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "pit" }, home: { abbr: "jax" },
  },
  {
    id: "sf-lac-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-18T01:15:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA", broadcast: "Prime Video",
    away: { abbr: "sf" }, home: { abbr: "lac" },
  },
  {
    id: "sea-phi-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-19T22:00:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA",
    away: { abbr: "sea" }, home: { abbr: "phi" },
  },
  {
    id: "chi-buf-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T01:20:00Z",
    venue: "Highmark Stadium", city: "Orchard Park, NY",
    away: { abbr: "chi" }, home: { abbr: "buf" },
  },
  {
    id: "mia-gb-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T18:00:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI",
    away: { abbr: "mia" }, home: { abbr: "gb" },
  },
  {
    id: "ind-ten-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T18:00:00Z",
    venue: "Nissan Stadium", city: "Nashville, TN",
    away: { abbr: "ind" }, home: { abbr: "ten" },
  },
  {
    id: "cle-nyg-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T18:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "cle" }, home: { abbr: "nyg" },
  },
  {
    id: "bal-pit-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T18:00:00Z",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA",
    away: { abbr: "bal" }, home: { abbr: "pit" },
  },
  {
    id: "no-tb-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T18:00:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL",
    away: { abbr: "no" }, home: { abbr: "tb" },
  },
  {
    id: "atl-wsh-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T18:00:00Z",
    venue: "Northwest Stadium", city: "Landover, MD",
    away: { abbr: "atl" }, home: { abbr: "wsh" },
  },
  {
    id: "cin-car-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T18:00:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC",
    away: { abbr: "cin" }, home: { abbr: "car" },
  },
  {
    id: "jax-hou-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T18:00:00Z",
    venue: "Reliant Stadium", city: "Houston, TX",
    away: { abbr: "jax" }, home: { abbr: "hou" },
  },
  {
    id: "nyj-ari-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T21:05:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "nyj" }, home: { abbr: "ari" },
  },
  {
    id: "den-lv-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T21:25:00Z",
    venue: "Allegiant Stadium", city: "Las Vegas, NV",
    away: { abbr: "den" }, home: { abbr: "lv" },
  },
  {
    id: "dal-lar-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-20T21:25:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "dal" }, home: { abbr: "lar" },
  },
  {
    id: "det-min-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-21T01:20:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "det" }, home: { abbr: "min" },
  },
  {
    id: "ne-kc-2026-w15", week: 15, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-22T01:15:00Z",
    venue: "Arrowhead Stadium", city: "Kansas City, MO", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "ne" }, home: { abbr: "kc" },
  },
  {
    id: "hou-phi-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-25T01:15:00Z",
    venue: "Lincoln Financial Field", city: "Philadelphia, PA", broadcast: "Prime Video",
    away: { abbr: "hou" }, home: { abbr: "phi" },
  },
  {
    id: "gb-chi-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-25T18:00:00Z",
    venue: "Soldier Field", city: "Chicago, IL",
    away: { abbr: "gb" }, home: { abbr: "chi" },
  },
  {
    id: "buf-den-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-25T21:30:00Z",
    venue: "Empower Field at Mile High", city: "Denver, CO",
    away: { abbr: "buf" }, home: { abbr: "den" },
  },
  {
    id: "lar-sea-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-26T01:15:00Z",
    venue: "Lumen Field", city: "Seattle, WA",
    away: { abbr: "lar" }, home: { abbr: "sea" },
  },
  {
    id: "lac-mia-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T18:00:00Z",
    venue: "Hard Rock Stadium", city: "Miami Gardens, FL",
    away: { abbr: "lac" }, home: { abbr: "mia" },
  },
  {
    id: "ari-no-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T18:00:00Z",
    venue: "Caesars Superdome", city: "New Orleans, LA",
    away: { abbr: "ari" }, home: { abbr: "no" },
  },
  {
    id: "ne-nyj-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T18:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "ne" }, home: { abbr: "nyj" },
  },
  {
    id: "cle-bal-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T18:00:00Z",
    venue: "M&T Bank Stadium", city: "Baltimore, MD",
    away: { abbr: "cle" }, home: { abbr: "bal" },
  },
  {
    id: "ten-lv-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T21:05:00Z",
    venue: "Allegiant Stadium", city: "Las Vegas, NV",
    away: { abbr: "ten" }, home: { abbr: "lv" },
  },
  {
    id: "sf-kc-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T21:25:00Z",
    venue: "Arrowhead Stadium", city: "Kansas City, MO",
    away: { abbr: "sf" }, home: { abbr: "kc" },
  },
  {
    id: "jax-dal-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-28T01:20:00Z",
    venue: "AT&T Stadium", city: "Arlington, TX", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "jax" }, home: { abbr: "dal" },
  },
  {
    id: "nyg-det-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-29T01:15:00Z",
    venue: "Ford Field", city: "Detroit, MI", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "nyg" }, home: { abbr: "det" },
  },
  {
    id: "tb-atl-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T05:00:00Z",
    venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",
    away: { abbr: "tb" }, home: { abbr: "atl" },
  },
  {
    id: "cin-ind-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T05:00:00Z",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN",
    away: { abbr: "cin" }, home: { abbr: "ind" },
  },
  {
    id: "wsh-min-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T05:00:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN",
    away: { abbr: "wsh" }, home: { abbr: "min" },
  },
  {
    id: "car-pit-2026-w16", week: 16, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2026-12-27T05:00:00Z",
    venue: "Acrisure Stadium", city: "Pittsburgh, PA",
    away: { abbr: "car" }, home: { abbr: "pit" },
  },
  {
    id: "bal-cin-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-01T01:15:00Z",
    venue: "Paycor Stadium", city: "Cincinnati, OH", broadcast: "Prime Video",
    away: { abbr: "bal" }, home: { abbr: "cin" },
  },
  {
    id: "no-atl-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T18:00:00Z",
    venue: "Mercedes-Benz Stadium", city: "Atlanta, GA",
    away: { abbr: "no" }, home: { abbr: "atl" },
  },
  {
    id: "ind-cle-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T18:00:00Z",
    venue: "Huntington Bank Field", city: "Cleveland, OH",
    away: { abbr: "ind" }, home: { abbr: "cle" },
  },
  {
    id: "nyg-dal-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T18:00:00Z",
    venue: "AT&T Stadium", city: "Arlington, TX",
    away: { abbr: "nyg" }, home: { abbr: "dal" },
  },
  {
    id: "pit-ten-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T18:00:00Z",
    venue: "Nissan Stadium", city: "Nashville, TN",
    away: { abbr: "pit" }, home: { abbr: "ten" },
  },
  {
    id: "buf-mia-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T18:00:00Z",
    venue: "Hard Rock Stadium", city: "Miami Gardens, FL",
    away: { abbr: "buf" }, home: { abbr: "mia" },
  },
  {
    id: "min-nyj-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T18:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "min" }, home: { abbr: "nyj" },
  },
  {
    id: "sea-car-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T18:00:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC",
    away: { abbr: "sea" }, home: { abbr: "car" },
  },
  {
    id: "lv-ari-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T21:05:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "lv" }, home: { abbr: "ari" },
  },
  {
    id: "det-chi-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T21:25:00Z",
    venue: "Soldier Field", city: "Chicago, IL",
    away: { abbr: "det" }, home: { abbr: "chi" },
  },
  {
    id: "phi-sf-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-04T01:20:00Z",
    venue: "Levi's Stadium", city: "Santa Clara, CA", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "phi" }, home: { abbr: "sf" },
  },
  {
    id: "hou-gb-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-05T01:15:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI", broadcast: "ABC/ESPN · Monday Night Football",
    away: { abbr: "hou" }, home: { abbr: "gb" },
  },
  {
    id: "den-ne-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T05:00:00Z",
    venue: "Gillette Stadium", city: "Foxborough, MA",
    away: { abbr: "den" }, home: { abbr: "ne" },
  },
  {
    id: "kc-lac-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T05:00:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "kc" }, home: { abbr: "lac" },
  },
  {
    id: "lar-tb-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T05:00:00Z",
    venue: "Raymond James Stadium", city: "Tampa, FL",
    away: { abbr: "lar" }, home: { abbr: "tb" },
  },
  {
    id: "wsh-jax-2026-w17", week: 17, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-03T05:00:00Z",
    venue: "EverBank Stadium", city: "Jacksonville, FL",
    away: { abbr: "wsh" }, home: { abbr: "jax" },
  },
  {
    id: "nyj-buf-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Highmark Stadium", city: "Orchard Park, NY", broadcast: "NBC · Sunday Night Football",
    away: { abbr: "nyj" }, home: { abbr: "buf" },
  },
  {
    id: "cle-cin-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Paycor Stadium", city: "Cincinnati, OH",
    away: { abbr: "cle" }, home: { abbr: "cin" },
  },
  {
    id: "lac-den-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Empower Field at Mile High", city: "Denver, CO",
    away: { abbr: "lac" }, home: { abbr: "den" },
  },
  {
    id: "det-gb-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Lambeau Field", city: "Green Bay, WI",
    away: { abbr: "det" }, home: { abbr: "gb" },
  },
  {
    id: "jax-ind-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Lucas Oil Stadium", city: "Indianapolis, IN",
    away: { abbr: "jax" }, home: { abbr: "ind" },
  },
  {
    id: "lv-kc-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Arrowhead Stadium", city: "Kansas City, MO",
    away: { abbr: "lv" }, home: { abbr: "kc" },
  },
  {
    id: "sea-lar-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "SoFi Stadium", city: "Inglewood, CA",
    away: { abbr: "sea" }, home: { abbr: "lar" },
  },
  {
    id: "chi-min-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "U.S. Bank Stadium", city: "Minneapolis, MN",
    away: { abbr: "chi" }, home: { abbr: "min" },
  },
  {
    id: "mia-ne-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Gillette Stadium", city: "Foxborough, MA",
    away: { abbr: "mia" }, home: { abbr: "ne" },
  },
  {
    id: "tb-no-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Caesars Superdome", city: "New Orleans, LA",
    away: { abbr: "tb" }, home: { abbr: "no" },
  },
  {
    id: "phi-nyg-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "MetLife Stadium", city: "East Rutherford, NJ",
    away: { abbr: "phi" }, home: { abbr: "nyg" },
  },
  {
    id: "sf-ari-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "State Farm Stadium", city: "Glendale, AZ",
    away: { abbr: "sf" }, home: { abbr: "ari" },
  },
  {
    id: "dal-wsh-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Northwest Stadium", city: "Landover, MD",
    away: { abbr: "dal" }, home: { abbr: "wsh" },
  },
  {
    id: "atl-car-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Bank of America Stadium", city: "Charlotte, NC",
    away: { abbr: "atl" }, home: { abbr: "car" },
  },
  {
    id: "pit-bal-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "M&T Bank Stadium", city: "Baltimore, MD",
    away: { abbr: "pit" }, home: { abbr: "bal" },
  },
  {
    id: "ten-hou-2026-w18", week: 18, status: "scheduled", statusDetail: "Scheduled",
    scheduledAt: "2027-01-10T05:00:00Z",
    venue: "Reliant Stadium", city: "Houston, TX",
    away: { abbr: "ten" }, home: { abbr: "hou" },
  },
];

/* Deterministic PRNG (mulberry32) — used only for the mock community-vote
   baseline below, so it's stable across reloads without a real backend. */
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
   "scheduled" games are eligible (live is happening now, not "next";
   final is done). */
function getNextUpcomingGame(now = new Date()) {
  return GAMES
    .filter((g) => g.status === "scheduled" && new Date(g.scheduledAt) >= now)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];
}
