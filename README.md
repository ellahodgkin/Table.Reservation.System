# Table Reservation System

A full-stack restaurant booking app with a customer booking page and an admin dashboard. Built with Node.js, Express, PostgreSQL and vanilla JavaScript as a learning project.

## Features

- **Customers:** book a table by date, time and party size (1-6). Only time slots with a free table are offered.
- **Admin:** create, edit and delete reservations, view a daily calendar and a table floor plan, and see reservation statistics by day, week, month or all time.
- **Automatic table allocation:** the server assigns the smallest free table that fits the party.

## Tech stack

Node.js, Express 5, PostgreSQL (`pg`), HTML, CSS, vanilla JavaScript

## Set Up Instructions

Requires Node.js and a local PostgreSQL.

### 1. Clone the repo and install dependencies

```bash
git clone https://github.com/ellahodgkin/Table.Reservation.System.git
cd Table.Reservation.System/backend
npm install
```

### 2. Create the database

```bash
createdb table_reservation
psql -d table_reservation -f db/schema.sql
```

This creates the `restaurant_tables` and `reservations` tables and fills `restaurant_tables` with the restaurant's table layout. Re-running this file resets both tables and deletes existing reservations.

### 3. Start the server

```bash
npm run dev
```

The API runs at `http://localhost:3000`. You should see `My Table Reservation System - listening on port 3000!`.

### 4. Open the app

Open `frontend/customer.html` (customer booking page) or `frontend/admin.html` (admin dashboard) in your browser.

## API

| Method | Endpoint            | Description                      |
|--------|---------------------|----------------------------------|
| GET    | `/tables`           | List all tables                  |
| GET    | `/reservations`     | List all reservations            |
| POST   | `/reservations`     | Create a reservation             |
| PUT    | `/reservations/:id` | Update a reservation             |
| DELETE | `/reservations/:id` | Delete a reservation             |

## Roadmap

- [ ] Authentication
- [ ] Customer database (name, email, phone)
- [ ] Manually move a booking to a different table
- [ ] Admin overrides

## Author

Ella Hodgkin
