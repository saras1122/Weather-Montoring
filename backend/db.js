const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://sarasnagaria1:saras123@cluster0.v5sgb.mongodb.net/Weather?retryWrites=true&w=majority&appName=Cluster0';

async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

function disconnectDB() {
    mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
