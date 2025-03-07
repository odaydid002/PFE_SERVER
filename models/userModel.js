const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const createUserTable = async () => {
    await pool.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            fname VARCHAR(20) NOT NULL,
            lname VARCHAR(20) NOT NULL,
            address VARCHAR(30) NOT NULL,
            country VARCHAR(30) NOT NULL,
            wilaya VARCHAR(30) NOT NULL,
            city VARCHAR(30) NOT NULL,
            zipcode VARCHAR(10) NOT NULL,
            image VARCHAR(255) NOT NULL DEFAULT '../assets/images/user.jpg' ,
            phone VARCHAR(15) UNIQUE NOT NULL,
            account_status BOOLEAN NOT NULL DEFAULT FALSE,
            phone_status BOOLEAN NOT NULL DEFAULT FALSE,
            birthdate DATE NOT NULL,
            role VARCHAR(10) NOT NULL
        );
    `);
};

//createUserTable();

module.exports = pool;