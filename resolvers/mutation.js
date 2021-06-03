module.exports = {
    // Create new note, generates 'createdAt' and 'updatedAt' timestamps
    newNote: async (_, { content }, models) => await models.Note.create({
        content: content,
        author: 'Me'
    }),
    // Deletes note
    deleteNote: async (_, { id }, models) => {
        let a;
        try {
            a = await models.Note.findOneAndRemove({ _id: id });
            if (a === null)
                return "ERROR: Note does not exist";
            return "Success";
        } catch(err) {
            return "ERROR: " + err.message;
        }
    },
    // Updates note, updates 'createdAt' timestamp
    updateNote: async (_, { id, content }, models) => await models.Note.findOneAndUpdate(
        {
            _id: id
        },
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )
}