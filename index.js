const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./db');
require('dotenv').config();

// Api port
const API_SERVER_PORT = process.env.API_SERVER_PORT || 4000;
// Database url
const DB_URL = process.env.DB_URL;

// Temporary in memory data for notes list
let notes = [
    { id: '1', content: 'Note by A', author: 'A' },
    { id: '2', content: 'Note by B', author: 'B' },
    { id: '3', content: 'Not eby C', author: 'C' }
];

// GraphQL schema
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    
    type Query {
        hello: String
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
        hello: () => 'Hello, World!',
        notes: () => notes,
        note: (parent, args) => notes.find(note => note.id === args.id)
    },
    Mutation: {
        newNote: (parent, args) => {
            let newNote = {
                id: String(notes.length + 1),
                content: args.content,
                author: "Me"
            };
            notes.push(newNote);
            return newNote;
        }
    }
}

db.connect(DB_URL);

const app = express();
// Apollo server for api
const server = new ApolloServer({ typeDefs, resolvers });

app.get('/', (req, res) => res.send('Hello World!!!!!'));
server.applyMiddleware({ app, path:'/api' });

app.listen(API_SERVER_PORT, () => console.log(`GraphQL server running at http://localhost:${API_SERVER_PORT}${server.graphqlPath}`));