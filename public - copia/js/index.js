const form = document.getElementById('LogInForm');

form.onsubmit = e => {
  e.preventDefault();

  const formData = new FormData(form);

  let json = {};
  formData.forEach((value, key) => (json[key] = value));

  login(json);
};
