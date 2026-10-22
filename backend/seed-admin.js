require('dotenv').config();
const bcrypt = require('bcrypt');
const {Pool} = require('pg');

const saltRounds = 10;
const pool = new Pool({database: 'table_reservation'});

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.log("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
        return;
    };

    const hash = await bcrypt.hash(password, saltRounds);

    await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        [email, hash, 'admin']
    );

    console.log(`Created admin: ${email}`);
};

createAdmin()
.catch(error => console.log(error.message))
.finally(() => pool.end());
