module.exports = {
    about: () => 'JANTA GraphQL api v1.0.0',
    // Returns list of all notes
    notes: async (_, __, { models }) => await models.Note.find(),
    // Returns a note for given '_id'
    note: async (_, { id }, { models }) => models.Note.findById(id)
}