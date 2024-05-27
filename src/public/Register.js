const registerBtn = document.querySelector('#registerBtn');

registerBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    window.location.href = '/register';
});