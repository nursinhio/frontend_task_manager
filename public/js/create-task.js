const apiUrl = 'http://localhost:8081/admin/tasks/createTask';


function checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login.html'; 
        return null;
    }
    return token;
}


document.getElementById('createTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();

   
    const token = checkToken();
    if (!token) return; 
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const status = "NEW"
    const priority = document.getElementById('priority').value;
    const dueDate = document.getElementById('dueDate').value; 
    const assigneeEmail = document.getElementById('assigneeEmail').value || null;

    const taskData = { title, description, status, priority, dueDate, assigneeEmail };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(taskData),
    })
        .then(response => {
            if (response.ok) {
                alert('Task created successfully');
                window.location.href = '/tasks';
            } else {
                response.text().then(text => alert(`Error creating task: ${text}`));
            }
        })
        .catch(error => console.error('Error creating task:', error));
});

document.getElementById('backToDashboard').addEventListener('click', () => {
    const token = checkToken();
    if (token) {
        window.location.href = '/main'; 
    }
});
