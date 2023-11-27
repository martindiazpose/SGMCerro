const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const dropboxV2Api = require('dropbox-v2-api');

const app = express();
const PORT = process.env.PORT || 3000;

const APP_KEY = process.env.DROPBOX_APP_KEY;
const APP_SECRET = process.env.DROPBOX_APP_SECRET;
const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN; // Puedes obtener esto durante el proceso de autorización

app.get('/auth', (req, res) => {
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${APP_KEY}&response_type=code&redirect_uri=http://localhost:${PORT}/callback`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    // El código aquí para obtener el token de acceso después de la autorización
    // ...

    res.send('Autenticación exitosa. Puedes cerrar esta ventana.');
});

app.post('/guardar-en-dropbox', async (req, res) => {
    try {
        // Aquí debes implementar la lógica para procesar los datos del formulario
        const datosFormulario = req.body;

        // Conectar con Dropbox API
        const dropbox = dropboxV2Api.authenticate({
            token: DROPBOX_ACCESS_TOKEN,
        });

        // Nombre del archivo en Dropbox
        const nombreArchivo = 'formulario.xlsx';

        // Contenido a escribir en el archivo (puedes adaptar esto según la estructura de tu Excel)
        const contenidoArchivo = `Fecha: ${datosFormulario.fecha}, Hora Comienzo: ${datosFormulario.hora_comienzo}, ...`;

        // Subir el contenido al archivo en Dropbox
        const response = await dropbox({
            resource: 'files/upload',
            parameters: {
                path: `/${nombreArchivo}`,
                mode: {
                    '.tag': 'overwrite',
                },
            },
            readStream: contenidoArchivo,
        });

        console.log('Archivo guardado en Dropbox:', response);

        res.status(200).send('Datos guardados correctamente en Dropbox');
    } catch (error) {
        console.error('Error al guardar en Dropbox:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
