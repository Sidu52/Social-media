const express = require('express');
const passport = require('passport');
const router = express.Router();



const { singup, signin, emailverification, otpverification, getAlluser, loginpage, signout } = require('../controller/usercontroller');

router.get('/', getAlluser);
router.get('/login', loginpage);
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), signin);
// router.post('/signin', (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         if (err) {
//             throw err;
//         }
//         if (!user) {
//             res.status(401).send('No user found');
//         } else {
//             req.logIn(user, (err) => {
//                 if (err) {
//                     throw err;
//                 }
//                 // Handle successful login
//                 res.send('Signin successful');
//             });
//         }
//     })(req, res, next);
// });
router.post('/signup', singup);
router.post('/signout', signout)
router.post('/emailverification', emailverification)
router.post('/otpverification', otpverification)

module.exports = router;