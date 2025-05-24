// List of users who can login
let users = [
    { username: "groupko#7", password: "busreservedtome!" }
];

// Different types of buses with name, price, and seats
let buses = {
    luxury: [
        { busName: "Luxury-01", price: 600, availableSeats: 17 },
        { busName: "Luxury-02", price: 600, availableSeats: 18 },
        { busName: "Luxury-03", price: 600, availableSeats: 19 },
        { busName: "Luxury-04", price: 600, availableSeats: 20 }
    ],
    aircon: [
        { busName: "Aircon-11", price: 500, availableSeats: 21 },
        { busName: "Aircon-12", price: 500, availableSeats: 22 },
        { busName: "Aircon-13", price: 500, availableSeats: 23 },
        { busName: "Aircon-14", price: 500, availableSeats: 24 }
    ],
    minibus: [
        { busName: "Minibus-21", price: 400, availableSeats: 25 },
        { busName: "Minibus-22", price: 400, availableSeats: 26 },
        { busName: "Minibus-23", price: 400, availableSeats: 27 },
        { busName: "Minibus-24", price: 400, availableSeats: 28 }
    ],
    uvx: [
        { busName: "WPass-31", price: 700, availableSeats: 29 },
        { busName: "WPass-32", price: 700, availableSeats: 30 },
        { busName: "WPass-33", price: 700, availableSeats: 31 },
        { busName: "WPass-34", price: 700, availableSeats: 32 }
    ]
};

let reservations = [];

// Function to log in a user
function login() {
    let username = prompt("Enter username:");
    let password = prompt("Enter password:");
    for (let user of users) {
        if (user.username === username && user.password === password) {
            alert("Login successful!");
            return username;
        }
    }
    alert("Wrong username or password.");
    return null;
}

// Function to choose bus category and bus
function chooseCategory() {
    let category = prompt("Choose bus type (luxury, aircon, minibus, uvx):").toLowerCase();
    if (!buses[category]) {
        alert("Wrong category.");
        return null;
    }

    let info = "Available buses:\n";
    buses[category].forEach((bus, i) => {
        info += `${i + 1}. ${bus.busName} - ₱${bus.price} - Seats: ${bus.availableSeats}\n`;
    });
    alert(info);

    let index = parseInt(prompt("Pick bus number:")) - 1;
    if (isNaN(index) || index < 0 || index >= buses[category].length) {
        alert("Invalid choice.");
        return null;
    }

    return { category, busIndex: index };
}

// Function to reserve a seat
function reserveSeat(name, category, busIndex) {
    let seat = prompt("Seat number to reserve:");
    let bus = buses[category][busIndex];

    if (bus.availableSeats <= 0) {
        alert("Bus full.");
        return;
    }

    for (let r of reservations) {
        if (r.busName === bus.busName && r.seatNumber === seat) {
            alert("Seat taken.");
            return;
        }
    }

    reservations.push({
        passenger: name,
        category,
        busName: bus.busName,
        seatNumber: seat,
        price: bus.price,
        paid: false,
        paymentPhoto: null
    });

    bus.availableSeats--;
    alert("Seat reserved.");
}

// Function to cancel a reserved seat
function cancelSeat(name) {
    let busName = prompt("Bus name to cancel:").trim().toLowerCase();
    let seatNumber = prompt("Seat number to cancel:").trim();

    for (let i = 0; i < reservations.length; i++) {
        let r = reservations[i];
        if (
            r.passenger === name &&
            r.busName.toLowerCase() === busName &&
            r.seatNumber === seatNumber
        ) {
            reservations.splice(i, 1);

            for (let cat in buses) {
                for (let j = 0; j < buses[cat].length; j++) {
                    if (buses[cat][j].busName.toLowerCase() === busName) {
                        buses[cat][j].availableSeats++;
                        alert("Reservation cancelled.");
                        return;
                    }
                }
            }
        }
    }

    alert("Reservation not found.");
}

// Function to mark reservation as paid
function makePayment(name) {
    let busName = prompt("Enter Bus Name for Payment:").trim().toLowerCase();
    let seat = prompt("Enter Seat Number for Payment:").trim();
    let method = prompt("Payment method? (Cash or ATM):").toLowerCase();

    if (method !== "cash" && method !== "atm") {
        alert("Invalid payment method.");
        return;
    }

    let proof = null;
    if (method === "atm") {
        proof = prompt("Enter ATM Payment Photo or URL:");
        if (!proof) {
            alert("ATM payment requires a photo.");
            return;
        }
    }

    for (let booking of reservations) {
        if (
            booking.passenger === name &&
            booking.busName.toLowerCase() === busName &&
            booking.seatNumber === seat
        ) {
            if (booking.paid) {
                alert("This reservation has already been paid.");
                return;
            }
            booking.paid = true;
            booking.paymentPhoto = proof;
            alert("Payment Successful Via " + method.toUpperCase());
            return;
        }
    }

    alert("Reservation Not Found.");
}

// View reservations
function printReservations() {
    if (reservations.length === 0) {
        alert("No reservations.");
        return;
    }

    let result = "";
    reservations.forEach(r => {
        result += `Passenger: ${r.passenger}\nBus: ${r.busName} (${r.category})\nSeat: ${r.seatNumber}\nPrice: ₱${r.price}\nPaid: ${r.paid ? "Yes" : "No"}\nProof: ${r.paymentPhoto || "None"}\n-----\n`;
    });

    alert(result);
}

// Main menu
function main() {
    let user = login();
    if (!user) return;

    while (true) {
        let choice = prompt("Options:\n1. Reserve Seat\n2. Cancel Reservation\n3. Pay\n4. View Reservations\n5. Exit");
        if (choice === "1") {
            let selected = chooseCategory();
            if (selected) reserveSeat(user, selected.category, selected.busIndex);
        } else if (choice === "2") {
            cancelSeat(user);
        } else if (choice === "3") {
            makePayment(user);
        } else if (choice === "4") {
            printReservations();
        } else if (choice === "5") {
            alert("Thank you!");
            break;
        } else {
            alert("Invalid choice.");
        }
    }
}

// Start the app
main();
