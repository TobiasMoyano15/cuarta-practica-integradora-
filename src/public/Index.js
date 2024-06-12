const logOutBtn = document.querySelector('#logOutBtn');
const viewCartBtn = document.querySelector('#viewCartBtn');
const cartIDElement = document.querySelector('#cartID');

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

viewCartBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const cartID = cartIDElement.textContent.split(':')[1].trim();
    if (cartID) {
        window.location.href = `/cart/${cartID}`;
    } else {
        console.error('Cart ID not found');
    }
});

function removeDiacritics(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    const inputValue = removeDiacritics(searchInput.value.trim().toLowerCase());
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(productCard => {
        const productTitle = removeDiacritics(productCard.querySelector('.product-title').textContent.trim().toLowerCase());

        if (productTitle.includes(inputValue)) {
            productCard.style.display = 'block';
        } else {
            productCard.style.display = 'none';
        }
    });
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', filterProducts);
