const token = sessionStorage.getItem('token');
let socket;
let activos = [];
let usuario;

const main = async () => {
  //Validar Token
  const response = await (
    await fetch(url + 'auth/', {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg) {
    console.log('Validation Failed');

    return (window.location = '../');
  }

  const {
    usuario: { correo, uid, rol },
  } = response;

  if (rol !== 'ADMIN_ROLE') {
    window.location = './inicio.html';
    return;
  }

  console.log('Usuario:', uid);
  usuario = response.usuario;

  //Referencias HTML
  document.getElementById('navMail').innerHTML = correo;
  document.getElementById('logout-button').onclick = logout;

  //Conectar Socket
  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      'x-token': token,
    },
  });

  //Eventos
  socket.on('connect', conectado);
  socket.on('disconnect', desconectado);
  socket.on('usuarios-activos', usuariosActivos);
};

const cargarUsuarios = async () => {
  const usuarios = document.getElementById('usuarios');

  const response = await (
    await fetch(
      `${url}buscar/@
       ${
         ''
         // {
         //   ADMIN_ROLE: '@',
         //   USER_ROLE: 'PATIENT',
         //   PATIENT_ROLE: 'USER_ROLE',
         // }[usuario.rol]
       }`,
      {
        headers: { 'Content-Type': 'application/json', 'x-token': token },
      }
    )
  ).json();

  if (response.msg || response.erros) return console.log('Error');
  Array.from(usuarios.children).forEach(item => item.remove());
  usuarios.innerHTML = `
    <div class="flex gap-1 items-center justify-between w-full">
        <h1 class="text-2xl font-light">Usuarios</h1>
        <button 
            id="addButton"
            class="
            bg-blue-500
            p-2 material-icons-round
            text-white
            rounded-md
            mt-2
            focus:outline-none
        ">add</button>  
    </div>`;

  response.results.forEach(us => {
    if (us.uid === usuario.uid) return;

    const item = document.createElement('div');

    item.innerHTML = `
        <div class="flex items-center gap-2 p-3 w-full bg-gray-100 rounded-xl" id="item-${
          us.uid
        }">
          <div class="w-20 h-20 relative overflow-hidden">
            <img class="w-full h-full rounded-full object-cover" src="https://ui-avatars.com/api/?name=${
              us.nombre
            }&background=ACEEF3&color=041F60"/>
            <div class="absolute right-1.5 bottom-1.5 w-4 h-4 mt-2.5 -mb-1 rounded-full ${
              activos.includes(us.uid) ? 'bg-green-400' : 'bg-red-400'
            }"> </div>
          </div>
          <div class="flex flex-col flex-grow text-gray-500">
            <p class="text-xl text-gray-600">${us.nombre}</p>
            <p>Correo: ${us.correo}</p>
            <p>Rol: ${us.rol
              .replace('_ROLE', '')
              .replace('PATIENT', 'Paciente')
              .replace('ADMIN', 'Administrador')
              .replace('USER', 'Trabajador Social')}</p>
          </div>
          <button onclick="deleteUser('${
            us.uid
          }')" class="material-icons-round text-gray-400 p-3 rounded-full bg-transparent transform transition-all duration-200 ease-in outline-none focus:outline-none hover:text-red-500 hover:bg-red-200">delete</button>
        </div>
      `.trim();

    usuarios.appendChild(item);
  });

  document.getElementById('addButton').onclick = addUser;
};

const deleteUser = async uid => {
  const response = await (
    await fetch(`${url}usuarios/${uid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.erros) return console.log('Error');

  cargarUsuarios();
};

const addUser = async () => {
  console.log('data');
};

if (!token) window.location = '../';
else main();
