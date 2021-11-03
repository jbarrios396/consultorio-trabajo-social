const { Router } = require('express');
const { buscarUsuarios } = require('../controllers/buscar');

const router = Router();

router.get('/:termino', buscarUsuarios);

module.exports = router;
