let todos = [];
let todoToDelete = null; 
let undoTimeout = null; 
let currentFilter = 'all'; 

// Adds a new todo to the list
function addTodo(text) {
    if (text.trim() === "") return;

    const newTodo = {
        id: Date.now(),
        text,
        completed: false,
    };
    todos.push(newTodo);
    document.getElementById('newTodoInput').value = '';
    renderTodos(currentFilter);
}

// Allows editing of a specific todo item
function editTodo(id) {
    const todoElement = document.querySelector(`[data-id="${id}"]`);
    const textDiv = todoElement.querySelector('.text');
    const todo = todos.find(todo => todo.id === id);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.classList.add('edit-input');
    textDiv.innerHTML = '';
    textDiv.appendChild(input);

    input.focus();
    input.select();

    const saveChanges = () => {
        todo.text = input.value.trim();
        renderTodos(currentFilter);
    };

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveChanges();
        }
    });

    input.addEventListener('blur', saveChanges);
}

// Displays the delete confirmation modal
function showDeleteConfirmModal(todoId) {
    const modal = document.getElementById('deleteConfirmModal');
    modal.style.display = 'block';

    document.getElementById('confirmDelete').onclick = () => confirmDelete(todoId);
    document.getElementById('cancelDelete').onclick = () => closeDeleteConfirmModal();
}

// Closes the delete confirmation modal
function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.style.display = 'none';
}

// Confirms deletion of a todo
function confirmDelete(todoId) {
    todoToDelete = todos.find(todo => todo.id === todoId);

    
    todos = todos.filter(todo => todo.id !== todoId);
    renderTodos(currentFilter);

    
    showUndoMessage();

   
    closeDeleteConfirmModal();
}

// Shows undo delete message
function showUndoMessage() {
    const undoMessage = document.getElementById('undoMessage');
    undoMessage.style.display = 'block';

    
    undoTimeout = setTimeout(() => {
        undoMessage.style.display = 'none';
        todoToDelete = null; 
    }, 5000);
}

// Undoes the deletion of a todo
function undoDelete() {
    if (todoToDelete) {
        todos.push(todoToDelete);
        renderTodos(currentFilter);
        todoToDelete = null;

        
        const undoMessage = document.getElementById('undoMessage');
        undoMessage.style.display = 'none';
        clearTimeout(undoTimeout);
    }
}


document.getElementById('undoButton').addEventListener('click', undoDelete);

// Opens the delete confirmation modal
function deleteTodo(id) {
    showDeleteConfirmModal(id);
}

// Toggles completion status of a todo
function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    renderTodos(currentFilter);
}

// Renders todos based on the current filter
function renderTodos(filter = 'all') {
    const list = document.querySelector('.list');
    list.innerHTML = ''; 

    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'pending') return !todo.completed;
        return true;
    });

    filteredTodos.forEach(todo => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.setAttribute('data-id', todo.id);

        const textDiv = document.createElement('div');
        textDiv.classList.add('text');
        textDiv.textContent = todo.text;
        if (todo.completed) textDiv.style.textDecoration = 'line-through';

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        const deleteBtn = document.createElement('div');
        deleteBtn.classList.add('delete');
        deleteBtn.innerHTML = '<img width="25px" src="./img/delete.png" alt="delete">';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        const editBtn = document.createElement('div');
        editBtn.classList.add('edit');
        editBtn.innerHTML = '<img width="25px" src="./img/edit.png" alt="edit">';
        editBtn.onclick = () => editTodo(todo.id);

        const completeDiv = document.createElement('div');
        completeDiv.classList.add('complete');
        completeDiv.innerHTML = `<input type="checkbox" ${todo.completed ? 'checked' : ''}>`;
        completeDiv.querySelector('input').onclick = () => toggleComplete(todo.id);

        optionsDiv.appendChild(deleteBtn);
        optionsDiv.appendChild(editBtn);
        optionsDiv.appendChild(completeDiv);

        item.appendChild(textDiv);
        item.appendChild(optionsDiv);

        list.appendChild(item);
    });
}
// Handles sorting todos by filter type
function handleSort(sortType) {
    currentFilter = sortType;
    renderTodos(sortType);
}


document.querySelector('.add img').addEventListener('click', () => {
    const input = document.getElementById('newTodoInput');
    const text = input.value;
    addTodo(text);
});


document.getElementById('newTodoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = e.target.value;
        addTodo(text);
    }
});


document.querySelector('.sorted').addEventListener('click', () => {
    const sortOptions = ['all', 'pending', 'completed'];
    const currentSort = document.querySelector('.sorted span').textContent.trim();
    const nextSortIndex = (sortOptions.indexOf(currentSort) + 1) % sortOptions.length;
    const nextSort = sortOptions[nextSortIndex];

    document.querySelector('.sorted span').textContent = nextSort;
    handleSort(nextSort);
});


renderTodos();
