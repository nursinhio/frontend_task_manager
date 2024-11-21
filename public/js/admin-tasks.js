const apiUrl = 'http://localhost:8081/admin/tasks';

function checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login.html';
        return null;
    }
    return token;
}


function toggleFields() {
    const updateType = document.getElementById('updateType').value;
    const priorityDiv = document.getElementById('priorityDiv');
    const statusDiv = document.getElementById('statusDiv');
    const newValueInput = document.getElementById('newValue');
    const newValueLabel = document.getElementById('newValueLabel'); 

  
    priorityDiv.style.display = 'none';
    statusDiv.style.display = 'none';
    newValueInput.style.display = 'block';
    newValueLabel.style.display = 'block'; 

 
    if (updateType === 'priority') {
        priorityDiv.style.display = 'block';
        newValueInput.style.display = 'none'; 
        newValueLabel.style.display = 'none';  
    } 
    
    else if (updateType === 'status') {
        statusDiv.style.display = 'block';
        newValueInput.style.display = 'none';  
        newValueLabel.style.display = 'none';  
    } 
    
    else {
        newValueInput.style.display = 'block';
        newValueLabel.style.display = 'block';  
    }
}


function openUpdateModal(taskId, taskTitle) {
    const modal = document.getElementById('updateModal');
    const form = document.getElementById('updateForm');
    const updateTypeSelect = document.getElementById('updateType');
    const modalTitle = document.getElementById('modalTitle');

    modalTitle.textContent = `${taskTitle}`;

    
    modal.style.display = 'block';

    
    toggleFields();

    
    form.onsubmit = function(event) {
        event.preventDefault();
        const updateType = updateTypeSelect.value;
        const newValue = updateType === 'priority' || updateType === 'status' ? 
                         document.getElementById(updateType).value : 
                         document.getElementById('newValue').value;

        if (newValue) {
            updateTask(taskId, updateType, newValue);
        }
        closeModal();
    };
}


function closeModal() {
    document.getElementById('updateModal').style.display = 'none';
}

document.getElementById('cancelButton').addEventListener('click', function() {
    closeModal();
});



function updateTask(id, updateType, newValue) {
    const token = checkToken();
    if (!token) return;

    let url = '';
    if (updateType === 'status') {
        url = `${apiUrl}/updateTaskStatusById/${id}?status=${newValue}`;
    } else if (updateType === 'priority') {
        url = `${apiUrl}/updateTaskPriorityById/${id}?priority=${newValue}`;
    } else if (updateType === 'assigneeEmail') {
        url = `${apiUrl}/assignTaskByUserEmail?id=${id}&email=${newValue}`;
    } else if (updateType === 'comment') {
        url = `${apiUrl}/leaveCommentaryByTaskId/${id}?comment=${newValue}`;
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            alert(`${updateType} updated successfully`);
            loadTasks();
        } else {
            alert(`Error updating ${updateType}`);
        }
    })
    .catch(error => {
        console.error('Error updating task:', error);
    });
}


function loadTasks() {
    const token = checkToken();
    if (!token) return;

    fetch(`${apiUrl}/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(tasks => {
        const tableBody = document.querySelector('#taskTable tbody');
        tableBody.innerHTML = '';
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.status}</td>
                <td>${task.priority}</td>
                <td>${task.dueDate ? new Date(task.dueDate).toLocaleString() : ''}</td>
                <td>${task.comment}</td>
                <td>${task.assigneeEmail}</td>
                <td>
                    <button onclick="openUpdateModal(${task.id}, '${task.title}')">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading tasks:', error));
}


function deleteTask(id) {
    const token = checkToken();
    if (!token) return;

    fetch(`${apiUrl}/deleteTaskById/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            alert('Task deleted successfully');
            loadTasks();
        } else {
            alert('Error deleting task');
        }
    });
}

document.getElementById('backToDashboard').addEventListener('click', () => {
    window.location.href = '/main';
});

loadTasks();
