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

const downloadBlob = (blob, name = 'file.txt') => {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
};