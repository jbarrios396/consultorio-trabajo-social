const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const { emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { mensajesGet, mensajesPost } = require('../controllers/mensajes');

const router = Router();

router.get('/', mensajesGet);

router.post(
  '/',
  [
    check('de', 'El remitente es obligatorio').not().isEmpty(),
    check('para', 'El destinatario es obligatorio').not().isEmpty(),
    check('msg', 'El mensaje es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  mensajesPost
);

module.exports = router;
