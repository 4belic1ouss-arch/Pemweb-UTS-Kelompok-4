const express = require('express');

const router = express.Router();

// KERANGKA SEMENTARA: Anggota 3 mengganti isi file ini dengan route modul Pelanggan
router.get('/', (req, res) => {
  res.send('Modul Pelanggan sedang dikerjakan oleh Anggota 3.');
});

module.exports = router;
