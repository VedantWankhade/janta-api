const Query = require('./query');
const Mutation = require('./mutation');
const Note = require('./note');
const User = require('./user');
// date and time scalar type
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = {
    Query,
    Mutation,
    Note,
    User,
    // To handle 'createdAt' and 'updatedAt' fields
    DateTime: GraphQLDateTime
}