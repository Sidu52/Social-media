const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    senderuserID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    reciveruserID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
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
    viewBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
}, {
    timestamps: true
});


const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;