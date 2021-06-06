/*
    Generates and returns a list of 25 fake notes objects.
*/

const faker = require('faker');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const seedNotes = async users => {
    console.log('Creating fake notes....');
    let notes = [];
    // generate 25 notes
    for (let i = 0; i < 25; i++) {
        // pick a random index of user from the users array
        let random = [Math.floor(Math.random() * users.length)];
        let author = users[random];
        let content;
        // grab content from the lorem markdown api. Refer: https://jaspervdj.be/lorem-markdownum/
        const res = await fetch('https://jaspervdj.be/lorem-markdownum/markdown.txt');

        if (res.ok) {
            content = await res.text();
        } else {
            content = faker.lorem.paragraph();
        }

        let note = {
            content,
            favoriteCount: 0,
            favoritedBy: [],
            author: mongoose.Types.ObjectId(author._id)
        };
        notes.push(note);
    }
    return notes;
}

module.exports = seedNotes;