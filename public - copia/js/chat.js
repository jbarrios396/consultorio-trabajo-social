const token = sessionStorage.getItem('token');
let socket;
let activos = [];
let selectedUser;
let chat;
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
    usuario: { correo, nombre, uid },
  } = response;

  console.log('Usuario:', uid);
  usuario = uid;

  //Referencias HTML
  chat = document.getElementById('messages');
  document.getElementById('title').innerHTML += ` ${correo}`;
  document.title = nombre;
  document.getElementById('logoutBtn').onclick = logout;
  document.getElementById('sendBtn').onclick = enviarMensaje;

  //Conectar Socket
  await conectarSocket();
  // await cargarUsuarios();
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
  socket.on('mensaje-privado', recibirMensaje);
  socket.on('usuarios-activos', usuariosActivos);
};

const cargarUsuarios = async () => {
  const usuarios = document.getElementById('usuarios');

  const response = await (
    await fetch(url + 'usuarios/', {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.erros) return console.log('Error');

  Array.from(usuarios.children).forEach(item => item.remove());
  usuarios.innerHTML = '<h1>Usuarios</h1>';

  response.usuarios.forEach(usuario => {
    const item = document.createElement('div');

    item.innerHTML = `
      <div class="flex items-center gap-2 py-1 px-3 w-full bg-gray-100 rounded-md" id="item-${
        usuario.uid
      }">
        <div class="w-1.5 h-1.5 rounded-full ${
          activos.includes(usuario.uid) ? 'bg-green-400' : 'bg-red-400'
        }"> </div>
        <p>${usuario.nombre}</p>
      </div>
    `.trim();

    usuarios.appendChild(item);

    const el = document.getElementById('item-' + usuario.uid);

    el.addEventListener('click', _ => {
      selectedUser = usuario.uid;
      chat.innerHTML = '';
      cargarDesdeLaBD();
    });
  });
};

const enviarMensaje = async () => {
  const input = document.getElementById('msg');
  const msg = input?.value;

  if (msg?.length === 0) return;

  console.log(selectedUser);
  socket.emit('enviar-mensaje', {
    msg,
    uid: selectedUser,
  });

  input.value = '';

  let html = `
  <div class="flex w-full justify-end">
    <div class="p-2 text-xl bg-blue-100 rounded-md w-max text-right">
      ${msg}
    </div>
  </div>`;

  const msgItem = document.createElement('div');
  msgItem.innerHTML = html.trim();

  chat.appendChild(msgItem);
};

const cargarMensaje = mensaje => {
  const { de, msg } = mensaje;

  if (de !== selectedUser) return;

  let html = `
      <div class="flex w-full justify-end">
        <div class="p-2 text-xl bg-blue-100 rounded-md w-max text-right">
          ${msg}
        </div>
      </div>`;

  if (de == selectedUser)
    html = `
        <div class="p-2 text-xl bg-white border w-max rounded-md">
          ${msg}
        </div>`;

  const msgItem = document.createElement('div');
  msgItem.innerHTML = html.trim();

  chat.appendChild(msgItem);
};

const cargarDesdeLaBD = async () => {
  const response = await (
    await fetch(url + `mensajes/?de=${usuario}&para=${selectedUser}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.erros) return console.log('Error');

  response.mensajes.reverse().forEach(({ de, msg }) => {
    let html = `
      <div class="flex w-full justify-end">
        <div class="p-2 text-xl bg-blue-100 rounded-md w-max text-right">
          ${msg}
        </div>
      </div>`;

    if (de == selectedUser)
      html = `
        <div class="p-2 text-xl bg-white border w-max rounded-md">
          ${msg}
        </div>`;

    const msgItem = document.createElement('div');
    msgItem.innerHTML = html.trim();

    chat.appendChild(msgItem);
  });
};

if (!token) window.location = '../';
else main();
