/*
    Seed fake data in DB.
*/

const models = require('../../models');
const seedUsers = require('./users');
const seedNotes = require('./notes');
const db = require('../../db');
require('dotenv').config();

const DB_URL = process.env.DB_URL;

const seed = async () => {
    console.log('Seeding data to the database....');
    db.connect(DB_URL);
    const users = await models.User.create(await seedUsers());
    await models.Note.create(await seedNotes(users));
    console.log('Data seeded successfully');
    process.exit(0);
}

seed();

// module.exports = seed;