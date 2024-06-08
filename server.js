const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS 미들웨어 사용
app.use(cors());

// Static files
app.use(express.static('files'));


// Steam API 엔드포인트
app.get('/api/featured', async (req, res) => {
    try {
        const response = await axios.get('https://store.steampowered.com/api/featured');
        res.json(response.data.featured_win);
    } catch (error) {
        console.error('Error fetching data from Steam API:', error);
        res.status(500).send('Error fetching data from Steam API');
    }
});

// Steam 검색 엔드포인트
app.get('/api/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send('Query parameter is required');
    }

    try {
        const response = await axios.get(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&cc=us&l=english`);
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
        console.error('Error searching for game on Steam API:', error);
        res.status(500).send('Error searching for game on Steam API');
    }
});

// Naver 뉴스 API 엔드포인트
app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
            params: {
                query: 'e스포츠',
                display: 10,
                sort: 'date'
            },
            headers: {
                'X-Naver-Client-Id': 'dloPTebOu4cLrqZwu8eQ',
                'X-Naver-Client-Secret': 'XW9a6SWIgJ'
            }
        });
        res.json(response.data.items);
    } catch (error) {
        console.error('Error fetching data from Naver News API:', error);
        res.status(500).send('Error fetching data from Naver News API');
    }
});



// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
