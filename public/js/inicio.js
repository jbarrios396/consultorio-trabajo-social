const token = sessionStorage.getItem('token');

const main = async () => {
  //Validar Token
  const response = await (
    await fetch(url + 'auth/', {
      headers: {
        'Content-Type': 'application/json',
        'x-token': token,
      },
    })
  ).json();

  if (response.msg) {
    console.log('Validation Failed');

    return (window.location = '../');
  }

  const {
    usuario: { correo, nombre, rol },
  } = response;

  document.getElementById('navMail').innerHTML = correo;
  document.getElementById('greeting').innerHTML += ` ${nombre}`;

  document.getElementById('logout-button').onclick = logout;
};

if (!token) window.location = '../';
else main();
