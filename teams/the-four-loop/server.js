import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const ROOT = new URL(".", import.meta.url).pathname; // .../teams/the-four-loop/
const DATA_DIR = join(ROOT, "data");
const DB_PATH = join(DATA_DIR, "sourceflow.db");

// Ensure data folder exists
try { await Deno.mkdir(DATA_DIR, { recursive: true }); } catch {}

const db = new DB(DB_PATH);

// Minimal schema for demo (you can expand later)
db.execute(`
  CREATE TABLE IF NOT EXISTS requests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    brand TEXT,
    budget_gbp REAL,
    size TEXT,
    colour TEXT,
    notes TEXT,
    status TEXT DEFAULT 'New',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function redirect(location) {
  return new Response("", { status: 303, headers: { Location: location } });
}

function htmlResponse(html) {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function layout({ title, subtitle, lead, leftButtons, chips, rightCards, content }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/app.css" />
</head>
<body>
  <div class="wrap">
    <nav class="topnav" aria-label="App navigation">
      <a href="/teams/the-four-loop/index.html">← Team Home</a>
      <a href="/teams/the-four-loop/ui.html">UI</a>
      <a href="/teams/the-four-loop/db.html">Database</a>
      <a href="/teams/the-four-loop/routes.html">Routes</a>
      <a href="/teams/the-four-loop/architecture.html">Architecture</a>
      <a href="/requests">App: Requests</a>
    </nav>

    <header class="hero">
      <div>
        <div class="pill">${escapeHtml(subtitle)}</div>
        <h1>${escapeHtml(title)}</h1>
        <p class="lede">${escapeHtml(lead)}</p>

        <div class="btnrow">
          ${leftButtons.join("")}
        </div>

        <div class="chips" aria-label="Key tags">
          ${chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join("")}
        </div>
      </div>

      <aside class="side" aria-label="Summary cards">
        ${rightCards.map(({ h, p }) => `
          <div class="card">
            <h2>${escapeHtml(h)}</h2>
            <p>${escapeHtml(p)}</p>
          </div>
        `).join("")}
      </aside>
    </header>

    ${content}

    <div class="footer">
      <a href="/requests">Back to requests</a>
    </div>
  </div>
</body>
</html>`;
}

function requestsListPage() {
  const rows = [...db.query(`
    SELECT request_id, item_name, brand, budget_gbp, status, created_at
    FROM requests
    ORDER BY request_id DESC
  `)];

  const body = `
  <section class="panel" aria-label="Requests list">
    <h2>Requests</h2>
    <p>Manage customer sourcing requests. Create and remove requests.</p>

    <div class="actions" style="margin: 10px 0 14px;">
      <a class="btn primary mini" href="/requests/new">+ New Request</a>
      <a class="btn secondary mini" href="/teams/the-four-loop/ui.html">View UI doc</a>
      <a class="btn secondary mini" href="/teams/the-four-loop/db.html">View DB doc</a>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Item</th>
          <th>Brand</th>
          <th>Budget (£)</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(([id, item, brand, budget, status, created]) => `
          <tr>
            <td>${id}</td>
            <td>${escapeHtml(item)}</td>
            <td>${escapeHtml(brand)}</td>
            <td>${budget ?? ""}</td>
            <td>${escapeHtml(status || "New")}</td>
            <td>${escapeHtml(created)}</td>
            <td>
              <form method="POST" action="/requests/${id}/delete" style="display:inline;">
                <button class="btn secondary mini" type="submit">Delete</button>
              </form>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </section>`;

  return layout({
    title: "Requests",
    subtitle: "SourceFlow • Personal Shopping Request System",
    lead: "Finished-product UI, wired to SQLite using Deno.",
    leftButtons: [
      `<a class="btn primary" href="/requests/new">Create New Request</a>`,
      `<a class="btn secondary" href="/teams/the-four-loop/index.html">Back to Docs</a>`,
    ],
    chips: ["SQLite storage", "CRUD actions", "Accessible UI", "Deno server"],
    rightCards: [
      { h: "Problem", p: "Requests get lost in DMs/spreadsheets." },
      { h: "Solution", p: "Centralised list + actions + status." },
      { h: "Outcome", p: "Cleaner tracking, faster concierge updates." },
    ],
    content: body,
  });
}

function newRequestPage() {
  const body = `
  <section class="panel" aria-label="New request form">
    <h2>Create a new request</h2>
    <p>Enter request details below. Only <strong>Item name</strong> is required.</p>

    <form method="POST" action="/requests">
      <div class="formgrid">
        <div>
          <label for="item_name">Item name (required)</label>
          <input id="item_name" name="item_name" placeholder="e.g. Dior B23 sneakers" required />
        </div>

        <div>
          <label for="brand">Brand</label>
          <input id="brand" name="brand" placeholder="e.g. Dior" />
        </div>

        <div>
          <label for="budget_gbp">Budget (GBP)</label>
          <input id="budget_gbp" name="budget_gbp" type="number" step="0.01" placeholder="e.g. 450" />
        </div>

        <div>
          <label for="size">Size</label>
          <input id="size" name="size" placeholder="e.g. UK 8 / EU 42" />
        </div>

        <div>
          <label for="colour">Colour</label>
          <input id="colour" name="colour" placeholder="e.g. Black" />
        </div>

        <div>
          <label for="status">Status</label>
          <select id="status" name="status">
            <option>New</option>
            <option>In Progress</option>
            <option>Sourced</option>
            <option>Completed</option>
          </select>
        </div>

        <div style="grid-column: 1 / -1;">
          <label for="notes">Notes</label>
          <textarea id="notes" name="notes" placeholder="Any preferences, deadline, links, etc."></textarea>
        </div>
      </div>

      <div class="actions" style="margin-top: 14px;">
        <button class="btn primary" type="submit">Submit Request</button>
        <a class="btn secondary" href="/requests">Cancel</a>
      </div>
    </form>
  </section>`;

  return layout({
    title: "New Request",
    subtitle: "SourceFlow • Customer request intake",
    lead: "Create a request and save it into SQLite (real CRUD).",
    leftButtons: [
      `<a class="btn secondary" href="/requests">Back to Requests</a>`,
      `<a class="btn secondary" href="/teams/the-four-loop/ui.html#wireframes">Wireframes</a>`,
    ],
    chips: ["Semantic form", "Labels", "POST submit", "SQLite insert"],
    rightCards: [
      { h: "Validation", p: "Item name required; clear labels." },
      { h: "Accessibility", p: "Label/for pairs + keyboard friendly." },
      { h: "Storage", p: "Saved in SQLite with timestamps." },
    ],
    content: body,
  });
}

async function readBodyForm(req) {
  const form = await req.formData();
  return Object.fromEntries(form.entries());
}

async function serveStatic(req) {
  const url = new URL(req.url);

  // Serve app.css from this folder
  if (url.pathname === "/app.css") {
    const css = await Deno.readFile(join(ROOT, "app.css"));
    return new Response(css, { headers: { "content-type": "text/css" } });
  }

  // Serve team docs + images by mapping /teams/the-four-loop/... to disk
  if (url.pathname.startsWith("/teams/the-four-loop/")) {
    const rel = url.pathname.replace("/teams/the-four-loop/", "");
    const filePath = join(ROOT, rel);
    try {
      const data = await Deno.readFile(filePath);
      const ext = extname(filePath).toLowerCase();
      const contentType =
        ext === ".css" ? "text/css" :
        ext === ".js" ? "text/javascript" :
        ext === ".png" ? "image/png" :
        ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
        ext === ".svg" ? "image/svg+xml" :
        ext === ".html" ? "text/html; charset=utf-8" :
        "application/octet-stream";
      return new Response(data, { headers: { "content-type": contentType } });
    } catch {
      return null;
    }
  }

  return null;
}

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") return redirect("/requests");

  if (url.pathname === "/requests" && req.method === "GET") {
    return htmlResponse(requestsListPage());
  }

  if (url.pathname === "/requests/new" && req.method === "GET") {
    return htmlResponse(newRequestPage());
  }

  if (url.pathname === "/requests" && req.method === "POST") {
    const { item_name, brand, budget_gbp, size, colour, notes, status } = await readBodyForm(req);
    if (!item_name || String(item_name).trim() === "") return redirect("/requests/new");

    db.query(
      `INSERT INTO requests (item_name, brand, budget_gbp, size, colour, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        String(item_name).trim(),
        brand ? String(brand) : null,
        budget_gbp ? Number(budget_gbp) : null,
        size ? String(size) : null,
        colour ? String(colour) : null,
        notes ? String(notes) : null,
        status ? String(status) : "New",
      ],
    );

    return redirect("/requests");
  }

  const delMatch = url.pathname.match(/^\/requests\/(\d+)\/delete$/);
  if (delMatch && req.method === "POST") {
    const id = Number(delMatch[1]);
    db.query(`DELETE FROM requests WHERE request_id = ?`, [id]);
    return redirect("/requests");
  }

  // Static
  const staticRes = await serveStatic(req);
  if (staticRes) return staticRes;

  return new Response("Not Found", { status: 404 });
});