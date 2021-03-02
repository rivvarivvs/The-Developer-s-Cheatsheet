const nodemailer = require('nodemailer');
const { nodemailer_user, nodemailer_password } = require('../../config');

const transporter = () {
	const client = nodemailer.createTransport('SMTP', {
		service: 'SendGrid',
		auth: {
			user: nodemailer_user,
			password: nodemailer_password,
		},
	});
    
    return client
};

const sendMail = async (email, subject, text) => {
    const mailOptions = {
        to: user.email,
        from: email,
        subject,
        text
    }

    await client.sendMail(mailOptions)
}

module.exports = {
    transporter,
    sendMail
}

