const express = require('express');
const rateLimit = require('express-rate-limit')
const cors = require('cors');
const multer = require('multer');

const port = 3000;
const transporter = require('./connections/mailer_conn');
const {emailSchema} = require('./schemas/joi');
const {email_user} = require('./config/dev');

const corsOptions = {
    origin: ['https://antamacollective.gr'],
}

const app = express();

app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 10
}));

app.get('/', (req, res) => {
    const githubRepo = 'https://github.com/xrazis/form-endpoint';
    res.send(`<b>form-endpoint</b> handles forms for SSG. Learn more on <a href='${githubRepo}'>github.com/xrazis/form-endpoint</a>.`);
});

app.get('/send-email', cors(corsOptions), (req, res) => {
    res.send('This route is only visible from CORS allowed origin.');
});

app.post('/send-email', cors(corsOptions), multer().none(), async (req, res) => {
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

        transporter.sendMail(mail, (err, info) => {
            if (err) {
                res.sendStatus(512).send(err);
                return;
            }

            res.sendStatus(200);
        });
    } catch (err) {
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.debug(`form-endpoint listening on port ${port}`);
});
