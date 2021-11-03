const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario } = require('../models');

const buscarUsuarios = async (req, res = response) => {
  const { termino } = req.params;

  const esMongoID = ObjectId.isValid(termino); // TRUE

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, 'i');
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }, { rol: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

module.exports = {
  buscarUsuarios,
};
