const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async function (email, password, done) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Invalid email.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid password.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
});

passport.checkAuthentication = (req, res, next) => {
    console.log('1', req.user)
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

passport.setAuthenticatedUser = (req, res, next) => {

    if (req.isAuthenticated()) {
        console.log("2", req.user)
        res.cookie('user', req.user);
    }
    next();
};

module.exports = passport;


// const passport = require("passport");
// const User = require("../models/user");
// const bcrypt = require("bcryptjs");
// const localStrategy = require("passport-local").Strategy;

// module.exports = function (passport) {
//     passport.use(
//         new localStrategy((username, password, done) => {
//             User.findOne({ username: username }, (err, user) => {
//                 if (err) throw err;
//                 if (!user) return done(null, false);
//                 bcrypt.compare(password, user.password, (err, result) => {
//                     if (err) throw err;
//                     if (result === true) {
//                         return done(null, user);
//                     } else {
//                         return done(null, false);
//                     }
//                 });
//             });
//         })
//     );
// }
// passport.serializeUser((user, cd) => {
//     cb(null, user.id);
// });

// passport.deserializeUser((id, cb) => {
//     User.findOne({ _id: id }, (err, user) => {
//         cb(err, user);
//     });
// })