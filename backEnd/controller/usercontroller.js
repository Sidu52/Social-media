const User = require('../models/user');
// const bcrypt = require('bcryptjs');
const emailverifed = require('..//models/emailverifed');
const sendOTP = require('../sendEmail');
const bcrypt = require('bcrypt')

//Login user
async function loginpage(req, res) {
    try {
        return res.status(201).json({ message: "user login sucessfull", data: true })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}
//Get All User
async function getAlluser(req, res) {
    try {
        const user = await User.find();

        return res.status(201).json({ message: "user find sucessfull", data: user })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

//Create User
async function singup(req, res) {
    try {
        const { username, email, password, conformpassword } = req.body;
        // Check if user with the same email or username already exists
        const userverfied = await emailverifed.findOne({ email });
        const existingUser = await User.findOne({ email });
        if (userverfied) {
            if (!existingUser && password === conformpassword) {
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Create a new user
                const newUser = new User({
                    username,
                    email,
                    password: hashedPassword,
                });

                await newUser.save();

                return res.status(201).json({ message: 'Signup successful!', data: true });
            }
            return res.status(200).json({ message: 'User already exists.', data: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

//SignIn
async function signin(req, res) {
    try {
        // const { email, password } = req.body;
        // // Check if the user exists
        // const user = await User.findOne({ email });
        // if (!user) {
        //     return res.status(401).json({ messge: 'Invalid Emails', data: false });
        // }
        // // Validate password
        // const validPassword = await bcrypt.compare(password, user.password);
        // if (!validPassword) {
        //     res.status(401).json({ message: 'Invalid username or password.', data: false });
        // }
        // // Store user information in the session
        res.status(200).json({

            message: 'Signin successful!',
            data: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

//OTP sent
async function emailverification(req, res) {
    const { email } = req.body;
    try {

        //Genrate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendOTP(req.body.email, otp);
        const Email = await emailverifed.findOne({ email });
        if (!Email) {
            const newEmail = new emailverifed({
                email: email,
                otp: otp,
                tokenExpiry: Date.now() + 120000
            });

            newEmail.save()
                .then(result => {
                    console.log("Email saved successfully!");
                    // Handle success
                })
                .catch(error => {
                    console.log("Error saving email:", error);
                    // Handle error
                });
        } else {
            emailverifed.updateOne(
                { email: email },
                {
                    otp: otp,
                    tokenExpiry: Date.now() + 120000
                }
            )
                .then(result => {
                    res.status(201).json({ message: 'OTP send successful' });
                    // Handle success
                })
                .catch(error => {
                    res.status(201).json({ message: 'Error OTP sending' });

                    // Handle error
                });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

//OTP Verfied
async function otpverification(req, res) {
    const { email, otp } = req.body;
    try {
        const Email = await emailverifed.findOne({ email });
        // console.log("Email", Email.tokenExpiry); // 1688987042232
        if (!Email) {
            return res.status(200).json({ error: "Regenerate OTP" });
        }
        const currentTimestamp = Date.now();
        if (otp == Email.otp) {
            if (Email.tokenExpiry && Email.tokenExpiry > currentTimestamp) {
                return res.status(201).json({
                    message: "User Verified",
                    data: true
                });
            } else {
                return res.status(200).json({
                    message: "Token Expired",
                    data: false
                });
            }
        }
        return res.status(200).json({
            message: "Wrong OTP",
            data: false
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

// SingOut
// signout = (req, res) => {
//     req.logout(function (err) {
//         if (err) { return console.log(err) }
//         req.session.cookie.originalMaxAge = Date.now()
//         // req.session.cookie.originalMaxAge = Date.now()

//         return res.status(201).json({ message: "User Logout" })
//     });
// }
signout = async (req, res) => {
    // req.session.cookie.maxAge = Date.now();;

    // Save the updated session
    // await req.session.save((err) => {
    // if (err) {
    //     return console.log(err);
    // }
    // return res.status(201).json({ message: "User Logout" });
    // });
    req.logout(function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred');
        }
        return res.status(201).json({ message: "User Logout" });
    });
};


module.exports = { loginpage, singup, signin, emailverification, otpverification, getAlluser, signout }