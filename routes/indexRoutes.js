
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [menuR, paketR, pelangganR, pemesananR] = await Promise.all([
      pool.execute('SELECT COUNT(*) AS total FROM menu'),
      pool.execute('SELECT COUNT(*) AS total FROM paket'),
      pool.execute('SELECT COUNT(*) AS total FROM pelanggan'),
      pool.execute('SELECT COUNT(*) AS total FROM pemesanan')
    ]);

    res.render('pemesanan/dashboard', {
      title: 'Dashboard',
      total: {
        menu: menuR[0][0].total,
        paket: paketR[0][0].total,
        pelanggan: pelangganR[0][0].total,
        pemesanan: pemesananR[0][0].total
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
