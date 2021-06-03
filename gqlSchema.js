const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar DateTime
    type Note {
        # 'id' is generated and handled by mongoose as '_id' and mapped to 'id' when retrieving
        id: ID!
        content: String!
        author: String!
        # 'createdAt' and 'updatedAt' are generated and handled by mongoose (ISO Date format)
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    type Query {
        about: String
        # Returns list of notes
        notes: [Note!]!
        # Returns a note for given 'id' == '_id'
        note(id: ID!): Note!
    }
    type Mutation {
        # Creates new note, generates 'createdAt' and updatedAt' timestamps
        newNote(content: String!): Note!
        # Updates note, updates 'updatedAt' timestamp
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): String!
    }
`;