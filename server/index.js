const express = require('express'); 
const cors = require('cors'); 
const cookieParser = require('cookie-parser'); 
const csrf = require('csurf'); 
const bodyParser = require('body-parser'); 
const sqlite3 = require('sqlite3').verbose(); 
const app = express(); 
const port = 4000; 
// Middleware 
app.use(cors({ 
origin: 'http://localhost:3000', 
credentials: true 
})); 
app.use(cookieParser()); 
app.use(bodyParser.json()); 
// CSRF Middleware 
const csrfProtection = csrf({ cookie: true }); 
app.use(csrfProtection); 
// Setup SQLite 
const db = new sqlite3.Database(':memory:'); 
db.serialize(() => { 
db.run("CREATE TABLE user_input (id INTEGER PRIMARY KEY, content TEXT)"); 
}); 
// Endpoint CSRF Token 
app.get('/api/csrf-token', (req, res) => { 
res.json({ csrfToken: req.csrfToken() }); 
}); 
// Endpoint Post Input (demo SQL Injection & CSRF) 
app.post('/api/data', (req, res) => { 
const input = req.body.input; 
// SAFE: Use parameterized query to prevent SQL Injection 
db.run("INSERT INTO user_input(content) VALUES (?)", [input], (err) => { 
if (err) return res.status(500).send("DB Error"); 
res.json({ message: "Input berhasil disimpan dengan aman!" }); 
}); 
}); 
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));