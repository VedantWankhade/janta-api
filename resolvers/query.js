module.exports = {
    about: () => 'JANTA GraphQL api v1.0.0',
    notes: async (_, __, models) => await models.Note.find(),
    note: async (_, { id }, models) => models.Note.findById(id)
}