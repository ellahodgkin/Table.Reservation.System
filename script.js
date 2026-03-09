
const form = document.getElementById('dev-form');

const result = document.getElementById('result');

let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

renderReservations();

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
form.addEventListener('submit', function (e) {
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

    reservations.push(reservation);

    localStorage.setItem("reservations", JSON.stringify(reservations));

    renderReservations();

    result.textContent = `Hello ${name}, your booking for ${guests} is confirmed for: ${date} at ${time}!`;
});


// RENDER
function renderReservations() {
    const container = document.getElementById('reservations-list');

    container.innerHTML = ""; //clear old list

    reservations.forEach(function(reservation) {

        const item = document.createElement('div');
        const remove = document.createElement('button');
        const edit = document.createElement('button');

        // RESERVATION LIST
        item.textContent = `${reservation.name} - ${reservation.date} - ${reservation.time} - ${reservation.guests}`;
        remove.textContent = 'Delete';
        edit.textContent = 'Edit';

        // DELETE
        remove.addEventListener('click', function() {
            console.log('delete clicked');

            reservations = reservations.filter(function(r) {
                return r.id !== reservation.id;
            });

            localStorage.setItem("reservations", JSON.stringify(reservations));

            renderReservations();
        });

        // EDIT
        edit.addEventListener('click', function() {
            console.log("edit clicked");

            const nameInput = document.createElement('input');
            nameInput.value = reservation.name;

            const dateInput = document.createElement('input');
            dateInput.value = reservation.date;

            const timeInput = document.createElement('select');
            generateTimeSlots(timeInput);
            timeInput.value = reservation.time;

            const guestsInput = document.createElement('select');
            generateGuestoptions(guestsInput);
            guestsInput.value = reservation.guests;

            const Save = document.createElement('button');
            Save.textContent = "Save";

            item.innerHTML = "";

            item.appendChild(nameInput);
            item.appendChild(dateInput);
            item.appendChild(timeInput);
            item.appendChild(guestsInput);
            item.appendChild(Save);

            // SAVE
            Save.addEventListener('click', function() {
                if(!nameInput.value || !dateInput.value || !timeInput.value || !guestsInput.value) return;

                reservation.name = nameInput.value;
                reservation.date = dateInput.value;
                reservation.time = timeInput.value;
                reservation.guests = guestsInput.value;

                localStorage.setItem("reservations", JSON.stringify(reservations));

                renderReservations(); 

                result.textContent = `Hello ${reservation.name}, your booking for ${reservation.guests} has been updated to: ${reservation.date} at ${reservation.time}!`;

            });

            Save.classList.add("save-btn");
            Save.classList.add("edit-buttons")
            dateInput.classList.add("dateInput");
            nameInput.classList.add("nameInput");
            timeInput.classList.add("timeInput");
            guestsInput.classList.add("guestsInput");

            nameInput.classList.add("data-input-edit");
            dateInput.classList.add("data-input-edit");
            timeInput.classList.add("data-input-edit");
            guestsInput.classList.add("data-input-edit");

        });
        
        item.appendChild(edit); //place it on the screen
        item.appendChild(remove);
        container.appendChild(item);

        edit.classList.add("edit-btn");
        remove.classList.add("delete-btn");
        edit.classList.add("edit-buttons")
        remove.classList.add("edit-buttons")



        // repeat for each reservation
    });
};
