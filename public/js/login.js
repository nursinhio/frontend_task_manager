const API_BASE_URL = 'http://localhost:8081/auth';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (response.ok) {
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

           
            if (data.role === 'ROLE_ADMIN') {
                window.location.href = '/main';
            } else if (data.role === 'ROLE_USER') {
                window.location.href = '/user';
            } else {
                alert('Unknown role, please contact support.');
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (err) {
        alert('An error occurred. Please try again.');
        console.error(err);
    }
});
