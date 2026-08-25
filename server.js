// creates an express application

const express = require("express");
const app = express();
const cors = require('cors');
const { Pool, types } = require("pg");
types.setTypeParser(1082, (val) => val);
// "for this type just give me the raw string don't turn it into a date object"


app.use(express.json()); // This is important! It allows us to parse JSON request bodies.

app.use(cors());

const pool = new Pool({
  database: "table_reservation"
});

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};

// GET (output)
app.get("/", (req, res) => res.send("Hello, world!"));

app.get("/reservations", async (req, res) => {
    const result = await pool.query(
        "SELECT reservations.*, restaurant_tables.seat_capacity FROM reservations JOIN restaurant_tables ON reservations.table_id = restaurant_tables.id"
    );
    res.json(result.rows);
});


// POST (input)

app.post("/reservations", async (req, res) => {
    let name = req.body.name;
    let date = req.body.date;
    let time = req.body.time;
    let guests = Number(req.body.guests);

    const bookedResult = await pool.query(
        "SELECT table_id, time FROM reservations WHERE date = $1", [date]
    );

    const requestedMinutes = timeToMinutes(time);

    const bookedTableIds = bookedResult.rows
    .filter(row => {
        const existingMinutes = timeToMinutes(row.time);
        const diffInHours = Math.abs(requestedMinutes - existingMinutes) / 60;
        return diffInHours < 2;
    })
    .map(row => row.table_id);


    const tablesResult = await pool.query(
        "SELECT * FROM restaurant_tables ORDER BY seat_capacity ASC"
    );

    const allTables = tablesResult.rows; 

    // ALLOCATION LOGIC

    const suitableTable = allTables.find(table => {

        const isFree = !bookedTableIds.includes(table.id);

        const sizeFits = guests <= table.seat_capacity;

        return isFree && sizeFits;
    });


    if(!suitableTable) {
        return res.status(409).json({error: "No tables available for this time slot."});
    };

    const result = await pool.query(
        "INSERT INTO reservations (name, date, time, guests, table_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
        [name, date, time, guests, suitableTable.id]
    );

    const newResult = await pool.query(
        "SELECT reservations.*, restaurant_tables.seat_capacity FROM reservations JOIN restaurant_tables ON reservations.table_id = restaurant_tables.id"
    );
    
    res.json(newResult.rows); 
});
 
// DELETE (delete)

app.delete("/reservations/:id", async (req, res) => {
    const selectedId = Number(req.params.id); //grabs the id from url
    const result = await pool.query(
        "DELETE FROM reservations WHERE id = $1 RETURNING *", 
        [selectedId]
    );

    const newResult = await pool.query(
        "SELECT reservations.*, restaurant_tables.seat_capacity FROM reservations JOIN restaurant_tables ON reservations.table_id = restaurant_tables.id"
    );

    res.json(newResult.rows);    
});

// PUT (edit)

app.put("/reservations/:id", async (req, res) => {
    const selectedId = Number(req.params.id);
    const { name, date, time, guests } = req.body;

    const bookedResult = await pool.query(
        "SELECT id, table_id, time FROM reservations WHERE date = $1", [date]
    );

    const requestedMinutes = timeToMinutes(time);

    const bookedTableIds = bookedResult.rows
    .filter(row => {
        const existingMinutes = timeToMinutes(row.time);
        const diffInHours = Math.abs(requestedMinutes - existingMinutes) / 60;
        return diffInHours < 2 && row.id !== selectedId;
    })

    .map(row => row.table_id);


    const tablesResult = await pool.query(
        "SELECT * FROM restaurant_tables ORDER BY seat_capacity ASC"
    );

    const allTables = tablesResult.rows; 

    // ALLOCATION LOGIC

    const suitableTable = allTables.find(table => {

        const isFree = !bookedTableIds.includes(table.id);

        const sizeFits = guests <= table.seat_capacity;

        return isFree && sizeFits;
    });


    if(!suitableTable) {
        return res.status(409).json({error: "No tables available for this time slot."});
    };

    const result = await pool.query(
        "UPDATE reservations SET name = $1, date = $2, time = $3, guests = $4, table_id = $5 WHERE id = $6 RETURNING *",
        [name, date, time, guests, suitableTable.id, selectedId]
    );
    
    const newResult = await pool.query(
        "SELECT reservations.*, restaurant_tables.seat_capacity FROM reservations JOIN restaurant_tables ON reservations.table_id = restaurant_tables.id"
    );
    
    res.json(newResult.rows); 
});



const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My Table Reservation System - listening on port ${PORT}!`);
});