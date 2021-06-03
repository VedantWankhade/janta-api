module.exports = {
    // Resolve the author info for a note
    author: async (note, _, { models }) => await models.User.findById(note.author),
    // Resolve the favoritedBy info for a note
    favoritedBy: async (note, _, { models }) => await models.User.find({ _id: { $in: note.favoritedBy } })
}