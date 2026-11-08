const express = require('express');

const router = express.Router();

// KERANGKA SEMENTARA: Anggota 2 mengganti isi file ini dengan route modul Paket Katering
router.get('/', (req, res) => {
  res.send('Modul Paket Katering sedang dikerjakan oleh Anggota 2.');
});

module.exports = router;
