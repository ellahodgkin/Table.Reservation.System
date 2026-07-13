const form = document.getElementById('dev-form');

const result = document.getElementById('result');

let reservations = [];

const timeSelect = document.getElementById("time");
const guestsSelect = document.getElementById("guests");

fetch("http://localhost:3000/reservations")
.then(response => {
    if (!response.ok) {
        throw new Error("Server Error")
    }
    return response.json()
})
.then(data => {
    reservations = data;

})
.catch(error => {
    console.log(error);
    result.textContent = "Sorry, something went wrong. Please try again."
})

generateTimeSlots(timeSelect);
generateGuestoptions(guestsSelect);

// SUBMIT
form.addEventListener('submit', async function (e) {
    console.log('button clicked');

    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;

    if (!name || !date || !time || !guests) {
        result.textContent = "Please fill in all fields.";
        return;
    }

    const reservation = {
        id: Date.now(),
        name: name,
        date: date,
        time: time,
        guests: guests
    };

    try {
        const response = await fetch("http://localhost:3000/reservations", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(reservation)
        });

        const data = await response.json(); // read body regardless of status

        if (!response.ok) {
            throw new Error(data.error || "Server Error");
        }

        reservations = data; // on success data IS the updated reservations list
        console.log(`reservations: ${reservations}`)

        const formattedDate = new Date(date);
        const dateString = formattedDate.toLocaleDateString("en-GB");

        const timeString = time.slice(0, 5);

        result.textContent = `Hello ${name}, your booking for ${guests} is confirmed for: ${dateString} at ${timeString}!`;
    } catch (error) {
        console.log(error);
        result.textContent = error.message;
        // will now contain either "no time slots available" or "server error" depending on what happened
    }
});