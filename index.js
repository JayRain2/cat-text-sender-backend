const dotenv = require('dotenv').config();
const express = require('express');
const readline = require('readline');

const app = express();
const port = process.env.port || 3000;
const reader = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send', (req, res) => {
	let status = '';

	client.messages.create({
		body: 'heres a cat!',
		from: process.env.FROM_NUMBER,
		to: req.body.number,
		mediaUrl: ['https://cataas.com/cat/says/hey'],
		statusCallback: status
	}).then(message => {
		const msgId = message.sid;
		const messageStatus = message.status;

		console.log(`${msgId} is the message ID, ${messageStatus} is the status.`)
		res.send('sending, check console');
	})
	.catch(err => {
		console.log(`err: ${err}`)
		res.send(err);
	})
})

app.listen(port);