import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config(); // ✅ 로컬 개발용 (Netlify에서는 무시됨)

const app = express();
app.use(cors());
app.use(express.json());

// Do not hardcode a numeric port fallback to avoid embedding secret values in the repo
const PORT = process.env.PORT;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.MODEL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || null;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || null;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simple ICS fetch + lightweight parser (basic fields only)
app.get('/api/import-ics', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'url is required' });

  try {
    const response = await fetch(url, { timeout: 10000 });
    if (!response.ok) return res.status(502).json({ error: 'failed to fetch ics' });
    const text = await response.text();

    // Very small ICS parser: extract VEVENT blocks and basic properties
    const events = [];
    const vevents = text.split(/BEGIN:VEVENT/).slice(1);
    for (const part of vevents) {
      const block = part.split(/END:VEVENT/)[0];
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const ev = { id: null, title: null, start: null, end: null, description: null };
      for (let line of lines) {
        // unfold folded lines per RFC5545 (lines starting with space are continuations)
        if (line.startsWith(' ')) continue;
        if (line.startsWith('UID:')) ev.id = line.slice(4).trim();
        else if (line.startsWith('SUMMARY:')) ev.title = line.slice(8).trim();
        else if (line.startsWith('DTSTART')) {
          const v = line.split(':')[1];
          ev.start = v;
        } else if (line.startsWith('DTEND')) {
          const v = line.split(':')[1];
          ev.end = v;
        } else if (line.startsWith('DESCRIPTION:')) ev.description = line.slice(12).trim();
      }
      // normalize simple date strings (YYYYMMDD / YYYYMMDDTHHMMSSZ)
      function norm(d) {
        if (!d) return null;
        if (/^\d{8}T\d{6}Z$/.test(d)) return new Date(d.replace(/^(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z$/, '$1-$2-$3T$4:$5:$6Z')).toISOString();
        if (/^\d{8}T\d{6}$/.test(d)) return new Date(d.replace(/^(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})$/, '$1-$2-$3T$4:$5:$6')).toISOString();
        if (/^\d{8}$/.test(d)) return new Date(d.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')).toISOString();
        return d;
      }
      ev.start = norm(ev.start);
      ev.end = norm(ev.end);
      events.push(ev);
    }

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Google OAuth scaffolding (requires Google Cloud setup)
app.get('/api/google-auth', (req, res) => {
  if (!GOOGLE_CLIENT_ID) return res.status(501).send('Google OAuth not configured');
  const redirect = 'TODO: implement redirect to Google OAuth URL with client_id';
  res.send({ message: 'Not implemented', redirect });
});

app.get('/api/google-callback', (req, res) => {
  // This is a placeholder. To fully support Google OAuth you'd exchange code for tokens here.
  res.send({ message: 'Google callback scaffold — implement token exchange on server with client_secret' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
