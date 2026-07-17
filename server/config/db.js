const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI is not defined in .env file!');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
<<<<<<< HEAD
=======
        console.warn(`MongoDB Connection Error: ${error.message}. Falling back to local file database.`);
        setupMockMongoose();
>>>>>>> 8ddb45db2e082b68ad8c1dbdd903281845fde9bb
    }
};

module.exports = connectDB;