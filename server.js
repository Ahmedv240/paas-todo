const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

// In-Memory ToDo-Liste
const todos = [];

app.get("/", (req, res) => {
  const list = todos
    .map(
      (t, i) => `
        <li>
          ${i + 1}. ${escapeHtml(t)}
          <form method="POST" action="/delete" style="display:inline;margin-left:8px;">
            <input type="hidden" name="index" value="${i}" />
            <button type="submit">🗑️ Löschen</button>
          </form>
        </li>
      `
    )
    .join("");

  res.send(`
    <html>
      <head>
        <title>ToDo App - PaaS Demo</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <h1>📝 ToDo Web App (Azure PaaS)</h1>

        <form method="POST" action="/add">
          <input name="todo" placeholder="Neues ToDo eingeben" required />
          <button type="submit">Hinzufügen</button>
        </form>

        <h2>Liste:</h2>
        <ul>${list}</ul>
      </body>
    </html>
  `);
});

app.post("/add", (req, res) => {
  const t = (req.body.todo || "").trim();
  if (t.length > 0) todos.push(t);
  res.redirect("/");
});

// NEU: Löschen per Index
app.post("/delete", (req, res) => {
  const idx = Number.parseInt(req.body.index, 10);

  if (Number.isInteger(idx) && idx >= 0 && idx < todos.length) {
    todos.splice(idx, 1);
  }

  res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server läuft auf Port " + port));

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[m]));
}
