document.addEventListener('DOMContentLoaded', () => {
    const passwordRecoveryForm = document.querySelector('#passwordRecoveryForm');
    const emailInput = document.querySelector('#emailInput');

    passwordRecoveryForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const email = emailInput.value;

        try {
            const response = await fetch('/api/sessions/send-password-reset-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log('Success:', data);

            if (data.status === 'success') {
                Swal.fire({
                    title: 'Email Enviado!',
                    text: 'Revisa tu correo y sigue las instrucciones para reestablecer la contraseña',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login';
                    }
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.error,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Hubo un error al enviar el email: ' + error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
});