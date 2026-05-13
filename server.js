// creates an express application

const express = require("express");
const app = express();

app.use(express.json()); // This is important! It allows us to parse JSON request bodies.

// GET (output)
app.get("/", (req, res) => res.send("Hello, world!"));

app.get("/reservations", (req, res) => res.json(reservations));

// POST (input)
app.post("/reservations", (req, res) => {
    const newReservation = req.body;
    reservations.push(newReservation);
    res.json(reservations);
});
 
// DELETE (delete)
app.delete("/reservations/:id", (req, res) => {
    console.log(req.params.id);
    const selectedId = Number(req.params.id);
    reservations = reservations.filter(function(r) {
        return r.id !== selectedId;
        // keep every reservation where the id doesn't match the one I want to delete
    });

    res.json(reservations);
});

// PUT (edit)
app.put("/reservations/:id", (req, res) => {
    const selectedId = Number(req.params.id);
    const reservationDeets = req.body;

    const reservationEdit = reservations.find(function(r) {
        return r.id === selectedId;
    });

    reservationEdit.name = reservationDeets.name;
    reservationEdit.date = reservationDeets.date;
    reservationEdit.time = reservationDeets.time;
    reservationEdit.guests = reservationDeets.guests;

    res.json(reservations);

});




const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});