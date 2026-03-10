// server.js
import { addTransaction, listTransactions } from "./data.js";

/**
 * Serves static files from ./public based on the URL pathname.
 * Example: /docs/index.html -> ./public/docs/index.html
 */
async function serveStatic(pathname) {
  const safePath = pathname.replaceAll("..", ""); // basic traversal guard
  const filePath = `./public${safePath}`;

  try {
    const file = await Deno.open(filePath, { read: true });
    const ext = filePath.split(".").pop()?.toLowerCase();

    const contentType = ({
      html: "text/html; charset=utf-8",
      css: "text/css; charset=utf-8",
      js: "application/javascript; charset=utf-8",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      svg: "image/svg+xml",
      ico: "image/x-icon",
    })[ext] ?? "application/octet-stream";

    return new Response(file.readable, {
      status: 200,
      headers: { "content-type": contentType },
    });
  } catch {
    return null; // let caller decide 404
  }
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function redirect(location, status = 303) {
  return new Response(null, {
    status,
    headers: { location },
  });
}

/**
 * A simple "view" that dynamically generates HTML for /transactions (server-rendered).
 * This is great evidence for Video 3 (HTTP) and Video 4 (architecture + HATEOAS).
 */
function transactionsPage({ items, errorMsg = "" }) {
  const rows = items.map((t) => `
    <tr>
      <td>${escapeHtml(t.date)}</td>
      <td>${escapeHtml(t.category)}</td>
      <td>${escapeHtml(t.type)}</td>
      <td>£${Number(t.amount).toFixed(2)}</td>
      <td>${escapeHtml(t.description || "")}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Budget Buddy - Transactions (Dynamic)</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <header class="container">
    <h1>Transactions (Dynamic Route)</h1>

    <nav aria-label="Primary navigation">
      <ul class="nav">
        <li><a href="/docs/index.html">Docs Home</a></li>
        <li><a href="/prototypes/dashboard.html">Prototype Dashboard</a></li>
        <li><a href="/transactions" aria-current="page">Dynamic Transactions</a></li>
        <li><a href="/transactions/new">Add Transaction (Dynamic Form)</a></li>
      </ul>
    </nav>
  </header>

  <main class="container">
    <p class="hint">
      This page is served by the Deno server. Use DevTools → Network to see <strong>GET /transactions</strong> = 200.
    </p>

    ${errorMsg ? `<div class="error" role="alert">${escapeHtml(errorMsg)}</div>` : ""}

    <div class="actions">
      <a class="btn" href="/transactions/new">Add Transaction</a>
      <a class="btn" href="/prototypes/transactions.html">Open Prototype Transactions</a>
    </div>

    <table class="table" aria-label="Transactions table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="5">No transactions yet.</td></tr>`}
      </tbody>
    </table>
  </main>
  <script src="/app.js"></script>
</body>
</html>`;
}

/**
 * A server-rendered form at /transactions/new
 * Submits POST /transactions (great for Video 3: POST + 303 redirect).
 */
function newTransactionPage({ errorMsg = "" } = {}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Budget Buddy - New Transaction (Dynamic)</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <header class="container">
    <h1>New Transaction (Dynamic Route)</h1>

    <nav aria-label="Primary navigation">
      <ul class="nav">
        <li><a href="/docs/index.html">Docs Home</a></li>
        <li><a href="/transactions">Dynamic Transactions</a></li>
        <li><a href="/transactions/new" aria-current="page">Add Transaction</a></li>
        <li><a href="/prototypes/new-transaction.html">Open Prototype Form</a></li>
      </ul>
    </nav>
  </header>

  <main class="container">
    <p class="hint">
      Submit this form to trigger <strong>POST /transactions</strong> and then a <strong>303 redirect</strong> to GET /transactions.
    </p>

    ${errorMsg ? `<div class="error" role="alert">${escapeHtml(errorMsg)}</div>` : ""}

    <form class="form" method="POST" action="/transactions">
      <div class="grid">
        <div class="field">
          <label for="amount">Amount (£)</label>
          <input id="amount" name="amount" type="number" required min="0.01" step="0.01" placeholder="e.g. 12.50" />
        </div>

        <div class="field">
          <label for="type">Type</label>
          <select id="type" name="type" required>
            <option value="">Select…</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div class="field">
          <label for="category">Category</label>
          <select id="category" name="category" required>
            <option value="">Select…</option>
            <option value="Groceries">Groceries</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
          </select>
        </div>

        <div class="field">
          <label for="date">Date</label>
          <input id="date" name="date" type="date" required />
        </div>
      </div>

      <div class="field">
        <label for="description">Description (optional)</label>
        <input id="description" name="description" type="text" maxlength="200" placeholder="Short note (max 200 chars)" />
      </div>

      <div class="actions">
        <button class="btn" type="submit">Save</button>
        <a class="btn" href="/transactions">Cancel</a>
      </div>
    </form>

    <p class="hint">
      Client-side validation is in HTML attributes. Server-side validation happens in <code>server.js</code> too.
    </p>
  </main>
  <script src="/app.js"></script>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const { pathname } = url;

  // 1) Friendly root redirect
  if (req.method === "GET" && pathname === "/") {
    return redirect("/docs/index.html", 303);
  }

  // 2) Dynamic routes (needed for assignment Video 3 + 4)
  if (req.method === "GET" && pathname === "/transactions") {
    return htmlResponse(transactionsPage({ items: listTransactions() }), 200);
  }

  if (req.method === "GET" && pathname === "/transactions/new") {
    return htmlResponse(newTransactionPage(), 200);
  }

  if (req.method === "POST" && pathname === "/transactions") {
    const form = await req.formData();
    const amountRaw = form.get("amount");
    const type = form.get("type");
    const category = form.get("category");
    const date = form.get("date");
    const description = form.get("description");

    const amount = Number(amountRaw);

    // Server-side validation (show 400 evidence)
    if (!date || !category || !type || !Number.isFinite(amount) || amount <= 0) {
      // Return 400 with the form page again (easy to demo in Video 3)
      return htmlResponse(
        newTransactionPage({ errorMsg: "Validation failed: check amount, type, category, and date." }),
        400,
      );
    }

    addTransaction({ date: String(date), category: String(category), type: String(type), amount, description: String(description ?? "") });

    // Redirect after POST (HATEOAS pattern with hypermedia navigation)
    return redirect("/transactions", 303);
  }

  // 3) Static file serving (docs/prototypes/css/js)
  // Serve /docs/... , /prototypes/... , /style.css , /app.js
  const staticResponse = await serveStatic(pathname);
  if (staticResponse) return staticResponse;

  // 4) 404 (easy marks to demonstrate)
  return new Response("Not Found", { status: 404 });
});