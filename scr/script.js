document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('lista-elementos');
    const deleteButton = document.getElementById('Borrar');
    const recoverButton = document.getElementById('Recuperar');

    // Cargar tareas almacenadas en localStorage al cargar la página
    loadTasks();

    // Manejar envío del formulario
    taskForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            saveTasks();
            await sendDataToServer(taskText);
            taskInput.value = '';
        }
    });

    // Manejar clic en el botón "Borrar tareas"
    deleteButton.addEventListener('click', function () {
        saveTasks();
        clearTasks();
    });

    // Manejar clic en el botón "Recuperar Tareas"
    recoverButton.addEventListener('click', function () {
        loadTasks();
    });

    // Función para agregar una tarea a la lista
    function addTask(taskText) {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;
        taskList.appendChild(listItem);
    }

    // Función para guardar las tareas en localStorage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => task.textContent);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Función para cargar las tareas desde localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            clearTasks();
            const tasks = JSON.parse(storedTasks);
            tasks.forEach(taskText => addTask(taskText));
        }
    }

    // Función para borrar las tareas
    function clearTasks() {
        taskList.innerHTML = '';
    }

    // Función para enviar datos al servidor usando fetch y método POST
    async function sendDataToServer(taskText) {
        try {
            const response = await fetch('/index.html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskText }),
            });

            if (response.ok) {
                console.log('Datos enviados al servidor con éxito.');
            } else {
                console.error('Error al enviar datos al servidor.');
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    }
});
