require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');

const app = express();
const PORT = process.env.PORT || 3000;

const APP_KEY = process.env.DROPBOX_APP_KEY;
const APP_SECRET = process.env.DROPBOX_APP_SECRET;

app.get('/auth', (req, res) => {
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${APP_KEY}&response_type=code&redirect_uri=http://localhost:${PORT}/callback`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;

    const tokenUrl = 'https://api.dropbox.com/oauth2/token';
    const credentials = btoa(`${APP_KEY}:${APP_SECRET}`);
    const body = `code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:${PORT}/callback`;

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
        },
        body: body
    });

    const data = await response.json();
    const accessToken = data.access_token;

    // Puedes almacenar accessToken en tus variables de entorno o base de datos
    console.log('Access Token:', accessToken);

    res.send('Autenticación exitosa. Puedes cerrar esta ventana.');
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
