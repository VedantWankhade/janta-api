module.exports = {
    newNote: async (parent, args, { models }) => await models.Note.create({
        content: args.content,
        author: 'Me'
    })
}