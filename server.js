const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

const steamStoreUrl = 'https://store.steampowered.com/api/featured';
const steamSearchUrl = 'https://store.steampowered.com/api/storesearch/?term=';

// CORS 미들웨어 사용
app.use(cors());

// Static files
app.use(express.static('files'));

app.get('/api/featured', async (req, res) => {
    try {
        const response = await axios.get(steamStoreUrl);
        res.json(response.data.featured_win);
    } catch (error) {
        res.status(500).send('Error fetching data from Steam API');
    }
});

app.get('/api/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send('Query parameter is required');
    }

    try {
        const response = await axios.get(`${steamSearchUrl}${encodeURIComponent(query)}&cc=us&l=english`);
        const results = response.data.items;
        if (results.length > 0) {
            const game = results[0]; // 첫 번째 결과 가져오기
            const gameDetailsResponse = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${game.id}`);
            const gameDetails = gameDetailsResponse.data[game.id.toString()];
            if (gameDetails.success) {
                res.json(gameDetails.data);
            } else {
                res.json(null);
            }
        } else {
            res.json(null);
        }
    } catch (error) {
        res.status(500).send('Error searching for game on Steam API');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
