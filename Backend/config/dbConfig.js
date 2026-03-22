const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URL

const connectdb = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to Database');
    } catch (error) {
        console.log(error);
        setTimeout(connectdb, 5000);
    }
}

module.exports = connectdb;