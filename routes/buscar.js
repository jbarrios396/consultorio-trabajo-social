const { Router } = require('express');
const {
  buscarUsuarios,
  buscarChatsConAdmin,
} = require('../controllers/buscar');

const router = Router();

router.get('/:termino', buscarUsuarios);
router.get('/extra/buscarChatsConAdmin', buscarChatsConAdmin);

module.exports = router;
