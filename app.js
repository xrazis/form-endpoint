const express = require('express');
const app = express();

const port = 3000;
const transporter = require('./connections/mailer_conn');
const {emailSchema} = require("./schemas/joi");
const {email_user} = require("./config/dev");

app.get('/', (req, res) => {
    const githubRepo = 'https://github.com/xrazis/form-endpoint';
    res.send(`<b>form-endpoint</b> handles forms for SSG. Learn more on <a href="${githubRepo}">github.com/xrazis/form-endpoint</a>.`);
});

//TODO Add cors - only allow specific domains

app.post('/send-email', async (req, res) => {
    console.debug(req.ip);

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
                res.status(500).send('not okeik with 500!');
            } else {
                res.status(200).send('okeik with 200!');
            }
        });
    } catch (err) {
        res.status(400).send('not okeik with 400!');
    }
});

app.listen(port, () => {
    console.debug(`form-endpoint listening on port ${port}`);
});
