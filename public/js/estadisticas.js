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
  document.getElementById('genButton').onclick = generarHistorial;

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

const cargarUsuarios = async (search = '@') => {
  const usuarios = document.getElementById('usuarios');

  const response = await (
    await fetch(`${url}buscar/${search}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.errors) return console.log('Error');
  Array.from(usuarios.children).forEach(item => item.remove());
  usuarios.innerHTML = `
    <div class="flex gap-1 items-center justify-between w-full">
        <h1 class="text-2xl mr-3 flex-shrink-0 font-light">Usuarios</h1>
        <input id="search" name="search" placeholder="Busqueda..." type="text" class="
          bg-white outline-none
          p-2 flex-grow rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <button 
            id="searchButton"
            class="
            bg-yellow-500
            p-2 material-icons-round
            text-white
            rounded-md
            flex-shrink-0
            focus:outline-none
        ">search</button>  
        <button 
            id="addButton"
            class="
            bg-blue-500
            p-2 material-icons-round
            text-white
            rounded-md
            flex-shrink-0
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
          <button 
            onclick="navigator.clipboard.writeText('${us.uid}')"         
            class="material-icons-round text-gray-400 p-3 rounded-full bg-transparent transform transition-all duration-200 ease-in outline-none focus:outline-none hover:text-blue-500 hover:bg-blue-200">copy</button>
          <button onclick="deleteUser('${
            us.uid
          }')" class="material-icons-round text-gray-400 p-3 rounded-full bg-transparent transform transition-all duration-200 ease-in outline-none focus:outline-none hover:text-red-500 hover:bg-red-200">delete</button>
        </div>
      `.trim();

    usuarios.appendChild(item);
  });

  document.getElementById('addButton').onclick = addUser;
  document.getElementById('searchButton').onclick = () =>
    cargarUsuarios(document.getElementById('search')?.value || '@');
};

const deleteUser = async uid => {
  const response = await (
    await fetch(`${url}usuarios/${uid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.errors) return console.log('Error');

  cargarUsuarios();
};

const addUser = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Multiple inputs',
    html: `
      <div class="flex flex-col gap-2 items-start w-full p-2">
        <input id="swal-input1" name="correo" placeholder="Correo..." type="email" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-inputName" name="nombre" placeholder="Nombre..." type="name" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-input2" name="password" placeholder="Contraseña..." type="password" autocomplete="new-password" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <label for="rol-select">Rol:</label>
        <select name="rol" id="rol-select" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
          <option value="USER_ROL" default>Trabajador Social</option>
          <option value="PATIENT_ROL">Paciente</option>
          <option value="ADMIN_ROL">Administrador</option>
        </select>
      </div>
      `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        [document.getElementById('swal-input1').name]:
          document.getElementById('swal-input1').value,
        [document.getElementById('swal-inputName').name]:
          document.getElementById('swal-inputName').value,
        [document.getElementById('swal-input2').name]:
          document.getElementById('swal-input2').value,
        [document.getElementById('rol-select').name]:
          document.getElementById('rol-select').value,
      };
    },
  });

  if (!formValues) return;

  let error;

  if (Object.values(formValues).includes('', undefined, null) && !error)
    error = await Swal.fire(
      'Alerta',
      'Debe Llenar Todos los Campos',
      'warning'
    );

  if (
    !/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      formValues.correo
    ) &&
    !error
  )
    error = await Swal.fire('Error', 'Email Invalido', 'error');

  if (formValues.password.length < 6 && !error)
    error = await Swal.fire(
      'Error',
      'La Contraseña debe Tener Minimo 6 Caracteres',
      'error'
    );

  if (error) return addUser();

  //AddUser
  const response = await (
    await fetch(`${url}usuarios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
      body: JSON.stringify(formValues),
    })
  ).json();

  if (response.msg || response.errors)
    return Swal.fire('Error', 'No se Pudo Crear el Usuario', 'error');

  cargarUsuarios();
};

const generarHistorial = async () => {
  const de = document.getElementById('us1').value;
  const para = document.getElementById('us2').value;

  const response = await (
    await fetch(`${url}mensajes/historial?de=${de}&para=${para}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).blob();

  if (response.msg || response.errors) return console.log('Error');

  downloadBlob(response, 'Historial.xlsx')
};

if (!token) window.location = '../';
else main();
