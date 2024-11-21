const API_BASE_URL = 'http://localhost:8081/auth';

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nickname = document.getElementById('signupNickname').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nickname, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            window.location.href = "/verify"
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (err) {
        alert('An error occurred. Please try again.');
        console.error(err);
    }
});
