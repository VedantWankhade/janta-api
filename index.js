const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
// For connecting to the database
const db = require('./db');
// Database models
const models = require('./models');
require('dotenv').config();

// Api port
const API_SERVER_PORT = process.env.API_SERVER_PORT || 4000;
// Database url
const DB_URL = process.env.DB_URL;

// GraphQL schema
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    
    type Query {
        about: String
        notes: [Note!]!
        note(id: ID!): Note!
    }
    
    type Mutation {
        newNote(content: String!): Note!
    }
`;

// GraphQL query resolver object
const resolvers = {
    Query: {
        about: () => 'JANTA GraphQL api v1.0.0',
        notes: async () => await models.Note.find(),
        note: async (parent, args) => models.Note.findById(args.id)
    },
    Mutation: {
        newNote: async (parent, args) => await models.Note.create({
            content: args.content,
            author: 'Me'
        })
    }
}

db.connect(DB_URL);

const app = express();
// Apollo server for api
const server = new ApolloServer({ typeDefs, resolvers });

app.get('/', (req, res) => res.send('Hello World!!!!!'));
server.applyMiddleware({ app, path:'/api' });

app.listen(API_SERVER_PORT, () => console.log(`GraphQL server running at http://localhost:${API_SERVER_PORT}${server.graphqlPath}`));