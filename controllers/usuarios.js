const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol, text, tel } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol, text, tel });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  usuario.save((err, usuario) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({
      usuario,
    });
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  await Usuario.findByIdAndUpdate(id, resto, {}, (err, usuario) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json(usuario);
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: 'patch API - usuariosPatch',
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  await Usuario.findByIdAndUpdate(id, { estado: false }, {}, (err, usuario) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json(usuario);
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
