const socket = io();

let userName;

Swal.fire({
  title: 'Ingresá tu usuario',
  input: 'text',
  inputValidator: (value) => {
    if (!value) {
      return 'Tenés que ingresar un usuario';
    }
  },
}).then((data) => {
  userName = data.value;
  //emitimos el user para que el server notifique luego el log del usuario que se conecto
  socket.emit('newUser', userName);
});

const inputData = document.getElementById('inputData');
const outputData = document.getElementById('outputData');

//evento escucha si se aprieta y suelta una tecla ('keyup')
inputData.addEventListener('keyup', (event) => {
  //verifica que la tecla apretada sea "enter"
  if (event.key === 'Enter') {
    //verifica que no se envien mensajes en blanco
    if (inputData.value.trim().length > 0) {
      socket.emit('message', { user: userName, data: inputData.value });
      inputData.value = '';
    }
  }
});

socket.on('messageLogs', (data) => {
  let messages = '';
  data.forEach((m) => {
    messages += `${m.user} dice: ${m.data}<br />`;
  });

  outputData.innerHTML = messages;
});

socket.on('userLog', (data) => {
  console.log(`${data} se ha unido, mandale un saludo!`);
});

socket.on('notification', (user) => {
  Swal.fire({
    text: `${user} se unió!`,
    toast: true,
    position: 'top-right',
  });
});
