const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        });

        console.log("mongoDB Connected...")
    } catch (err) {
        console.err(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;