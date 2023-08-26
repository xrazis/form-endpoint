const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    const githubRepo = 'https://github.com/xrazis/form-endpoint';
    res.send(`<b>form-endpoint</b> handles forms for SSG sites. Learn more on <a href="${githubRepo}">github.com/xrazis/form-endpoint</a>.`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
