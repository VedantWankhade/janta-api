// To encrypt password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
require('dotenv').config();
// To get gravatar url
const gravatar = require('../util/gravatar');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    // Create new note, generates 'createdAt' and 'updatedAt' timestamps
    newNote: async (_, { content }, models) => await models.Note.create({
        content: content,
        author: 'Me'
    }),
    // Deletes note
    deleteNote: async (_, { id }, models) => {
        let a;
        try {
            a = await models.Note.findOneAndRemove({ _id: id });
            if (a === null)
                return "ERROR: Note does not exist";
            return "Success";
        } catch(err) {
            return "ERROR: " + err.message;
        }
    },
    // Updates note, updates 'createdAt' timestamp
    updateNote: async (_, { id, content }, models) => await models.Note.findOneAndUpdate(
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
    ),
    // User authentication
    signUp: async (_, { username, email, password }, models) => {
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
    signIn: async (_, { username, email, password }, models) => {
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