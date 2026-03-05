
const form = document.getElementById('dev-form');

const result = document.getElementById('result');

let reservations = []

// SUBMIT
form.addEventListener('submit', function (e) {
    console.log('button clicked');

    e.preventDefault();

    const name = document.getElementById('name').value.trim();

    const date = document.getElementById('date').value;

    if (!name || !date) {
        result.textContent = "Please fill in both fields.";
        return;
    }

    const reservation = {
        id: Date.now(),
        name: name,
        date: date
    };

    reservations.push(reservation);

    renderReservations();

    result.textContent = `Hello ${name}, your booking is confirmed for ${date}!`;
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
        item.textContent = `${reservation.name} - ${reservation.date}`;
        remove.textContent = 'Delete';
        edit.textContent = 'Edit';

        // DELETE
        remove.addEventListener('click', function() {
            console.log('delete clicked');

            reservations = reservations.filter(function(r) {
                return r.id !== reservation.id;
            });

            renderReservations();
        });

        // EDIT
        edit.addEventListener('click', function() {
            console.log("edit clicked");

            const nameInput = document.createElement('input');
            nameInput.value = reservation.name;

            const dateInput = document.createElement('input');
            dateInput.value = reservation.date;

            const Save = document.createElement('button');
            Save.textContent = "Save";

            item.innerHTML = "";

            item.appendChild(nameInput);
            item.appendChild(dateInput);
            item.appendChild(Save);

            // SAVE
            Save.addEventListener('click', function() {
                if(!nameInput.value || !dateInput.value) return;

                reservation.name = nameInput.value;
                reservation.date = dateInput.value;

                renderReservations(); 

                result.textContent = `Hello ${reservation.name}, your booking has been updated to ${reservation.date}!`;

            });

            Save.classList.add("save-btn");
            dateInput.classList.add("dateInput");
            nameInput.classList.add("nameInput");

        });
        
        item.appendChild(edit); //place it on the screen
        item.appendChild(remove);
        container.appendChild(item);

        edit.classList.add("edit-btn");
        remove.classList.add("delete-btn");



        // repeat for each reservation
    });
};
