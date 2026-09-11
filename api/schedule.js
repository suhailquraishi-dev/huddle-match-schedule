/* Vercel serverless function — the ONLY place DATA_API_KEY is ever read.
   The browser never sees this file's contents or the key: it calls
   /api/schedule?week=N on our own domain, and this function calls the
   real ES schedule API server-side, then forwards back a clean result.

   Set DATA_API_KEY in the Vercel project's Environment Variables (Project
   Settings → Environment Variables) — never commit it, never put it in
   any file the browser can fetch. For local `vercel dev` testing, put it
   in a `.env.local` file (already covered by .gitignore).

   If the upstream auth turns out not to be a Bearer token, change the
   single `headers` line below — everything else stays the same. */

const WEEKS_IN_SEASON = 18;

module.exports = async (req, res) => {
  const week = parseInt(req.query.week, 10);
  if (!Number.isInteger(week) || week < 1 || week > WEEKS_IN_SEASON) {
    res.status(400).json({ error: `week must be an integer between 1 and ${WEEKS_IN_SEASON}` });
    return;
  }

  const apiKey = process.env.DATA_API_KEY;
  if (!apiKey) {
    console.error("DATA_API_KEY is not set in this environment");
    res.status(500).json({ error: "Schedule service is not configured" });
    return;
  }

  try {
    const upstream = await fetch(
      `https://api.essentiallysports.com/sports-schedules/nfl/week-${week}.json`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!upstream.ok) {
      console.error(`Schedule upstream returned ${upstream.status} for week ${week}`);
      res.status(502).json({ error: "Could not load schedule data" });
      return;
    }

    const data = await upstream.json();
    // Cache at the edge for 5 minutes — schedule data doesn't change
    // second-to-second, and this keeps us from re-hitting the upstream
    // API (and its rate limits) on every page view.
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=60");
    res.status(200).json(data);
  } catch (err) {
    console.error("Schedule fetch failed:", err.message);
    res.status(502).json({ error: "Could not load schedule data" });
  }
};
