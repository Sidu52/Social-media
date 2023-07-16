// sendEmail.js
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    service: 'gmail',
    auth: {
        user: "alstonsid9@gmail.com",
        pass: "dcziouyymdzrpsxc"
    }
});

// Function to send an email with OTP
const sendOTP = async (toEmail, otp) => {
    try {
        const mailOptions = {
            from: 'alstonsid9@gmail.com',
            to: toEmail,
            subject: 'Email verification',
            text: `Your OTP for emailverfication is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

module.exports = sendOTP;
