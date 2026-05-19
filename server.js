// creates an express application

const express = require("express");
const app = express();
const cors = require('cors');
const { Pool } = require("pg");


app.use(express.json()); // This is important! It allows us to parse JSON request bodies.

app.use(cors());

const pool = new Pool({
  database: "table_reservation"
});

// GET (output)
app.get("/", (req, res) => res.send("Hello, world!"));

app.get("/reservations", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM reservations"
    );
    res.json(result.rows);
});


// POST (input)

app.post("/reservations", async (req, res) => {
    let name = req.body.name;
    let date = req.body.date;
    let time = req.body.time;
    let guests = req.body.guests;
    const result = await pool.query(
        "INSERT INTO reservations (name, date, time, guests) VALUES ($1, $2, $3, $4) RETURNING *", 
        [name, date, time, guests]
    );
    res.json(result.rows); 
});
 
// DELETE (delete)

app.delete("/reservations/:id", async (req, res) => {
    const selectedId = Number(req.params.id); //grabs the id from url
    const result = await pool.query(
        "DELETE FROM reservations WHERE id = $1 RETURNING *", 
        [selectedId]
    );
    res.json(result.rows);    
});

// PUT (edit)

app.put("/reservations/:id", async (req, res) => {
    const selectedId = Number(req.params.id);
    const { name, date, time, guests } = req.body;
    const result = await pool.query(
        "UPDATE reservations SET name = $1, date = $2, time = $3, guests = $4 WHERE id = $5 RETURNING *",
        // set: list the columns to update and what to change the to
        [name, date, time, guests, selectedId]
    );
    res.json(result.rows);
});



const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});