const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

// In-Memory ToDo-Liste (dynamisch)
const todos = [];

app.get("/", (req, res) => {
  const list = todos.map((t, i) => `<li>${i + 1}. ${escapeHtml(t)}</li>`).join("");

  res.send(`
    <html>
      <head>
        <title>ToDo App - PaaS Demo</title>
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server läuft auf Port " + port));

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[m]));
}
