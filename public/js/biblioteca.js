const main = async () => {
  const usuario = await checkLogged();

  if (!usuario) return;

  document.getElementById('searchButton').addEventListener('click', search);

  await search();

  if (usuario.rol !== 'ADMIN_ROLE') return;

  const addButton = document.createElement('button');
  addButton.onclick = addBook;
  addButton.innerHTML = 'add';

  addButton.className = `
    bg-blue-500
    p-2
    material-icons-round
    text-white
    rounded-md
    flex-shrink-0
    focus:outline-none
  `;

  document.getElementById('bar').appendChild(addButton);
};

const search = async () => {
  const facultad = document.getElementById('facultad').value;
  const busqueda = document.getElementById('search').value;

  const query = `
  ?facultad=${facultad}
  ${busqueda && `&busqueda=${busqueda}`}
`
    .replace(/\s/g, '')
    .trim();

  const response = await (
    await fetch(`${url}libros/${query}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.errors) return console.log('Error');

  document.getElementById('count').innerHTML = 'Resultados: ' + response.total;

  cargarLibros(response.libros);
};

const cargarLibros = async libros => {
  const items = document.getElementById('books');

  items.innerHTML = '';

  libros.forEach(({ nombre, autor, link }) => {
    const libro = document.createElement('div');

    libro.className = `
      p-3
      flex flex-col
      justify-between
      w-80
      h-36
      gap-2
      rounded-lg
      shadow-md
      border
    `;

    libro.innerHTML = `
      <div class="flex items-start justify-between gap-2 w-full h-2/3">
        <i
          class="material-icons-round text-green-500"
          style="font-size: 40px"
          >bookmark</i
        >
        <div class="h-full flex flex-col flex-grow overflow-hidden">
          <h1 class="font-medium text-xl h-auto text-gray-700">
            ${nombre}
          </h1>
          <p class="truncate flex-shrink-0">${autor}</p>
        </div>
      </div>
      <a href="${link}" target="_blank" class="font-medium text-blue-400">Leer</a>
    `;

    items.appendChild(libro);
  });
};

const addBook = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Nuevo Libro',
    html: `
      <div class="flex flex-col relative gap-2 items-start w-full p-2">
        <input id="swal-inputName" name="nombre" placeholder="Nombre..." type="text" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-inputAutor" name="autor" placeholder="Autor..." type="text" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-inputLink" name="link" placeholder="Link..." type="link" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <label for="fac-select">Facultad:</label>
        <div class="
          relative
          bg-white
          p-2
          w-full
          border
          flex-shrink-0
          rounded-md
        ">
          <select name="facultad" id="fac-select" class="
            appearance-none
            relative
            w-full
            truncate
            outline-none
            focus:outline-none
        ">
            <option value="soc" default>Ciencias Sociales y Humanas</option>
            <option value="ing">Ingeniería</option>
            <option value="sal">Ciencias de la Salud</option>
            <option value="adm">Ciencias Contables y Administrativas</option>
          </select>
          <div class="pointer-events-none absolute top-2 right-1">
            <i class="material-icons-round">expand_more</i>
          </div>
        </div>
      </div>
      `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        [document.getElementById('swal-inputName').name]:
          document.getElementById('swal-inputName').value,
        [document.getElementById('swal-inputLink').name]:
          document.getElementById('swal-inputLink').value,
        [document.getElementById('swal-inputAutor').name]:
          document.getElementById('swal-inputAutor').value,
        [document.getElementById('fac-select').name]:
          document.getElementById('fac-select').value,
      };
    },
    confirmButtonText: 'Añadir',
  });

  if (!formValues) return;

  if (Object.values(formValues).includes('', undefined, null) && !error)
    return await Swal.fire(
      'Alerta',
      'Debe Llenar Todos los Campos',
      'warning'
    ).then(addBook);

  //AddUser
  const response = await (
    await fetch(`${url}libros/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
      body: JSON.stringify(formValues),
    })
  ).json();

  if (response.msg || response.errors)
    return Swal.fire('Error', 'No se Pudo Añadir el Libro', 'error');

  cargarLibros();
};

main();

// Array.from(document.getElementsByTagName('select')).forEach(select => {
//   const arrow = document.createElement('i');
//   arrow.className = 'material-icons-round top-2 right-2 absolute';
//   arrow.innerHTML = 'expand_more';

//   select.after(arrow);
// });
