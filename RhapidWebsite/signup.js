const signupForm = document.getElementById('signup-form') || document.getElementById('rider-signup-form');

signupForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;

    if (!name || !email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        const data = await res.json();

        if (res.ok) {
            alert('Signup successful!');
            localStorage.setItem('userInfo', JSON.stringify(data));
            if (role === 'driver') {
                window.location.href = 'driver-dashboard.html?new=true';
            } else {
                window.location.href = 'rider-dashboard.html?new=true';
            }
        } else {
            alert(data.message || 'An error occurred.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the server.');
    }
});
