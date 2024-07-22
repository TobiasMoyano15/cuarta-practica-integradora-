const socket = io()
let user
const chatBox = document.querySelector('#chatBox')


Swal.fire({
    title:'Identificate',
    input:'text',
    text:'Ingresa el usuario para identificarte en el chat',
    inputValidator: value => {
        return !value && 'Necesitas escribir un nombre de usuario para continuar'
    },
    allowOutsideClick: false
})
.then(result => {
    user = result.value
})

chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim(). length > 0 ){
            socket.emit('message', { user, message: chatBox.value})
            chatBox.value = ''
        }
    }
})

socket.on('messageLog', data => {
    let log = document.querySelector('#messageLog')
    
    let messages = ''
    data.forEach(message => {
        messages += `<li>${message.user} - dice: ${message.message}<br></li>`
    })
    log.innerHTML = messages
})