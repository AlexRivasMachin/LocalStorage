# LocalStorage
## Material
Vamos a utilizar:
+ Index.html => para representar el cuerpo de nuestra aplicación
+ Script.js => para el manejo de los botones de la aplicación y la comunicacón con el servidor
+ Main.js => Aqui tendríamos la configuración del servidor

Software utilizado:
+ Express
+ Node
+ JavaScript
+ Html

¿Cómo iniciar la aplicación?
En la terminal escribir los siguientes comandos:

```` Terminal
npm init
npm install express
````

## ¿Que hace nuestra app?
Tenemos una interfaz muy simple, un input de texto, y tres botones.Exactamente tenemos estos tres botones:
+ Borrar teareas:
  + Borra el contenido de las tareas que tenemos guardadas en local, de forma que las podemos recuperar, ya que están guardadas en el servidor.

+ Subir tareas:
  + Sube las tareas al servidor.
  
+ Recuperar Tareas:
  + Muestra las tareas guardadas en el servidor en pantalla.

## ¿Cómo funciona?
### Main.js
Configuramos el servidor:
> + con express
> + Puerto 3001
> + Añadimos un bodyParse para manejar mejor los .json
> + path para indicar donde debe cojer la información

#### 1. ¿Cómo configuramos el bodyParser y dirigimos la estructura de la aplicación?
````
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));
````

#### 2. Creamos donde guardar los tasks
````
const tasksOnServer = [];
````

#### 3.Configuramos el comportamiento del servidor
Cuando se inicia queremos que cargue nuestra página html, para esto debe de estar situada dentro de la carpeta source como hemos indicado antes.
Para hacer eso vamos a usar sendFile(path.join(__dirname,'index.hmtl')):
````
// Ruta para servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
````
#### 4. Definimos los comportamientos
1. Post para index.html:
Este código sirve para que cuando se llama a index.html con un post este carga los datos de la varible task en taskTest.
De forma que cuando se añade una task se almacena ahi y se envía con éxito.
````JavaScript
app.post('/index.html', (req, res) => {
    const taskText = req.body.task;
    tasks.push(taskText);
    console.log('Tarea almacenada en el servidor:', taskText);
    res.send('Tarea almacenada con éxito.');
});
````
2. Post de uploadTask
Es la tarea mas compleja, esta hace que cuando llamas a la función como antes te recupera las tareas del servidor si estan borradas.
Y al hacer esto hace también un push para añadirla de forma que no se pierdan las anteriores.
````JavaScript
// Ruta para subir una tarea al servidor
app.post('/uploadTask', (req, res) => {
    const taskText = req.body.task;
    // Aquí puedes procesar la tarea recibida del cliente
    console.log('Tarea recibida del cliente:', taskText);
    tasksOnServer.push(taskText);
    res.send('Tarea recibida con éxito.');
});
````
3. Post de retrieveTasks
Recupera las taeras del servidor
````JavaScript
// Ruta para recuperar tareas del servidor
app.get('/retrieveTasks', (req, res) => {
    res.json(tasksOnServer);
});
````
   
4. Post de deleteTasks
Vacia la variable al recibir un post.
````JavaScript
app.delete('/deleteTasks', (req, res) => {
    tasksOnServer.length = 0; // Borra todas las tareas en el servidor
    res.send('Todas las tareas borradas en el servidor.');
});
````

### Index.hmtl
 ````html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <ul id="lista-elementos">

    </ul>
    
    <form id="taskForm" action="">
        Nueva tarea:
        <input type="text" id="task-input">
        <button id="Borrar" type="button">Borrar tareas</button>
        <button id="Subir" type="button">Subir Tarea</button>
        <button id="Recuperar" type="button">Recuperar Tareas</button>
    </form>
    
    <script src="script.js"></script>
</body>
</html>
````
Dos partes, la lista de los _tasks_ y los botones e input, vemos que se le añade el script.js

### Script.js
Tenemos que tener en cuenta que al ser una comunicación, no queremos que haya problemas por tanto todo nuestro código va a estar encapsulado en un listener que los habilite una vez se haya cargado toda la página.
`document.addEventListener('DOMContentLoaded', function () {}`

Vamos a usar los siguientes elementos:
````JavaScript
  const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('lista-elementos');
    const deleteButton = document.getElementById('Borrar');
    const uploadButton = document.getElementById('Subir');
    const recoverButton = document.getElementById('Recuperar');
````

Y vamos a tener los siguientes métodos:
1. RetrieveTasksFromServer
2. sendTaskToServer
3. DeleteTasksOnsERVER
4. saveTask
5. loadTasks
6. clearTasksHTML
7. addTask

#### 1. RetrieveTasksFromServer
Usamos este método para recuperar las tareas del servidor:
````JavaScript
    // Función para recuperar tareas del servidor y agregarlas a la lista en el HTML
    async function retrieveTasksFromServer() {
        try {
            const response = await fetch('/retrieveTasks');
            if (response.ok) {
                const tasksFromServer = await response.json();
                tasksFromServer.forEach(taskText => addTask(taskText));
                saveTasks(); // Guardar también en localStorage
                console.log('Tareas recuperadas del servidor con éxito.');
            } else {
                console.error('Error al recuperar tareas del servidor.');
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    }
````
###### ¿Como funciona?
+ Primero, hacemos un fetch al servidor al método de recuperar tareas.
+ Si la respuesta es si, este guarda las tareas del servidor que estan almacenadas en el .json que nos da el servidor como respuesta.
  + Por cada una añadimos al form un elemento de lista con la task
  + Luego la guarda con save task
+Si la respuesta es negativa, te da un mensaje de error.
+ También puede atrapar con el catch un error.

#### 2. sendTaskToServer
Usamos el método para enviar las tareas al servidor:
````JavaScript
async function sendTaskToServer(taskText) {
        try {
            const response = await fetch('/uploadTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskText }),
            });

            if (response.ok) {
                console.log('Tarea enviada al servidor con éxito.');
            } else {
                console.error('Error al enviar tarea al servidor.');
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    }
````
###### ¿Como funciona?
Tenemos que tener en cuenta que como parámetro le pasamos la lista de las tareas.
+ Primero hacemos fetch al servidor con el uploadTask
+ Indicamos que vamos a utilizar el método post ya que queremos enviar añgo al servidor
+ Le indicamos la estructura del .json que vamos a enviar
+ Y lo añadimos al body como una cadena de texto
+ Tras esto si la respuesta es válida se acepta
+ Si no nos da error el servidor

#### 3. Delete tasksOnserver
Método para borrar las tareas del servidor
```` JavaScript
// Función para borrar todas las tareas en el servidor
    async function deleteTasksOnServer() {
        try {
            const response = await fetch('/deleteTasks', {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Todas las tareas borradas en el servidor con éxito.');
            } else {
                console.error('Error al borrar todas las tareas en el servidor.');
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    }
````

##### ¿Cómo funciona?
+ hacemos fetch al servidor y le indicamos que queremos hacer un DELETE como es lógico.
+ Si nos válida la respuesta es que las ha borrado
+ Si no daría error

#### 4. saveTasks
````JavaScript
function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => task.textContent);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
````
##### ¿Cómo funciona?
creas un array que va a almacenar  el contenido de todos los elementos que estan dentro de la lista de las taks.
Finalmente guardas en el local storage un .json con nombre 'tasks' todos las tasks con el stringify.

#### 5. loadTasks
````JavaScript
 // Función para cargar las tareas desde localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            clearTasksHTML();
            const tasks = JSON.parse(storedTasks);
            tasks.forEach(taskText => addTask(taskText));
        }
    }
````
##### ¿Cómo funciona?
Lee las tasks que estan en el local storage y las carga en una variable. Si hay tasks, las limpia (para no duplicarlas) y haríamos un parse con las guardadas, tras esto por cada una la añadimos a la página.

#### 6. clearTasksHTML
````JavaScript
  // Función para borrar las tareas del HTML
    function clearTasksHTML() {
        taskList.innerHTML = '';
    }
````

#### 7. addTasks
````JavaScript
 // Función para agregar una tarea a la lista
    function addTask(taskText) {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;
        taskList.appendChild(listItem);
    }
````
##### ¿Cómo funciona?
+ como le pasamos como paranetro las tasks como un texto, hacemos que nuestro ul, cree un elemento li, y que el texto de este elemento sea el texto de la task.
+ Tras esto lo añadimos a la lista.
