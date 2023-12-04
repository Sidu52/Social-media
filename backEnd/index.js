require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const cookie = require('cookie-parser');
const db = require('./config/mongoose');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport-local-streegy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const app = express();
const port = process.env.PORT || 4000;
const User = require("./models/user");
const Notification = require("./models/notification");
const Conversation = require('./models/Conversation');
const { Socket } = require('socket.io');
const io = require('socket.io')(8000, {
    cors: {
        origin: 'https://siddhantsharmasocialmedia.netlify.app', // Allow only requests from this domainorigin: FrontendURL,
        // origin: 'http://192.168.139.176:5173', // Allow only requests from this domain
        // origin: 'http://192.168.29.91:5173', // Allow only requests from this domain
    }
});

app.use(cors());
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



// Set routes
app.use('/user', require('./routes/user'));
app.use('/', require('./routes/home'));
app.use('/toggle', require('./routes/post'));
app.use('/chat', require('./routes/chat'));

//Set Server
const server = app.listen(port, (err) => {
    if (err) {
        console.log('Error in server run:', err);
        return;
    }
    console.log('Server run successful for port', port);
});



// const io = require("socket.io")(server, {
//     pingTimeout: 60000,
//     cors: {
//         // origin: "http://192.168.29.91:5173",
//         origin: "http://localhost:5173",
//     },
// });

// // const connectedUsers = new Map(); // Use a separate Map for storing connected users

// // async function populateConnectedUsers() {
// //     try {
// //         const connectedUsersData = await ConnectedUser.find({});
// //         connectedUsersData.forEach(user => {
// //             console.log("object", user);
// //             connectedUsers.set(user.userId, user.socketId);
// //         });
// //         console.log("connectedUsers", connectedUsers); // Output the populated Map
// //     } catch (error) {
// //         console.error('Error populating connected users:', error);
// //     }
// // }

// // // Call the function to populate connected users when the server starts
// // populateConnectedUsers()
// //     .then(() => {
// //         // Additional code that relies on connectedUsers can go here
// //     })
// //     .catch(error => {
// //         console.error('Error populating connected users:', error);
// //     });

// let i = 0;
// io.on("connection", (socket) => {
//     console.log("Connected to socket.io");
//     console.log(i++)
//     socket.on('userLogin', async (user) => {
//         // Set user as online
//         try {
//             await User.findByIdAndUpdate(user._id, { online: true });
//             // await ConnectedUser.create({ userId: user._id, socketId: socket });
//             // connectedUsers.set(user._id, socket.id); // Update connected users Map
//             io.emit('updateUsers'); // Emit to all connected clients
//         } catch (error) {
//             console.error('Error emitting updateUsers:', error);
//         }
//     });

//     socket.on('userLogout', async (user) => {
//         // Set user as offline and remove from connected users Map
//         connectedUsers.delete(user._id);
//         try {
//             await User.findByIdAndUpdate(user._id, { online: false });
//             // await ConnectedUser.findOneAndDelete({ userId: user._id });
//             io.emit('updateUsers');
//         } catch (error) {
//             console.error('Error updating user status on logout:', error);
//         }
//     });

//     socket.on('uploadPost', async ({ user, post, type }) => {
//         try {
//             const notiy = await Notification.create({
//                 senderuserID: user._id,
//                 postID: post._id,
//                 notificationDes: `Sonu uploaded a post`,
//                 notificationType: type,
//             });
//             // Emit notification only if the user is connected on a different socket
//             io.emit('notification', { notiy });

//         } catch (err) {
//             console.error("Error creating notification:", err);
//             // Handle the error appropriately
//         }
//     });

//     // // Listen for the disconnect_request event from the client
//     // socket.on("disconnect_request", (userID) => {
//     //     // Perform actions related to disconnection
//     //     async () => {
//     //         await User.findByIdAndUpdate(userID, { online: false });
//     //         io.emit('updateUsers');
//     //     }
//     //     socket.disconnect(true); // Disconnect the socket
//     //     // Additional actions like updating user status can be done here
//     // });

//     socket.off("setup", () => {
//         console.log("USER DISCONNECTED");
//         socket.leave(userData._id);
//     });
// });