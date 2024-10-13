let todos = [];
let currentFilter = 'all'; 


function updateDate() {
    const timeElement = document.querySelector('.time');
    const dayElement = document.querySelector('.day');

    const now = new Date();

    const day = now.getDate();
    const month = now.toLocaleString('en', { month: 'short' }); 
    const year = now.getFullYear();


    dayElement.textContent = day;


    timeElement.innerHTML = `<span class="day">${day}</span> ${month} ${year}`;
}


updateDate();


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


function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos(currentFilter); 
}


function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    renderTodos(currentFilter); 
}


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


function handleSort(sortType) {
    currentFilter = sortType; 
    renderTodos(sortType);
}


document.querySelector('.add').addEventListener('click', () => {
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
