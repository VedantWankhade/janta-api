module.exports = {
    about: () => 'JANTA GraphQL api v1.0.0',
    // Returns list of all notes
    notes: async (_, __, { models }) => await models.Note.find(),
    // Returns a note for given '_id'
    note: async (_, { id }, { models }) => models.Note.findById(id),
    noteFeed: async (_, { cursor }, { models }) => {
        // hardcoded limit 10
        const limit = 10;
        // set the default hasNextPage value to false
        let hasNextPage = false;
        // If no cursor is passed, the default query will be empty
        // this will pull the newst notes from DB
        let cursorQuery = {};
        // If there is a cursor
        // Our query will look for notes with an ObjectId less than that of the cursor
        if (cursor) {
            cursorQuery = { _id: { $lt: cursor } };
        }
        // find the limit + 1 of notes in DB, sorted new to old
        let notes = await models.Note.find(cursorQuery).sort({ _id: -1 }).limit(limit + 1);
        // if the number of notes exceeds our limit
        // set hasNextPage to true and trim the notes to the limit
        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }
        // the new cursor will be the mongo ObjectId of the last item in feed
        const newCursor = notes[notes.length - 1]._id;
        return {
            notes,
            cursor: newCursor,
            hasNextPage
        }
    },
    users: async (_, __, { models }) => await models.User.find({}),
    user: async (_, { username }, { models }) => await models.User.findOne({ username }),
    me: async (_, __, { models, user }) => await models.User.findById(user.id)
}