const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/'
  : 'https://consultorio-trabajo-social.herokuapp.com/api/';

const login = async data => {
  const response = await (
    await fetch(url + 'auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  ).json();

  if (response.errors) return console.log('LogIn Failed');

  sessionStorage.setItem('token', response.token);

  if (response.usuario.rol === 'ADMIN_ROLE')
    window.location = 'paginas_abmin/inicio_abmin.html';
  else window.location = 'paginas/inicio.html';
};

const logout = async () => {
  sessionStorage.removeItem('token');
  window.location = '../';
  if (socket) socket.disconnect();
};
