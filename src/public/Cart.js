const volverBtn = document.querySelector('#volverBtn')

volverBtn.addEventListener('click', async () => {
    window.location.href = '/products';
    })
    // POR HACER - BOTON QUITAR PRODUCTOS DEL CARRITO
    // const removeFromCartBtn = document.querySelector('#removeFromCartBtn')
    // const productli = document.querySelector('#productli')
// removeFromCartBtn.addEventListener('click', async (evt) => {
//     evt.preventDefault()
//     // const cartId = addToCartBtn.dataset.cartId;
//     const productId = productli.dataset.productId;
//     const productTitle = addToCartBtn.dataset.productTitle;
//     try{
//     const response = await fetch(`/api/carts/${cartID}/products/${productId}`, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     });
//     alert(`Agregado ${productTitle}`);
//     return response
// } catch (error) {
//     console.error('Error al agregar el producto al carrito:', error);
// }
// });