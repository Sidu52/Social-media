const express = require('express');
const app = express();
const port = 9000;
const db = require('./config/mongoose');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-streegy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
// const MongoStore = require('connect-mongo')(session);
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');
const cors = require('cors');
app.use(cors());

const corsOptions = {
    origin: 'http://localhost:5173', // Allow only requests from this domain
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use cookie-parser middleware
app.use(cookie());



// Initialize Passport and session middleware
app.use(
    session({
        name: 'Alston',
        secret: 'sidhualston',
        saveUninitialized: false,
        resave: false,
        cookie: {
            // maxAge: Date.now() + 3600000,
            maxAge: (1000 * 60 * 100)
        },
        // store: new MongoStore(
        //     {
        //         mongooseConnection: db,
        //         autoRemove: 'disabled',
        //     },
        //     (err) => {
        //         console.log(err || 'Connected to MongoDB session store');
        //     }
        // ),
        store: MongoStore.create({
            mongoUrl: "mongodb://127.0.0.1:27017/socialmedias",
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

app.listen(port, (err) => {
    if (err) {
        console.log('Error in server run:', err);
        return;
    }
    console.log('Server run successful for port', port);
});

// const mongoose = require("mongoose")
// const express = require('express');
// const app = express();
// const port = 9000;
// const cors = require('cors');
// const passport = require('passport');
// const LocalStrategy = require("passport-local").Strategy;
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const nodemailer = require('nodemailer');

// mongoose.connect("mongodb://127.0.0.1:27017/socialmedias", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => {
//         console.log("Mongoose Connected");
//     })
//     .catch((err) => {
//         console.error("Mongoose Connection Error:", err);
//     });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));

// app.use(session({
//     secret: "sidhu",
//     resave: true,
//     saveUninitialized: true
// }));

// app.use(cookieParser("sidhu"));
// app.use(passport.initialize());
// app.use(passport.session());
// require('./config/passport-jwt')(passport);

// app.use(passport.initialize());
// app.use(passport.session());

// // Set routes
// app.use('/user', require('./routes/user'));
// app.use('/', require('./routes/home'));
// app.use('/toggle', require('./routes/post'));

// app.listen(port, (err) => {
//     if (err) {
//         console.log('Error in server run:', err);
//         return;
//     }
//     console.log('Server running successfully on port', port);
// });
