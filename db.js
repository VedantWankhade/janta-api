const mongoose = require('mongoose');

module.exports = {
     connect: DB_URL => {
        mongoose.set('useNewUrlParser', true);
        // Use findOneAndUpdate() instead of findAndModify()
        mongoose.set('useFindAndModify', false);
        // Use createIndex() instead of ensureIndex()
        mongoose.set("useCreateIndex", true);
        mongoose.set('useUnifiedTopology', true);
        // Connect to the database
        mongoose.connect(DB_URL);
        // Log error if failed to connect
        mongoose.connection.on('error', err => {
            console.error(err);
            console.log('Failed to connect to the database.');
        });
        mongoose.connection.on('connected', () => console.log(`Successfully connected to the database ${DB_URL}`));
    },
    close: () => {
        mongoose.connection.close();
    }
}