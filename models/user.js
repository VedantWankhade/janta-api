const mongoose = require('mongoose');

/*
    From the GraphQL schema it looks like users store 'favorites' and 'notes', but it does NOT.
    'favorites' and 'notes' are fetched from notes collection.
*/
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: { unique: true }
        },
        email: {
            type: String,
            required: true,
            index: { unique: true }
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        }
    },
    {
        // Generate 'createdAt' and 'updatedAt' fields
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;