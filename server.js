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
    // find which tables are already booked
    // give me the table_id of every reservation that matches just the date

    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

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
    // fetches every row from restaurant_tables, sorted smallest capacity first
    // means we find the smallest capacity first, not wastefully picking bigger tables

    const allTables = tablesResult.rows; 
    // array of table objects, each like {id: 7, seat_capacity: 2}

    // ALLOCATION LOGIC

    const suitableTable = allTables.find(table => {
        // .find() loops through allTables one by one and returns the first one where function inside returns true
        // when it finds a match it stops looking 
        // for each "table" being checked: 
        const isFree = !bookedTableIds.includes(table.id);
        // .includes() checks if table.id exists in that array
        // ! flips it, isFree is true only if table's id is not in that booked list
        const sizeFits = guests <= table.seat_capacity;
        // true if the group size is small enough to fit at this table
        return isFree && sizeFits;
    });


    if(!suitableTable) {
        return res.status(409).json({error: "No tables available for this time slot."});
    };
    // if .find() didn't find anything matching, suitableTable is undefined (falsy)
    // so !suitableTable is true
    // in that case, we get 409 HTTP status
    // 409 means "conflict", can't be completed due to conflicting state, here meaning "fully booked"
    // return stops function from continuing

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
    // find which tables are already booked
    // give me the table_id of every reservation that matches just the date

    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const requestedMinutes = timeToMinutes(time);

    const bookedTableIds = bookedResult.rows
    .filter(row => {
        const existingMinutes = timeToMinutes(row.time);
        const diffInHours = Math.abs(requestedMinutes - existingMinutes) / 60;
        return diffInHours < 2 && row.id !== selectedId;
    })
    // counts as blocking if it's within the 2 hours AND it's not the reservation currently being edited
    .map(row => row.table_id);


    const tablesResult = await pool.query(
        "SELECT * FROM restaurant_tables ORDER BY seat_capacity ASC"
    );
    // fetches every row from restaurant_tables, sorted smallest capacity first
    // means we find the smallest capacity first, not wastefully picking bigger tables

    const allTables = tablesResult.rows; 
    // array of table objects, each like {id: 7, seat_capacity: 2}

    // ALLOCATION LOGIC

    const suitableTable = allTables.find(table => {
        // .find() loops through allTables one by one and returns the first one where function inside returns true
        // when it finds a match it stops looking 
        // for each "table" being checked: 
        const isFree = !bookedTableIds.includes(table.id);
        // .includes() checks if table.id exists in that array
        // ! flips it, isFree is true only if table's id is not in that booked list
        const sizeFits = guests <= table.seat_capacity;
        // true if the group size is small enough to fit at this table
        return isFree && sizeFits;
    });


    if(!suitableTable) {
        return res.status(409).json({error: "No tables available for this time slot."});
    };
    // if .find() didn't find anything matching, suitableTable is undefined (falsy)
    // so !suitableTable is true
    // in that case, we get 409 HTTP status
    // 409 means "conflict", can't be completed due to conflicting state, here meaning "fully booked"
    // return stops function from continuing

    const result = await pool.query(
        "UPDATE reservations SET name = $1, date = $2, time = $3, guests = $4 WHERE id = $5 RETURNING *",
        // set: list the columns to update and what to change the to
        [name, date, time, guests, selectedId]
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