const iniciarSesion = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Iniciar Sesión',
    html: `
            <div class="flex flex-col gap-2 items-start w-full p-2">
              <input id="swal-input1" name="correo" placeholder="Correo..." type="email" class="
                bg-white outline-none
                p-2 w-full rounded-md border
                transform transition-all duration-300
                focus:outline-none focus:bg-gray-50
              ">
              <input id="swal-input2" name="password" placeholder="Contraseña..." type="password" autocomplete="new-password" class="
                bg-white outline-none
                p-2 w-full rounded-md border
                transform transition-all duration-300
                focus:outline-none focus:bg-gray-50
              ">
            </div>
            `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        [document.getElementById('swal-input1').name]:
          document.getElementById('swal-input1').value,
        [document.getElementById('swal-input2').name]:
          document.getElementById('swal-input2').value,
      };
    },
    confirmButtonText: 'Continuar',
  });

  if (!formValues) return;

  let error;

  if (Object.values(formValues).includes('', undefined, null) && !error)
    error = await Swal.fire(
      'Alerta',
      'Debe Llenar Todos los Campos',
      'warning'
    );

  if (error) return iniciarSesion();

  //Login
  await login(formValues, Swal);
};

const registrarUsuario = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Registro',
    html: `
            <div class="flex flex-col gap-2 items-start w-full p-2">
              <input id="swal-input-name" name="nombre" placeholder="Nombre..." type="name" class="
                bg-white outline-none
                p-2 w-full rounded-md border
                transform transition-all duration-300
                focus:outline-none focus:bg-gray-50
              ">
              <input id="swal-input-mail" name="correo" placeholder="Correo..." type="email" class="
                bg-white outline-none
                p-2 w-full rounded-md border
                transform transition-all duration-300
                focus:outline-none focus:bg-gray-50
              ">
              <input id="swal-input-pass" name="password" placeholder="Contraseña..." type="password" autocomplete="new-password" class="
                bg-white outline-none
                p-2 w-full rounded-md border
                transform transition-all duration-300
                focus:outline-none focus:bg-gray-50
              ">
              <input id="swal-input-tel" name="tel" placeholder="Telefono..." type="phone" class="
                bg-white outline-none
                p-2 w-full rounded-md border
                transform transition-all duration-300
                focus:outline-none focus:bg-gray-50
              ">
              <h2 class="text-2xl mt-5 mb-1">¿Como conocio la Pagina?</h2>
              <textarea id="swal-input-text" name="text" placeholder="Descripción..." class="
                bg-white outline-none
                p-2 w-full h-32 rounded-md border
                transform transition-all duration-300
                focus:outline-none focus:bg-gray-50
              "></textarea>
            </div>
            `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        //Nombre
        [document.getElementById('swal-input-name').name]:
          document.getElementById('swal-input-name').value,
        //Email
        [document.getElementById('swal-input-mail').name]:
          document.getElementById('swal-input-mail').value,
        //Contraseña
        [document.getElementById('swal-input-pass').name]:
          document.getElementById('swal-input-pass').value,
        //Telefono
        [document.getElementById('swal-input-tel').name]:
          document.getElementById('swal-input-tel').value,
        //Texto
        [document.getElementById('swal-input-text').name]:
          document.getElementById('swal-input-text').value,
      };
    },
    confirmButtonText: 'Continuar',
  });

  if (!formValues) return;

  let error;

  const { tel, text, ...rest } = formValues;

  if (Object.values(rest).includes('', undefined, null) && !error)
    error = await Swal.fire(
      'Alerta',
      'Debe Llenar Todos los Campos',
      'warning'
    );

  if (
    !/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      formValues.correo
    ) &&
    !error
  )
    error = await Swal.fire('Error', 'Email Invalido', 'error');

  if (formValues.password.length < 6 && !error)
    error = await Swal.fire(
      'Error',
      'La Contraseña debe Tener Minimo 6 Caracteres',
      'error'
    );

  if (error) return registrarUsuario();

  //Registro
  const response = await (
    await fetch(`${url}usuarios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues),
    })
  ).json();

  if (response.msg || response.errors)
    return Swal.fire('Error', 'No se Pudo Crear el Usuario', 'error');

  await login(formValues, swal);
};
