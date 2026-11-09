const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menuController');
const { uploadMenu } = require('../middleware/uploadMenu');

router.get('/', MenuController.index);
router.get('/tambah', MenuController.tambahForm);
router.post('/', uploadMenu, MenuController.store);
router.get('/:id/edit', MenuController.editForm);
router.put('/:id', uploadMenu, MenuController.update);
router.delete('/:id', MenuController.destroy);

module.exports = router;