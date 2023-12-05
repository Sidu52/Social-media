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
const http = require("http");
const app = express();
const port = process.env.PORT || 4000;
const User = require("./models/user");
const server = http.createServer(app);

const corsOptions = {
    origin: 'https://siddhantsharmasocialmedia.netlify.app', // Allow only requests from this domain
    // origin: 'http://192.168.139.176:5173', // Allow only requests from this domain
    // origin: 'http://192.168.29.91:5173', // Allow only requests from this domain

    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
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
        // origin: 'http://192.168.139.176:5173', // Allow only requests from this domain
        origin: "https://siddhantsharmasocialmedia.netlify.app"
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
        console.log("Sonu", users, "===", senderId)
        const receiver = users.find(user => user.id == receiverId);
        const sender = users.find(user => user.id == senderId);
        console.log("Sonu", receiver, sender)
        if (receiver) {
            const user = await User.findById(senderId);
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                receiverId,
                conversationId,
                user
            });
        }
    })

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

