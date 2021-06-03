module.exports = {
    // Resolve a list of notes for a user
    notes: async (user, _, { models }) => await models.Note.find({ author: user._id }).sort({ _id: -1 }),
    // Resolve the list of favorites for a user
    favorites: async (user, _, { models }) => await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 })
}