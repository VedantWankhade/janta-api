module.exports = {
    newNote: async (parent, args, models) => await models.Note.create({
        content: args.content,
        author: 'Me'
    }),
    deleteNote: async (parent, args, models) => {
        let a;
        try {
            a = await models.Note.findOneAndRemove({ _id: args.id });
            if (a === null)
                return "ERROR: Note does not exist";
            return "Success";
        } catch(err) {
            return "ERROR: " + err.message;
        }
    },
    updateNote: async (parent, args, models) => await models.Note.findOneAndUpdate(
        {
            _id: args.id
        },
        {
            $set: {
                content: args.content
            }
        },
        {
            new: true
        }
    )
}