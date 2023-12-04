const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    senderuserID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    reciveruserID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    postID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    },
    notificationType: {
        type: String,
    },
    notificationDes: {
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