const express = require('express');
const passport = require('passport');
const router = express.Router();

const { updateUser, singup, signin, emailverification, otpverification, getAlluser, getOnlineuser, loginpage, signout, follower, getfollowers, contactMail } = require('../controller/usercontroller');

router.get('/', getAlluser);
router.put('/updateuser', updateUser)
router.get('/onlineuser', getOnlineuser);
router.get('/login', passport.checkAuthentication, loginpage);
router.post('/signin', signin);
router.post('/signup', singup);
router.post('/signout', signout);
router.post('/emailverification', emailverification);
router.post('/otpverification', otpverification);
router.post('/followers', follower);
router.post('/getfollowers', getfollowers)
router.post('/contactMail', contactMail)

module.exports = router;