const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/socialmedias'
// const url = 'mongodb+srv://Sidhu:Sidu&7879@cluster0.fca4n63.mongodb.net/As'


mongoose.connect(url);
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', () => {
    console.log("Connected to Database :: MongoDB ")
});

module.exports = db;
