const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;
const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));

const tasksOnServer = [];

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


// Ruta para subir una tarea al servidor
app.post('/uploadTask', (req, res) => {
    const taskText = req.body.task;
    // Aquí puedes procesar la tarea recibida del cliente
    console.log('Tarea recibida del cliente:', taskText);
    tasksOnServer.push(taskText);
    res.send('Tarea recibida con éxito.');
});

// Ruta para recuperar tareas del servidor
app.get('/retrieveTasks', (req, res) => {
    res.json(tasksOnServer);
});

// Ruta para borrar todas las tareas en el servidor
app.delete('/deleteTasks', (req, res) => {
    tasksOnServer.length = 0; // Borra todas las tareas en el servidor
    res.send('Todas las tareas borradas en el servidor.');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
