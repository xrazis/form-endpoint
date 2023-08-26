const express = require('express');
const app = express();

const port = 3000;
const transporter = require('./connections/mailer_conn');

app.get('/', (req, res) => {
    const githubRepo = 'https://github.com/xrazis/form-endpoint';
    res.send(`<b>form-endpoint</b> handles forms for SSG. Learn more on <a href="${githubRepo}">github.com/xrazis/form-endpoint</a>.`);
});

app.post('/send-email', async (req, res) => {
    console.debug(req);

    try {
        const {firstName, lastName, email, phoneNumber, message} = req.body;
        await emailSchema.validateAsync({firstName, lastName, email, phoneNumber, message});

        //TODO Super complex logic to filter spam etc

        const mail = {
            from: email,
            to: email_user,
            subject: `Source ENTER-HOST - inquiry from: ${lastName} ${firstName} ${phoneNumber}`,
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
