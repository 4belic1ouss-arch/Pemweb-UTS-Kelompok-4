const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.index);
router.get('/tambah', menuController.tambahForm);
router.post('/tambah', menuController.store);
router.get('/edit/:id', menuController.editForm);
router.post('/edit/:id', menuController.update);
router.post('/hapus/:id', menuController.destroy);

module.exports = router;
