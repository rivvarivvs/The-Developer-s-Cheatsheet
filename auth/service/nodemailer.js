const nodemailer = require('nodemailer');
const { MAIL_USERNAME, MAIL_PASSWORD } = require('../../config');

const client = nodemailer.createTransport({
	service: 'Sendinblue',
	auth: {
		user: MAIL_USERNAME,
		pass: MAIL_PASSWORD,
	},
});

const sendMail = async (email, subject, text) => {
	const mailOptions = {
		to: email,
		from: MAIL_USERNAME,
		subject,
		text,
	};

	await client.sendMail(mailOptions);
};

module.exports = {
	sendMail,
};
