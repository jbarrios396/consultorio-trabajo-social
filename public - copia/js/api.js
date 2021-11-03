const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/'
  : 'https://restserver-curso-fher.herokuapp.com/api/';

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

  window.location = 'chat.html';
};

const logout = async () => {
  sessionStorage.removeItem('token');
  window.location = '../';
  socket.disconnect();
};
