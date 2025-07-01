document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Login successful!');
            localStorage.setItem('userInfo', JSON.stringify(data));
            if (data.role === 'driver') {
                window.location.href = 'driver-dashboard.html';
            } else {
                window.location.href = 'rider-dashboard.html';
            }
        } else {
            alert(data.message || 'An error occurred.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the server.');
    }
});
