// GENERATE TIME SLOTS

const openHour = 12;
const closeHour = 19;

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
