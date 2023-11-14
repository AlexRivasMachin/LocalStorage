document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('lista-elementos');
    const deleteButton = document.getElementById('Borrar');
    const uploadButton = document.getElementById('Subir');
    const recoverButton = document.getElementById('Recuperar');

    // Cargar tareas almacenadas en localStorage al cargar la página
    loadTasks();

    // Manejar clic en el botón "Subir Tarea"
    uploadButton.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            saveTasks();
            taskInput.value = ''; // Limpiar el campo de entrada después de agregar la tarea
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
});
