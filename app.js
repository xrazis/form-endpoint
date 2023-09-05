const express = require('express');
const rateLimit = require('express-rate-limit')
const cors = require('cors');

const port = 3000;
const transporter = require('./connections/mailer_conn');
const {emailSchema} = require("./schemas/joi");
const {email_user} = require("./config/dev");

const corsOptions = {
    origin: ['https://antamacollective.gr'],
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 10
}));

app.get('/', (req, res) => {
    const githubRepo = 'https://github.com/xrazis/form-endpoint';
    res.send(`<b>form-endpoint</b> handles forms for SSG. Learn more on <a href="${githubRepo}">github.com/xrazis/form-endpoint</a>.`);
});

app.get('/send-email', cors(corsOptions), (req, res) => {
    res.status(200).send('This route is only visible from CORS allowed origin.');
});

app.post('/send-email', cors(corsOptions), async (req, res) => {
    try {
        const {name, email, message, serverEmail} = req.body;
        const host = req.hostname;

        //Validate against our schema
        await emailSchema.validateAsync({name, email, message});

        const mail = {
            from: email_user,
            replyTo: email,
            to: serverEmail,
            subject: `Email from ${host} - inquiry from: ${name}`,
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
