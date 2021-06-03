const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Api port
const PORT = process.env.PORT || 4000;
const app = express();

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

// Apollo server for api
const server = new ApolloServer({ typeDefs, resolvers });

app.get('/', (req, res) => res.send('Hello World!!!!!'));
server.applyMiddleware({ app, path:'/api' });

app.listen(PORT, () => console.log(`GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`));