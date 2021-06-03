module.exports = {
    about: () => 'JANTA GraphQL api v1.0.0',
    notes: async (parent, args, { models }) => await models.Note.find(),
    note: async (parent, args, { models }) => models.Note.findById(args.id)
}