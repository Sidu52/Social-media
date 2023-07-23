const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    },
    notifictionType: {
        type: String,
    },
    status: {
        type: String,
        default: "false"
    }
}, {
    timestamps: true
});


const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;