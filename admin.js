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
    renderReservations();
    renderTableLabels(reservations);

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
        renderReservations();
        renderTableLabels(reservations);

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


// HOW IT LOOKS - container
function renderReservations() {
    const container = document.getElementById('reservations-list');

    clearReservations(container);

    reservations.sort((a, b) => (new Date(`${a.date}T${a.time}`))-(new Date(`${b.date}T${b.time}`)));

    reservations.forEach(function(reservation) {

        const item = createReservationItem(reservation);

        container.appendChild(item);
    });
};



// CLEAR
function clearReservations(container) {
    container.innerHTML = "";
};




//CREATE RESERVATION - item with text, edit, delete
function createReservationItem(reservation) {
    const item = document.createElement('div');
    const text = document.createElement('span');

    text.textContent = formatReservation(reservation);

    const editButton = createEditButton(reservation, item);
    const deleteButton = createDeleteButton(reservation);

    item.appendChild(text);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    return item;

};



// FORMAT RESERVATIONS
function formatReservation(reservation) {

    const formattedDate = new Date(reservation.date);
    const dateString = formattedDate.toLocaleDateString("en-GB");

    const timeString = reservation.time.slice(0, 5);

    return `${reservation.name} | ${dateString} | ${timeString} | ${reservation.guests} guests | Table ${reservation.table_id} (seats ${reservation.seat_capacity})`;
};




// DELETE BUTTON 
function createDeleteButton(reservation) {

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn", "edit-btns");


    deleteButton.addEventListener('click', async function() {
        try {
            const response = await fetch(`http://localhost:3000/reservations/${reservation.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });
            if (!response.ok) {
                throw new Error("Server Error")
            }
            const updatedReservations = await response.json();
            reservations = updatedReservations;
            renderReservations();
            renderTableLabels(reservations);
        } catch (error) {
            console.log(error);
            result.textContent = "Sorry, something went wrong. Please try again.";
        }
    });

    return deleteButton;
};



// MAKE EDIT BUTTON
function createEditButton(reservation, item) {

    const editButton = document.createElement('button');
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn", "edit-btns");

    editButton.addEventListener("click", function() {
        createEditForm(reservation, item);
    });

    return editButton;
};




// EDIT BUTTON FORM
function createEditForm(reservation, item) {
    console.log("edit clicked");

    const nameInput = document.createElement('input');
    nameInput.classList.add("name-input", "data-input-edit");
    nameInput.value = reservation.name;

    const dateInput = document.createElement('input');
    dateInput.type = "date";
    dateInput.classList.add("date-input", "data-input-edit");
    dateInput.value = reservation.date;

    const timeInput = document.createElement('select');
    generateTimeSlots(timeInput);
    timeInput.classList.add("time-input", "data-input-edit");
    timeInput.value = reservation.time.slice(0, 5);

    const guestsInput = document.createElement('select');
    generateGuestoptions(guestsInput);
    guestsInput.classList.add("guests-input", "data-input-edit");
    guestsInput.value = reservation.guests;

    const saveButton = document.createElement('button');
    saveButton.classList.add("save-btn", "edit-btns")
    saveButton.textContent = "Save";

    const cancelButton = document.createElement('button');
    cancelButton.classList.add("cancel-btn", "edit-btns");
    cancelButton.textContent = "Cancel";

    item.innerHTML = "";

    item.append(nameInput, dateInput, timeInput, guestsInput, saveButton, cancelButton);

    saveButton.addEventListener("click", () => {
        updateReservation(reservation, nameInput, dateInput, timeInput, guestsInput);
    });

    cancelButton.addEventListener("click", () => {
        renderReservations();
        renderTableLabels(reservations);
    });

};


// UPDATE RESERVATION WITH INPUTS
async function updateReservation(reservation, nameInput, dateInput, timeInput, guestsInput) {

    if (!nameInput.value || !dateInput.value) return; 

    reservation.name = nameInput.value;
    reservation.date = dateInput.value;
    reservation.time = timeInput.value;
    reservation.guests = guestsInput.value;

    try {
        const response = await fetch(`http://localhost:3000/reservations/${reservation.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(reservation)
        });
        if (!response.ok) {
            throw new Error("Server Error")
        }

        const updatedReservations = await response.json();
        reservations = updatedReservations;

        renderReservations();
        renderTableLabels(reservations);

        const formattedDate = new Date(reservation.date);
        const dateString = formattedDate.toLocaleDateString("en-GB");

        const timeString = reservation.time.slice(0, 5);

        result.textContent = `Hello ${reservation.name}, your booking for ${reservation.guests} has been updated to: ${dateString} at ${timeString}!`;

    } catch (error) {
        console.log(error);
        result.textContent = "Sorry, something went wrong. Please try again.";        
    }
};


// TABLE PLAN

function renderTableLabels(reservations) {

    const tableElements = document.querySelectorAll('.tables');

    tableElements.forEach(table => {

        const existingDisplay = table.querySelector('.displayed-reservation');
        if (existingDisplay) {
            existingDisplay.remove();
        };

        const soonestReservationDisplay = document.createElement('span');
        soonestReservationDisplay.classList.add('displayed-reservation');


        let tableNumber = Number(table.id.split('-')[1]); 
        let thisTablesReservations = reservations.filter(reservation => reservation.table_id === tableNumber);

        const comparableDate = new Date();
        let validReservations = thisTablesReservations.filter(reservation => new Date(`${reservation.date}T${reservation.time}`) >= comparableDate);
        validReservations.sort((a, b) => (new Date(`${a.date}T${a.time}`))-(new Date(`${b.date}T${b.time}`)));

        let soonestReservation = validReservations[0];

        if (soonestReservation) {
            soonestReservationDisplay.textContent = formatTableLabel(soonestReservation);
        } else {
            soonestReservationDisplay.textContent = "No upcoming bookings";
        };

        table.appendChild(soonestReservationDisplay);

    });
};

function formatTableLabel(reservation) {

    const formattedDate = new Date(reservation.date);
    const dateString = formattedDate.toLocaleDateString("en-GB");
    const dateStringFinal = dateString.slice(0,5);

    const timeString = reservation.time.slice(0, 5);

    return `${reservation.name} | ${dateStringFinal} | ${timeString} | ${reservation.guests} guests`;
};
