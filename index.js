const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const PORT = process.env.PORT || 4000;
const app = express();

const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello, World!'
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

app.get('/', (req, res) => res.send('Hello World!!!!!'));
server.applyMiddleware({ app, path:'/api' });

app.listen(PORT, () => console.log(`GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`));