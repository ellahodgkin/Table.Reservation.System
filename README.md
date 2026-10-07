# Table Reservation System

A full-stack restaurant booking app with a customer booking page and an admin dashboard. Built with Node.js, Express, PostgreSQL and vanilla JavaScript as a learning project.

## Features

- **Customers:** book a table by date, time and party size (1-6). Only time slots with a free table are offered.
- **Admin:** create, edit and delete reservations, view a daily calendar and a table floor plan, and see reservation statistics by day, week, month or all time.
- **Automatic table allocation:** the server assigns the smallest free table that fits the party.

## Tech stack

Node.js, Express 5, PostgreSQL (`pg`), HTML, CSS, vanilla JavaScript

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
