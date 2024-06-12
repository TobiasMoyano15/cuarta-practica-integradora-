const registerBtn = document.querySelector('#registerBtn');
const loginForm = document.querySelector('#loginForm');

registerBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    window.location.href = '/register';
});

loginForm.addEventListener('submit', handleLogin);

async function handleLogin(evt) {
    evt.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            window.location.href = '/products';
        } else {
            const errorText = await response.json();
            showErrorModal(errorText.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorModal('Ocurrió un error, por favor inténtalo nuevamente.');
    }
}

function showErrorModal(message) {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
