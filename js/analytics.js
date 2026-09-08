/* Analytics instrumentation stub (PRD §12). No real analytics backend yet
   — this logs a structured event and keeps a rolling log in
   sessionStorage so the events fired on a page can be inspected, without
   claiming to be wired up to a real pipeline. Swap the body of track()
   for a real analytics client later; every call site stays the same. */

function getTrafficSource() {
  const params = new URLSearchParams(location.search);
  if (params.get("src")) return params.get("src");
  const ref = document.referrer;
  if (!ref) return "direct";
  if (ref.includes("beehiiv.com") || ref.includes("newsletter")) return "newsletter";
  if (ref.includes("essentiallysports.com")) return "article";
  return "direct";
}

function track(event, props = {}) {
  const entry = {
    event,
    ts: new Date().toISOString(),
    source: getTrafficSource(),
    path: location.pathname + location.search,
    ...props,
  };
  console.info("[analytics]", entry);
  try {
    const log = JSON.parse(sessionStorage.getItem("huddle.analytics.log") || "[]");
    log.push(entry);
    sessionStorage.setItem("huddle.analytics.log", JSON.stringify(log.slice(-200)));
  } catch {
    /* sessionStorage unavailable — logging to console only */
  }
}
