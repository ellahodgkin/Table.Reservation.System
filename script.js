
const form = document.getElementById('dev-form');

const result = document.getElementById('result');

let reservations = [];

fetch("http://localhost:3000/reservations")
.then(response => response.json())
.then(data => {
    reservations = data;
    renderReservations();

});

// GENERATE TIME SLOTS

const timeSelect = document.getElementById("time");

function generateTimeSlots(selectElement) {

    const openHour = 12;
    const closeHour = 19;

    for( let hour=openHour; hour <= closeHour; hour++) {
        for( let minute of [0, 15, 30, 45]) {
            if( hour === closeHour && minute > 0) break;

            const option = document.createElement("option");

            const h = String(hour).padStart(2, "0");
            const m = String(minute).padStart(2, "0");

            option.value = `${h}:${m}`;
            option.textContent = `${h}:${m}`;

            selectElement.appendChild(option);
        };
    };
};
generateTimeSlots(timeSelect);


// GENERATE GUEST SELECT
const guestsSelect = document.getElementById("guests");

function generateGuestoptions(selectElement) {

    for( let i=1; i <= 8; i++) {

        const option = document.createElement("option");

        option.value = i;
        option.textContent = i;

        selectElement.appendChild(option);
    };
};

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

    const response = await fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reservation)
    });

    const updatedReservations = await response.json();
    reservations = updatedReservations;
    console.log(`reservations: ${reservations}`)
    renderReservations();

    const formattedDate = new Date(date);
    const dateString = formattedDate.toLocaleDateString("en-GB");

    result.textContent = `Hello ${name}, your booking for ${guests} is confirmed for: ${dateString} at ${time}!`;
});


// HOW IT LOOKS - container
// HOW IT LOOKS - container
function renderReservations() {
    const container = document.getElementById('reservations-list');

    clearReservations(container);
    clearReservations(container);

    reservations.forEach(function(reservation) {

        const item = createReservationItem(reservation);

        container.appendChild(item);
    })
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

    return `${reservation.name} | ${dateString} | ${reservation.time} | ${reservation.guests} guests`;
};




// DELETE BUTTON 
function createDeleteButton(reservation) {

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn", "edit-btns");


    deleteButton.addEventListener('click', async function() {
        console.log('delete clicked');
        const response = await fetch(`http://localhost:3000/reservations/${reservation.id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        });
        const updatedReservations = await response.json();
        reservations = updatedReservations;

        renderReservations();
    });
        renderReservations();
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
    const nameInput = document.createElement('input');
    nameInput.classList.add("name-input", "data-input-edit");
    nameInput.value = reservation.name;

    const dateInput = document.createElement('input');
    dateInput.type = "date";
    dateInput.classList.add("date-input", "data-input-edit");
    dateInput.value = reservation.date;
    const dateInput = document.createElement('input');
    dateInput.type = "date";
    dateInput.classList.add("date-input", "data-input-edit");
    dateInput.value = reservation.date;

    const timeInput = document.createElement('select');
    generateTimeSlots(timeInput);
    timeInput.classList.add("time-input", "data-input-edit");
    timeInput.value = reservation.time;
    const timeInput = document.createElement('select');
    generateTimeSlots(timeInput);
    timeInput.classList.add("time-input", "data-input-edit");
    timeInput.value = reservation.time;

    const guestsInput = document.createElement('select');
    generateGuestoptions(guestsInput);
    guestsInput.classList.add("guests-input", "data-input-edit");
    guestsInput.value = reservation.guests;
    const guestsInput = document.createElement('select');
    generateGuestoptions(guestsInput);
    guestsInput.classList.add("guests-input", "data-input-edit");
    guestsInput.value = reservation.guests;

    const saveButton = document.createElement('button');
    saveButton.classList.add("save-btn", "edit-btns")
    saveButton.textContent = "Save";
    const saveButton = document.createElement('button');
    saveButton.classList.add("save-btn", "edit-btns")
    saveButton.textContent = "Save";

    item.innerHTML = "";
    item.innerHTML = "";

    item.append(nameInput, dateInput, timeInput, guestsInput, saveButton);
    item.append(nameInput, dateInput, timeInput, guestsInput, saveButton);

    saveButton.addEventListener("click", () => {
        updateReservation(reservation, nameInput, dateInput, timeInput, guestsInput);
    });

};


// UPDATE RESERVATION WITH INPUTS
async function updateReservation(reservation, nameInput, dateInput, timeInput, guestsInput) {

    if (!nameInput.value || !dateInput.value) return;

    reservation.name = nameInput.value;
    reservation.date = dateInput.value;
    reservation.time = timeInput.value;
    reservation.guests = guestsInput.value;
    reservation.name = nameInput.value;
    reservation.date = dateInput.value;
    reservation.time = timeInput.value;
    reservation.guests = guestsInput.value;

    const response = await fetch(`http://localhost:3000/reservations/${reservation.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reservation)
    });

    const updatedReservations = await response.json();
    reservations = updatedReservations;

    renderReservations();

    const formattedDate = new Date(reservation.date);
    const dateString = formattedDate.toLocaleDateString("en-GB");

    result.textContent = `Hello ${reservation.name}, your booking for ${reservation.guests} has been updated to: ${dateString} at ${reservation.time}!`;
};