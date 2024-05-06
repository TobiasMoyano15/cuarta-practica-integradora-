const socket = io()
let user

swal({
    closeOnClickOutside: false,
    closeOnEsc: false,
    content: {
        element:"input",
    },
    text: 'Ingresa el tu e-mail para identificarte en el chat',
})
.then(result => {
    user = result
    console.log(user)
})

// input del chat
let chatBox = document.querySelector('#chatBox')
chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0 ){
            console.log(chatBox.value)
            socket.emit('message', { user, message: chatBox.value })
            chatBox.value = ''
        }
    }

})

socket.on('messageLogs', data => {
    console.log('Mensajes del server', data)
    console.log(data);
    let log = document.getElementById('messageLog')

    let messages = ''
    data.forEach(message => {
        messages += `<li>${message.user} -  dice: ${message.message}</li><br>`
    })
    log.innerHTML = messages
})