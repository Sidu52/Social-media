require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const cookie = require('cookie-parser');
const db = require('./config/mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport-local-streegy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const flash = require('express-flash');
const http = require("http");
const app = express();
const port = process.env.PORT || 4000;
const User = require("./models/user");
const Post = require("./models/post");
const Messages = require("./models/Message")
const server = http.createServer(app);
const Notification = require('./models/notification');

// const corsOptions = {
//     origin: [
//         'http://localhost:5173',
//         'http://192.168.29.91:5173',
//         'https://siddhantsharmasocialmedia.netlify.app',
//         'http://192.168.139.176:5173',
//         'http://192.168.235.176:8090'
//     ],
//     optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookie());// Use cookie-parser middleware

// Initialize Passport and session middleware
app.use(
    session({
        name: 'Alston',
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000 * 60 * 100)
        },

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            autoRemove: 'disabled'
        },
            (err) => {
                console.log(err || 'connect-mongo setup ok')
            }
        )
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
// Set routes
app.use('/user', require('./routes/user'));
app.use('/', require('./routes/home'));
app.use('/toggle', require('./routes/post'));
app.use('/chat', require('./routes/chat'));

app.use(cors());

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: [
            'http://localhost:5173',
            'http://192.168.29.91:5173',
            'https://siddhantsharmasocialmedia.netlify.app',
            'http://192.168.139.176:5173'
        ],
    },
});
//Socket.io
let users = [];
io.on('connection', socket => {
    console.log("User connected", socket.id)
    socket.on('addUser', async id => {
        const isUserExist = users.find(user => user.id === id);
        if (!isUserExist) {
            const user = { id, socketId: socket.id };
            users.push(user);
            // Emitting the updated user list to all clients
            io.emit('getUsers', users);

            // Fetch online users from the User model based on their IDs
            try {
                const onlineUsers = await User.find({ _id: { $in: users.map(u => u.id) } });
                // Emit the list of online users to the client who just connected
                io.emit('getOnlineUsers', onlineUsers);
            } catch (error) {
                console.error('Error fetching online users:', error);
            }
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.id == receiverId);
        const sender = users.find(user => user.id == senderId);
        if (receiver) {
            const user = await User.findById(senderId);
            const data = await Messages.find({ message });
            const messageUserData = { user: { id: user._id, email: user.email, usename: user.username, avatar: user.avatar }, message: data }
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                receiverId,
                conversationId,
                messageUserData
            });
        }
    })
    socket.on('inputfocus', async ({ receiverId, value }) => {
        console.log(receiverId)
        const receiver = users.find(user => user.id == receiverId);
        io.to(receiver?.socketId).emit('inputfocusserver', value);
    })


    socket.on('notificationsend', async ({ senderuserID, reciveruserID, notificationDes, postID, notificationType, viewBy }) => {
        try {
            const data = await Notification.create({
                senderuserID,
                reciveruserID,
                notificationDes,
                postID,
                notificationType,
                viewBy
            });
            const fromUser = await User.findById(data.senderuserID);
            const post = await Post.findById(postID);
            await reciveruserID.map(async receiver => {
                const receiverUser = users.find(user => user.id == receiver);
                if (receiverUser && receiverUser.socketId) {

                    io.to(receiverUser.socketId).emit('getNotification', { notification: data, fromUser, post });
                } else {
                    console.log(`User ${receiver} not found or no socket ID`);
                    // Handle the case where the user is not found or has no socket ID
                }
            });
            console.log("Notifications sent");
        } catch (err) {
            console.error("Error:", err);
            // Handle any potential errors while creating notifications or emitting to sockets
        }
    });


    socket.on('calluser', (userToCall, signalData, from, name) => {
        io.to(userToCall).emit(["calluser", { signal: signalData, from, name }]);

    });
    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    })

    socket.on('callUser', (roomID, from, to) => {
        io.to(rooms[roomID][to]).emit('incomingCall', { from, to });
    });

    socket.on('acceptCall', (roomID, from, to) => {
        io.to(rooms[roomID][from]).emit('callAccepted', { from, to });
    });



    //Video Calling Socket
    // socket.on("callsend", async (data) => {
    //     const { senderId, receiverId, offer } = data;
    //     const user = await User.findById(senderId);
    //     const receiver = users.find(user => user.id == receiverId);
    //     io.to(receiver?.socketId).emit("IncomingCall", { user, senderId, offer });
    // });
    // socket.on("callAccepted", async (data) => {
    //     const { senderId, receiverId, ans } = data;

    //     await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

    //     // const user = await User.findById(senderId);
    //     // const sender = users.find(user => user.id == senderId);
    //     // const receiver = users.find(user => user.id == receiverId);
    //     // io.to(receiver?.socketId).emit("callAccept", { user, senderId, ans });
    // });

    // socket.on("peer:nego:needed", async ({ to, offer }) => {
    //     const receiver = users.find(user => user.id == to);
    //     io.to(receiver.socketId).emit("peer:nego:needed", { offer });
    // });

    // socket.on("peer:nego:done", ({ to, ans }) => {
    //     console.log("object", to, ans)
    //     const receiver = users.find(user => user.id == to);
    //     io.to(receiver.senderId).emit("peer:nego:final", { ans });
    // });


    socket.on('disconnect', async () => {
        users = users.filter(user => user.socketId !== socket.id)
        io.emit('getUsers', users)
        // Fetch online users from the User model based on their IDs
        try {
            const onlineUsers = await User.find({ _id: { $in: users.map(u => u.id) } });
            // Emit the list of online users to the client who just connected
            io.emit('getOnlineUsers', onlineUsers);
        } catch (error) {
            console.error('Error fetching online users:', error);
        }
    })
})

