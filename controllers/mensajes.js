const { response, request } = require('express');

const Mensaje = require('../models/mensaje');

const mensajesGet = async (req = request, res = response) => {
  const { de = /.*/, para = /.*/ } = req.query;
  const query = {
    $or: [
      { de, para },
      { de: para, para: de },
    ],
  };

  const [total, mensajes] = await Promise.all([
    Mensaje.countDocuments(query),
    Mensaje.find(query).sort({ createdAt: 'desc' }),
  ]);

  res.json({
    total,
    mensajes,
  });
};

const mensajesPost = async (req, res = response) => {
  const { de, para, msg, fecha } = req.body;
  const mensaje = new Mensaje({ de, para, msg, fecha });

  // Guardar en BD
  await mensaje.save();

  res.json({
    mensaje,
  });
};

module.exports = {
  mensajesGet,
  mensajesPost,
};
