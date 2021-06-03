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
require('dotenv').config();

// Api port
const API_SERVER_PORT = process.env.API_SERVER_PORT || 4000;
// Database url
const DB_URL = process.env.DB_URL;

db.connect(DB_URL);
const app = express();
// Apollo server for api
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Pass models to resolvers
    context: () => {
        return { models }
    }
});

app.get('/', (req, res) => res.send('GraphQL api server for JANTA'));
server.applyMiddleware({ app, path:'/api'});

app.listen(API_SERVER_PORT , () => console.log(`GraphQL server running at http://localhost:${API_SERVER_PORT}${server.graphqlPath}`));