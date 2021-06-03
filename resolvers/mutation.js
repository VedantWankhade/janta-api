// To encrypt password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
require('dotenv').config();
// To get gravatar url
const gravatar = require('../util/gravatar');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    // Create new note, generates 'createdAt' and 'updatedAt' timestamps
    newNote: async (_, { content }, { models, user }) => {
        // If no user in context, throw and authenitcation error
        if (!user) {
            throw new AuthenticationError("You must be signed in to create a note");
        }
        // Else create note w/ author as mongodb 'ObjectId(user.id)'
        return await models.Note.create({
            content: content,
            // Reference the author's mongodb id
            author: mongoose.Types.ObjectId(user.id)
        })
    },
    // Deletes note
    deleteNote: async (_, { id }, { models, user }) => {
        // if not a user, throw and authentication error
        if (!user) {
            throw new AuthenticationError('You must be signed in to delete a note');
        }
        // find the note
        const note = await models.Note.findById(id);
        if (!note) {
            throw new Error('Note does not exist');
        }
        // If the note does not exists or note owner and current user don't match, throw a forbidden error
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError(`You don't have permissions to delete the note`);
        }
        try {
            // Everything fine, remove the note
            await note.remove();
            return "Success";
        } catch(err) {
            return "ERROR: " + err.message;
        }
    },
    // Updates note, updates 'createdAt' timestamp
    updateNote: async (_, { id, content }, { models, user }) => {
        // If not a user, throw an authentication error
        if (!user) {
            throw new AuthenticationError('You must be signed in to update a note');
        }
        // find the note
        const note = await models.Note.findById(id);
        if (!note) {
            throw new Error('Note does not exist')
        }
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError(`You don't have permissions to update the note`);
        }
        // Update the note and return
        return await models.Note.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },
    toggleFavorite: async (_, { id }, { models, user }) => {
        // If no user, auth error
        if (!user) {
            throw new AuthenticationError('You must be signed in to favorite the note');
        }
        // Check if the user has already favorited the note
        let noteCheck = await models.Note.findById(id);
        const hasUser = noteCheck.favoritedBy.indexOf(user.id);
        // If the user exists in favoritedBy list
        // remove them from the list and reduce the favioriteCount by 1
        if (hasUser >= 0) {
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    new: true
                }
            );
        } else {
            // If user not in list
            // add them and increment favoriteCount by 1
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    new: true
                }
            );
        }
    },
    // User authentication
    signUp: async (_, { username, email, password }, { models }) => {
        // Convert email to a more maintanable format
        email = email.trim().toLowerCase();
        // Hash the password
        const hashed = await bcrypt.hash(password, /* salt */10);
        // Create the gravatar url
        const avatar = gravatar(email);

        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });
            return jwt.sign({ id: user._id }, JWT_SECRET);
        } catch (err) {
            console.error(err);
            throw new Error('Error creating account');
        }
    },
    signIn: async (_, { username, email, password }, { models }) => {
        if (email) {
            // Convert email into format similiar to the one in DB
            email = email.trim().toLowerCase();
        }
        // Find user in DB by email or username or both
        const user = await models.User.findOne({
            $or: [{ email }, { username }]
        });
        // If user is not found, throw an authentication error
        if (!user) {
            throw new AuthenticationError('User account not found');
        }
        // If passwords don't match, throw an authentication error
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError('Wrong password');
        }
        // Else create and return the jwt
        return jwt.sign({ id: user._id }, JWT_SECRET);
    }
}