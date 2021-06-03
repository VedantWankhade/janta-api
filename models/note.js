const mongoose = require('mongoose');

/*
    Database model 'Note' will not store 'id' found in GraphQL schema.
    Instead it just stores '_id' as we know.
    But when we query for notes in GraphQL we get the same value of '_id' in 'id' variable.
    This is happening because of mongoose, when we fetch note from DB it maps value of '_id' to a virtual 'id' variable which is then used by GraphQL.
    Refer: https://mongoosejs.com/docs/guide.html#id
*/
// Define the note's database schema
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    // Assigns createdAt and updatedAt fields with a Date type
    timestamps: true
});

// Define the 'Note' model with the schema
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;