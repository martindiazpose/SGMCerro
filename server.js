const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

app.post('/guardar-en-excel', (req, res) => {
    const formData = req.body;

    // Lógica para guardar los datos en la base de datos
    const sql = `
        INSERT INTO formulario_datos
        (fecha, hora_comienzo, modulo, piso, fecha_cierre, hora_fin, local, disciplina, causa_diagnostico, nombre_elemento, estado, solicitado, personal, equipo, observaciones, materiales)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        formData.fecha,
        formData.hora_comienzo,
        formData.modulo,
        formData.piso,
        formData.fecha_cierre,
        formData.hora_fin,
        formData.local,
        formData.disciplina,
        formData.causaDiagnostico,
        formData.nombre_elemento,
        formData.estado,
        formData.solicitado,
        formData.personal,
        formData.equipo,
        formData.observaciones,
        formData.materiales
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar datos en la base de datos:', err);
            res.status(500).send('Error al guardar los datos en la base de datos.');
        } else {
            console.log('Datos guardados en la base de datos.');
            res.send('Datos guardados exitosamente.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
