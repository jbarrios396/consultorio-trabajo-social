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
    usuario: { nombre },
  } = response;

  document.getElementById('greeting').innerHTML += ` ${nombre}`;
};

if (!token) window.location = '../';
else main();
