document.addEventListener('DOMContentLoaded', () => {
    const passwordResetForm = document.querySelector('#passwordResetForm');
    const newPasswordInput = document.querySelector('#newPasswordInput');
    const newPasswordRetypeInput = document.querySelector('#newPasswordRetypeInput');
    const token = new URLSearchParams(window.location.search).get('token');

    passwordResetForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const newPassword = newPasswordInput.value;
        const newPasswordRetype = newPasswordRetypeInput.value;
        console.log(newPassword)

        try {
            const response = await fetch('/api/sessions/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword, newPasswordRetype }),
            });
            
            const data = await response.json();
            console.log(data)

            if (data.status === 'success') {
                Swal.fire({
                    title: 'Contraseña Actualizada!',
                    text: 'Su contraseña ha sido actualizada exitosamente.',
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
                text: 'Hubo un error al actualizar la contraseña: ' + error,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
});