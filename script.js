let todos = [];

// Add a new todo
function addTodo(text) {
    if (text.trim() === "") return; // Prevent adding empty todos

    const newTodo = {
        id: Date.now(),
        text,
        completed: false,
    };
    todos.push(newTodo);
    document.getElementById('newTodoInput').value = ''; // Clear input field after adding
    renderTodos();
}

// Edit a todo directly in the list
function editTodo(id) {
    const todoElement = document.querySelector(`[data-id="${id}"]`);
    const textDiv = todoElement.querySelector('.text');
    const todo = todos.find(todo => todo.id === id);

    // Create an input field for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.classList.add('edit-input');
    textDiv.innerHTML = ''; // Clear the current text
    textDiv.appendChild(input);

    // Focus the input and select the text
    input.focus();
    input.select();

    // Handle when the user presses 'Enter' or the input loses focus (blur event)
    const saveChanges = () => {
        todo.text = input.value.trim(); // Save the new text
        renderTodos(); // Re-render the list
    };

    // Save changes on 'Enter' keypress
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveChanges();
        }
    });

    // Save changes when the input loses focus
    input.addEventListener('blur', saveChanges);
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// Toggle complete status
function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    renderTodos();
}

// Render the todos to the DOM
function renderTodos(filter = 'all') {
    const list = document.querySelector('.list');
    list.innerHTML = ''; // Clear the list

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

        // Delete button
        const deleteBtn = document.createElement('div');
        deleteBtn.classList.add('delete');
        deleteBtn.innerHTML = '<img width="25px" src="./img/delete.png" alt="delete">';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        // Edit button
        const editBtn = document.createElement('div');
        editBtn.classList.add('edit');
        editBtn.innerHTML = '<img width="25px" src="./img/edit.png" alt="edit">';
        editBtn.onclick = () => editTodo(todo.id);

        // Complete checkbox
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

// Handle sort
function handleSort(sortType) {
    renderTodos(sortType);
}

// Add event listener for the plus button
document.querySelector('.add').addEventListener('click', () => {
    const input = document.getElementById('newTodoInput');
    const text = input.value;
    addTodo(text);
});

// Add event listener for pressing "Enter" to add todo
document.getElementById('newTodoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = e.target.value;
        addTodo(text);
    }
});

// Add event listener for sorting
document.querySelector('.sorted').addEventListener('click', () => {
    const sortOptions = ['all', 'pending', 'completed'];
    const currentSort = document.querySelector('.sorted span').textContent.trim();
    const nextSortIndex = (sortOptions.indexOf(currentSort) + 1) % sortOptions.length;
    const nextSort = sortOptions[nextSortIndex];

    document.querySelector('.sorted span').textContent = nextSort;
    handleSort(nextSort);
});

// Initial rendering
renderTodos();
