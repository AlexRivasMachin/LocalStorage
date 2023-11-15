const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');

app.use(bodyParser.json());

const tasks = [];

// Ruta para servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/index.html', (req, res) => {
    const taskText = req.body.task;
    tasks.push(taskText);
    console.log('Tarea almacenada en el servidor:', taskText);
    res.send('Tarea almacenada con éxito.');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
