const express = require('express');
const rateLimit = require('express-rate-limit')
const cors = require('cors');

const port = 3000;
const transporter = require('./connections/mailer_conn');
const {emailSchema} = require("./schemas/joi");
const {email_user} = require("./config/dev");

const corsOptions = {
    origin: ['http://localhost:3000', 'https://antamacollective.gr'],
}

const app = express();

app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 10
}));

app.get('/', (req, res) => {
    const githubRepo = 'https://github.com/xrazis/form-endpoint';
    res.send(`<b>form-endpoint</b> handles forms for SSG. Learn more on <a href="${githubRepo}">github.com/xrazis/form-endpoint</a>.`);
});

app.post('/send-email', cors(corsOptions), async (req, res) => {
    try {
        const {name, userEmail, message, fakeField, serverEmail} = req.body;

        //Check if a fake field is filled - naive bot detection :)
        if (fakeField !== null) {
            throw new Error('Bot detected!');
        }

        //Validate against our schema
        await emailSchema.validateAsync({name, userEmail, message});

        const mail = {
            from: email_user,
            replyTo: userEmail,
            to: serverEmail,
            subject: `Source {ENTER_HOST} - inquiry from: ${name}`,
            text: message
        };

        transporter.sendMail(mail, err => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send('Email sent!');
            }
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(port, () => {
    console.debug(`form-endpoint listening on port ${port}`);
});
