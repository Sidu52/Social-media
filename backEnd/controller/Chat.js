const Conversation = require('../models/Conversation');
const Users = require('../models/user');
const Messages = require('../models/Message');


const messageGetByConversationId = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        if (!conversationId === 'new') { return res.status(200).json({ message: "Conversation Id not found" }); }
        const data = await Messages.find({ conversationId });
        const messageUserData = await Promise.all(data.map(async (message) => {
            const user = await Users.findById(message.senderId);
            return { user: { id: user._id, email: user.email, usename: user.username, avatar: user.avatar }, message: message }
        }));

        return res.status(200).json({ message: "Conversation Message finds Successfully", messageUserData });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
}

const messageCreated = async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId } = req.body;
        if (!senderId || !message) return res.status(400).json({ message: "Please fill all require fields" })
        if (!conversationId) {
            const newConversation = new Conversation({ members: [senderId, receiverId] });
            await newConversation.save();
            const newMessage = new Messages({ conversationId: newConversation._id, senderId, message });
            await newMessage.save();
            const user = await Users.findById(receiverId);
            return res.status(200).json({
                message: "New Conversation and Message created",
                user: user,
                conversationId: newConversation._id,
                newMessage: newMessage
            });
        } else if (!conversationId && !receiverId) {
            return res.status(200).json({ message: "Conversation and ReciverId not found" });
        }
        const newMessage = await Messages.create({ conversationId, senderId, message });
        const user = await Users.find({ senderId: newMessage.senderId });

        res.status(200).json({ message: "Conversation Message Created Successfully", user: { id: user._id, email: user.email, usename: user.username, avatar: user.avatar }, message: newMessage });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
}

const conversationCreate = async (req, res) => {
    try {
        const { senderId, reciverId } = req.body;
        const newConversation = new Conversation({ members: [senderId, reciverId] });
        await newConversation.save();
        res.status(200).json({ message: "Conversation Created Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
};

const conversationGetByUserID = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = await Conversation.find({ members: { $in: [userId] } });

        const conversationUserData = await Promise.all(data.map(async (conversation) => {
            try {
                const receiverId = conversation.members.find((member) => member !== userId);
                const user = await Users.findById(receiverId);
                return { user: user, conversationId: conversation._id };
            } catch (error) {
                // Handle the CastError here
                return { user: null, conversationId: conversation._id }; // Or handle the error as needed
            }
        }));

        res.status(200).json({ message: "Conversation Get Successfully", conversationUserData });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
};




module.exports = { conversationCreate, conversationGetByUserID, messageCreated, messageGetByConversationId }