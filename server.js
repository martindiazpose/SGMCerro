const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/guardar-en-excel', (req, res) => {
    const formData = req.body;

    // Lógica para guardar los datos en el archivo Excel
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet([formData]);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Datos');

    const excelFilePath = path.join(__dirname, 'planilla.xlsx');
    xlsx.writeFile(workbook, excelFilePath);

    res.send('Datos guardados exitosamente.');
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
