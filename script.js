// Selecionar elementos do DOM
const newTaskInput = document.getElementById('new-task');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const filterSelect = document.getElementById('filter');

// Array para armazenar as tarefas
let tasks = [];

// Função para adicionar uma nova tarefa
function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            done: false
        };
        tasks.push(task);
        renderTasks();
        newTaskInput.value = '';
    }
}

// Função para renderizar as tarefas
function renderTasks(tasksToRender = tasks) {
    taskList.innerHTML = '';
    tasksToRender.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-id', task.id); // Adicionando o atributo data-id
        li.innerHTML = `
            <input type="checkbox" class="task-check" ${task.done ? 'checked' : ''}>
            <span class="task-text ${task.done ? 'task-done' : ''}">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            </div>
        `;

        // Adicionar event listeners
        const checkbox = li.querySelector('.task-check');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editTask(task.id));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });
}

// Função para marcar/desmarcar uma tarefa como concluída
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        renderTasks();
    }
}

/// Função para editar uma tarefa diretamente na tela
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        // Encontrar o elemento de texto da tarefa
        const taskItem = document.querySelector(`li[data-id='${id}'] .task-text`);
        
        // Criar um campo de entrada para edição
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'edit-input';
        
        // Substituir o texto pela entrada
        taskItem.replaceWith(input);
        input.focus();

        // Atualizar o texto da tarefa ao pressionar Enter ou sair do campo de entrada
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                task.text = input.value.trim();
                renderTasks();
            }
        });

        input.addEventListener('blur', () => {
            task.text = input.value.trim();
            renderTasks();
        });
    }
}

// Função para excluir uma tarefa
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

// Função para pesquisar tarefas
function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks);
}

// Função para filtrar tarefas
function filterTasks() {
    const filterValue = filterSelect.value;
    let filteredTasks;
    switch (filterValue) {
        case 'done':
            filteredTasks = tasks.filter(task => task.done);
            break;
        case 'pending':
            filteredTasks = tasks.filter(task => !task.done);
            break;
        default:
            filteredTasks = tasks;
    }
    renderTasks(filteredTasks);
}

// Adicionar event listeners
addButton.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
searchButton.addEventListener('click', searchTasks);
searchInput.addEventListener('input', searchTasks);
filterSelect.addEventListener('change', filterTasks);

// Renderizar tarefas iniciais (se houver)
renderTasks();