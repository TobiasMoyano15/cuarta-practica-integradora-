const addToCartBtn = document.querySelector('#addToCartBtn');
const cartIDElement = document.querySelector('#cartID');

addToCartBtn.addEventListener('click', async () => {
    const productId = addToCartBtn.dataset.productId;
    const productTitle = addToCartBtn.dataset.productTitle;
    let quantity = 1;
    
    try {
        const cartID = cartIDElement.textContent.split(':')[1].trim();
        const response = await fetch(`/api/carts/${cartID}/products/${productId}`, {
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

    return response;
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

const volverBtn = document.querySelector('#volverBtn')

volverBtn.addEventListener('click', async () => {
    window.location.href = '/products';
})