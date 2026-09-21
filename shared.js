// GENERATE TIME SLOTS

const openHour = 12;
const closeHour = 19;

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};

function getAvailableTimeSlots(date, guests, reservations, tables) {
    const availableTimes = [];

    for (let hour = openHour; hour <= closeHour; hour++) {
        for ( let minute of [0, 30]) {
            if ( hour === closeHour && minute > 0) break;

            const h = String(hour).padStart(2, "0");
            const m = String(minute).padStart(2, "0");
            const timeStr = `${h}:${m}`; //generated timeslot

            const timeOption = timeToMinutes(timeStr);

            const bookedTableIds = reservations
            .filter(reservation => {
                const existingMinutes = timeToMinutes(reservation.time);
                const diffInHours = Math.abs(timeOption - existingMinutes) / 60;
                return diffInHours < 2;
            })
            .filter(reservation => {
                return reservation.date === date;
            })
            .map(reservation => reservation.table_id); 


            const suitableTable = tables.find(table => {

                const isFree = !bookedTableIds.includes(table.id);

                const sizeFits = guests <= table.seat_capacity;

                return isFree && sizeFits;
            });

            if(!suitableTable) {
                continue; // skips the inner loop and moves onto next slot
            };

            // push timeStr into availableTimes
            availableTimes.push(timeStr);

        };
    };
    return availableTimes;
};


function generateTimeSlots(selectElement) {

    for( let hour=openHour; hour <= closeHour; hour++) {
        for( let minute of [0, 30]) {
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

// GENERATE GUEST SELECT

function generateGuestoptions(selectElement) {

    for( let i=1; i <= 6; i++) {

        const option = document.createElement("option");

        option.value = i;
        option.textContent = i;

        selectElement.appendChild(option);
    };
};
