const main = async () => {
  //Validar Token
  const usuario = await checkLogged();

  if (!usuario) return;

  let {
    correo,
    nombre,
    rol,
    createdAt,
    tel,
    genero,
    estado,
    seguridad,
    nacimiento,
    ciudad,
    carrera,
    semestre,
    ocupacion,
    estudios,
  } = usuario;

  if (genero) {
    switch (genero) {
      case 'O':
        genero = 'Otro';
        break;

      case 'M':
        genero = 'Masculino';
        break;

      case 'F':
        genero = 'Femenino';
        break;

      default:
        break;
    }
  }

  //User HTML References
  document.getElementById(
    'profile-pic'
  ).src = `https://ui-avatars.com/api/?name=${nombre}&background=ACEEF3&color=041F60&size=256`;

  document.getElementById('usName').innerHTML = nombre;
  document.getElementById('usMail').innerHTML += ' ' + correo;
  document.getElementById('usTel').innerHTML += ' ' + (tel || '-');
  document.getElementById('usGen').innerHTML += ' ' + (genero || '-');
  document.getElementById('usEstado').innerHTML += ' ' + (estado || '-');
  document.getElementById('usSeg').innerHTML += ' ' + (seguridad || '-');

  document.getElementById('usFecha').innerHTML += ' ' + (nacimiento || '-') + ', ' + (ciudad || '-');

  document.getElementById('usCar').innerHTML += ' ' + (carrera || '-');
  document.getElementById('usSem').innerHTML += ' ' + (semestre || '-');
  document.getElementById('usOcu').innerHTML += ' ' + (ocupacion || '-');
  document.getElementById('usEstu').innerHTML += ' ' + (estudios || '-');

  document.getElementById('usRol').innerHTML =
    'Rol: ' +
    rol
      .replace('_ROLE', '')
      .replace('PATIENT', 'Usuario')
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
