const nodemailer = require('nodemailer');

const transportador = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: {
        user: 'postmaster@sandboxc5a9087332d94d95a529fa103f5aec83.mailgun.org',
        pass: 'e0ab289b9278562bf00206803f48b33e - 6fafb9bf- c3b6a217',
    },
});

module.exports = transportador;