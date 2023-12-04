const mongoose = require('mongoose');

const connectedUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model/schema
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    // You can add more fields if needed
    // For example: connectedAt - to track the time the user connected
}, {
    timestamps: true
});

const ConnectedUser = mongoose.model('ConnectedUser', connectedUserSchema);

module.exports = ConnectedUser;
