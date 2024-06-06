const registerForm = document.querySelector('#registerForm');

registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch('/api/users/register', { // Cambio aquí
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            Swal.fire({
                title: 'Registrado!',
                text: 'Usuario creado correctamente.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                window.location.href = '/login';
              });
            } else {
              const errorText = await response.json();
              Swal.fire({
                title: 'Error!',
                text: errorText.error,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          } catch (error) {
            console.error('Error:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Ocurrió un error, por favor inténtalo nuevamente.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
});
