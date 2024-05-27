const logOutBtn = document.querySelector('#logOutBtn');

logOutBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Failed to log out');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});