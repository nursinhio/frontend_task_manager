function logout() {
    localStorage.removeItem('token');

   
    alert('You have been logged out.');

   
    window.location.href = '/login'; 
}


document.getElementById('logoutButton').addEventListener('click', logout);


document.getElementById('viewTasks').addEventListener('click', () => {
    
    window.location.href = '/tasks';
});


document.getElementById('createTask').addEventListener('click', () => {
    window.location.href = '/create-task';
});