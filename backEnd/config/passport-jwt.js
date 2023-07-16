const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/user'); // Replace with your user model

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Sidhu', // Replace with your secret key for signing/verifying JWT
};

passport.use(
    new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);

            if (!user) {
                return done(null, false, { message: 'Invalid token.' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

module.exports = passport;
