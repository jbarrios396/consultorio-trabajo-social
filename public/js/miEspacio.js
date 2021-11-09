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

  if (response.msg || response.errors) {
    console.log('Validation Failed');

    return (window.location = '../');
  }

  const { correo, nombre, rol, createdAt, tel } = response.usuario;

  //User HTML References
  document.getElementById(
    'profile-pic'
  ).src = `https://ui-avatars.com/api/?name=${nombre}&background=ACEEF3&color=041F60&size=128`;

  document.getElementById('usName').innerHTML = nombre;
  document.getElementById('usMail').innerHTML = 'Correo: ' + correo;
  if (tel) {
    const t = document.getElementById('usTel');
    t.classList.remove('hidden');
    t.innerHTML = 'Telefono: ' + tel;
  }
  document.getElementById('usRol').innerHTML =
    'Rol: ' +
    rol
      .replace('_ROLE', '')
      .replace('PATIENT', 'Paciente')
      .replace('ADMIN', 'Administrador')
      .replace('USER', 'Trabajador Social');
  document.getElementById('usDate').innerHTML =
    'Usuario desde: ' +
    new Date(createdAt).toLocaleDateString() +
    ' - ' +
    tConv24(new Date(createdAt).toLocaleTimeString());
};

const tConv24 = time24 => {
  let ts = time24;
  let H = +ts.substr(0, 2);
  let h = H % 12 || 12;
  h = h < 10 ? '0' + h : h; // leading 0 at the left for 1 digit hours
  let ampm = H < 12 ? ' AM' : ' PM';
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
};

if (!token) window.location = '../';
else main();
