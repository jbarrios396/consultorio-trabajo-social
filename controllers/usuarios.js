const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const deleteFile = require('../helpers/deleteFile');

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

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  await Usuario.findByIdAndDelete(id, {}, (err, usuario) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({ usuario });
  });
};

const tabla = async (_, res = response) => {
  const usuarios = await Usuario.find().sort({
    createdAt: 'desc',
  });

  const arr = usuarios.map(({ nombre, correo, rol, tel, text, createdAt }) => ({
    Nombre: nombre,
    Correo: correo,
    Rol: rol
      .replace('_ROLE', '')
      .replace('PATIENT', 'Paciente')
      .replace('ADMIN', 'Administrador')
      .replace('USER', 'Trabajador Social'),
    Telefono: tel,
    Motivo: text,
    'Fecha de Creación': new Date(createdAt).toLocaleString(),
  }));

  const filePath =
    __dirname + '/tempHistory' + new Date().getMilliseconds() + '.xlsx';

  const sheet = XLSX.utils.json_to_sheet(arr);
  sheet['!cols'] = [
    { wch: 30 },
    { wch: 30 },
    { wch: 20 },
    { wch: 30 },
    { wch: 30 },
    { wch: 20 },
    { wch: 30 },
    { wch: 30 },
  ];

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'sheet1');

  XLSX.writeFile(book, filePath);

  res.sendFile(filePath);

  deleteFile(filePath);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  tabla,
};
