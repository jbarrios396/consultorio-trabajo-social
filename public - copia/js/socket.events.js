//Eventos
const conectado = () => console.log('Conectado');

const desconectado = () => socket.disconnect();

const recibirMensaje = mensaje => cargarMensaje(mensaje);

const usuariosActivos = usuarios => {
  activos = [];
  usuarios.forEach(usuario => activos.push(usuario.uid));
  cargarUsuarios();
};
