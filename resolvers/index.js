const Query = require('./query');
const Mutation = require('./mutation');
// date and time scalar type
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = {
    Query,
    Mutation,
    // To handle 'createdAt' and 'updatedAt' fields
    DateTime: GraphQLDateTime
}