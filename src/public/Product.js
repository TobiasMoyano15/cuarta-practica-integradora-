const addToCartBtn = document.querySelector('#addToCartBtn');
const volverBtn = document.querySelector('#volverBtn'); // Agregamos el botón de volver

addToCartBtn.addEventListener('click', async () => {
    const productId = addToCartBtn.dataset.productId;
    const productTitle = addToCartBtn.dataset.productTitle;
    let quantity = 1;

    try {
        const response = await fetch(`/api/carts/${productId}/products`, { // Corregimos la URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: quantity })
        });

        if (response.ok) {
            Swal.fire({
                title: 'Producto agregado',
                text: `Agregado ${productTitle}`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: `No se pudo agregar ${productTitle} al carrito`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al agregar el producto al carrito',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

volverBtn.addEventListener('click', () => {
    window.location.href = '/products';
});
