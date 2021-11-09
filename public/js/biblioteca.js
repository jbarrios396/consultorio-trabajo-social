const search = async () => {
  const facultad = document.getElementById('facultad').value;
  const busqueda = document.getElementById('search').value;

  console.log(facultad, busqueda);
};

const main = async () => {
  const usuario = await checkLogged();

  if (!usuario) return;

  document.getElementById('searchButton').addEventListener('click', search);

  if (usuario.rol !== 'ADMIN_ROLE') return;

  console.log('es Admin');
};

main();
