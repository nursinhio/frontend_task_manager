const API_BASE_URL = 'http://localhost:8081/tasks';


function logout() {
    localStorage.removeItem('token');

    
    alert('You have been logged out.');

    
    window.location.href = '/login'; 
}


document.getElementById('logoutButton').addEventListener('click', logout);


async function leaveComment(taskId) {
    const comment = document.getElementById('commentText').value;  

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/leaveCommentaryByTaskId?id=${taskId}&comment=${encodeURIComponent(comment)}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        alert('Failed to add comment');
        return;
    }

    const updatedTask = await response.json();

   
    const taskComments = document.getElementById('taskComments');
    taskComments.innerHTML = `Comments: ${updatedTask.comment}`;

    
    document.getElementById('commentText').value = '';
    alert('Comment added successfully');
}



async function fetchUserTasks() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/getUserTasks`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user tasks');
    }

    return await response.json();
}

// Получение полной информации о задаче
async function fetchTaskDetails(taskId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/getTaskDetails/${taskId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch task details');
    }

    return await response.json();
}



// Отображение задач на странице
function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых задач

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.id = `task-card-${task.id}`; // Добавляем id для каждой карточки

        taskCard.innerHTML = `
            <h4>${task.title}</h4>
            <p class="task-status">Status: ${task.status}</p>
        `;
        taskCard.onclick = () => showTaskDetails(task.id); // Открытие подробностей при клике
        tasksContainer.appendChild(taskCard);
    });
}

// Функция для обновления статуса задачи на "In Progress"
async function updateTaskStatusToInProgress(taskId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/updateTaskStatusToInProcess?id=${taskId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to update task status to In Progress');
    }

    const updatedTask = await response.json();
    
    updateTaskCardStatus(taskId, updatedTask.status); 
    const taskStatus = document.getElementById('taskStatus');
    taskStatus.innerHTML = `Status: ${updatedTask.status}`;
    alert('Task status updated to In Progress!');
}



// Функция для обновления комментария в карточке задачи


// Функция для обновления статуса задачи на "Finished"
async function updateTaskStatusToFinished(taskId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/updateTaskStatusToFinished?id=${taskId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to update task status to Finished');
    }

    const updatedTask = await response.json();

    updateTaskCardStatus(taskId, updatedTask.status); 
    const taskStatus = document.getElementById('taskStatus');
    taskStatus.innerHTML = `Status: ${updatedTask.status}`;
    alert('Task status updated to Finished!');
}

// Функция для обновления статуса задачи в карточке
function updateTaskCardStatus(taskId, newStatus) {
    const taskCard = document.getElementById(`task-card-${taskId}`); // Находим карточку задачи по id
    if (taskCard) {
        const taskStatus = taskCard.querySelector('.task-status'); // Находим элемент, отображающий статус
        if (taskStatus) {
            taskStatus.innerHTML = `Status: ${newStatus}`; // Обновляем статус в карточке
        }
    }
}

// Показать подробную информацию о задаче
function showTaskDetails(taskId) {
    fetchTaskDetails(taskId)
        .then(task => {
            const modal = document.getElementById('taskDetailsModal');
            const taskTitle = document.getElementById('taskTitle');
            const taskStatus = document.getElementById('taskStatus');
            const taskDescription = document.getElementById('taskDescription');
            const taskComments = document.getElementById('taskComments');
            const addCommentButton = document.getElementById('addCommentButton');
            const startButton = document.getElementById('startButton');
            const finishButton = document.getElementById('finishButton');
            
            // Заполнение данных в модальном окне
            taskTitle.innerHTML = task.title;
            taskStatus.innerHTML = `Status: ${task.status}`;
            taskDescription.innerHTML = `Description: ${task.description}`;
            taskComments.innerHTML = `Comments: ${task.comment}`;
            
            // Слушатели для кнопок изменения статуса
            addCommentButton.onclick = ()=> leaveComment(taskId)
            startButton.onclick = () => updateTaskStatusToInProgress(taskId);
            finishButton.onclick = () => updateTaskStatusToFinished(taskId);
            
            // Показать модальное окно
            modal.style.display = 'block';
        })
        .catch(error => {
            alert('Failed to load task details');
            console.error(error);
        });
}

// Закрыть модальное окно
function closeTaskDetails() {
    const modal = document.getElementById('taskDetailsModal');
    modal.style.display = 'none';
}

// Добавить обработку закрытия модального окна
const closeModal = document.getElementById('closeModal');
closeModal.onclick = () => closeTaskDetails();

// Закрыть окно при клике за его пределами
window.onclick = (event) => {
    const modal = document.getElementById('taskDetailsModal');
    if (event.target === modal) {
        closeTaskDetails();
    }
}

// Загрузить задачи при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchUserTasks()
        .then(tasks => {
            displayTasks(tasks);
        })
        .catch(error => {
            alert('Failed to load tasks');
            console.error(error);
        });
});
