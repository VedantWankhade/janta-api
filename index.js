const express = require('express');
const { ApolloServer } = require('apollo-server-express');
// Schema
const typeDefs = require('./gqlSchema');
// Resolvers
const resolvers = require('./resolvers');
// For connecting to the database
const db = require('./db');
// Database models
const models = require('./models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
// Api port
const API_SERVER_PORT = process.env.API_SERVER_PORT || 4000;
// Database url
const DB_URL = process.env.DB_URL;

// Get the user info from a JWT
const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return new Error('Session invalid');
        }
    }
}

db.connect(DB_URL);
const app = express();
// Apollo server for api
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Whenever a request is made, extract user id from jwt token passed in http headers request and pass it along with models to resolvers
    context: ({ req}) => {
        // Get the user token from the headers
        const token = req.headers.authorization;
        const user = getUser(token);
        // Requests are made twice because CORS are not set up, that's why it is logging twice
        console.log(user);
        return { models, user }
    }
});

app.get('/', (req, res) => res.send('GraphQL api server for JANTA'));
server.applyMiddleware({ app, path:'/api'});

app.listen(API_SERVER_PORT , () => console.log(`GraphQL server running at http://localhost:${API_SERVER_PORT}${server.graphqlPath}`));