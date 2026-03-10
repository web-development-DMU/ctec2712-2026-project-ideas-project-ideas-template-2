// server.js
import { addTransaction, listTransactions } from "./data.js";

/**
 * Serve static files from ./public
 * Example: /docs/index.html -> ./public/docs/index.html
 */
async function serveStatic(pathname) {
  const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  if (cleanPath.includes("..")) {
    return null;
  }

  const fileUrl = new URL(`./public/${cleanPath}`, import.meta.url);

  try {
    const file = await Deno.readFile(fileUrl);
    const ext = cleanPath.split(".").pop()?.toLowerCase();

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

    return new Response(file, {
      status: 200,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    console.log("Static file not found:", fileUrl.href);
    console.log("Reason:", err.message);
    return null;
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

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Dynamic transactions page
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
 * Dynamic new transaction form
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

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const { pathname } = url;

  // root redirect
  if (req.method === "GET" && pathname === "/") {
    return redirect("/docs/index.html", 303);
  }

  // dynamic GET routes
  if (req.method === "GET" && pathname === "/transactions") {
    return htmlResponse(transactionsPage({ items: listTransactions() }), 200);
  }

  if (req.method === "GET" && pathname === "/transactions/new") {
    return htmlResponse(newTransactionPage(), 200);
  }

  // dynamic POST route
  if (req.method === "POST" && pathname === "/transactions") {
    const form = await req.formData();

    const amount = Number(form.get("amount"));
    const type = form.get("type");
    const category = form.get("category");
    const date = form.get("date");
    const description = form.get("description") || "";

    // validation
    if (!date || !category || !type || !Number.isFinite(amount) || amount <= 0) {
      return htmlResponse(
        newTransactionPage({
          errorMsg: "Validation failed: check amount, type, category and date."
        }),
        400
      );
    }

    // save transaction
    addTransaction({
      date: String(date),
      category: String(category),
      type: String(type),
      amount: Number(amount),
      description: String(description)
    });

    console.log("Transaction saved");

    // redirect after POST
    return new Response(null, {
      status: 303,
      headers: {
        "Location": "/transactions"
      }
    });
  }

  // static files
  const staticResponse = await serveStatic(pathname);
  if (staticResponse) return staticResponse;

  // 404
  return new Response("Not Found", { status: 404 });
}); 