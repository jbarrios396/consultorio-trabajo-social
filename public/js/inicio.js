const main = async () => {
  const usuario = await checkLogged();

  if (!usuario) return;

  document.getElementById('greeting').innerHTML += ` ${usuario.nombre}`;
};

if (!token) window.location = '../';
else main();
