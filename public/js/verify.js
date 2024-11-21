const API_BASE_URL = 'http://localhost:8081/auth';

document.querySelector('#verifyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const verificationCode = document.getElementById('verificationCode').value;

    try{

        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, verificationCode}),
        });
        
        const data = await response.json();
        if (response.ok) {
            window.location.href = '/login'; 
        } else {
            alert("Error: " + data.message);
        }
    }catch(e){
        alert("Error"+e)
        console.error(e)
    }
});
