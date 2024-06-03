const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/fetch', (req, res) => {
    const url = req.query.url;
    request(url).pipe(res);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
