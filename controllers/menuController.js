const menuModel = require('../models/menuModel');

const KATEGORI = ['Makanan', 'Minuman'];

const PESAN = {
  tambah: 'Menu berhasil ditambahkan.',
  ubah: 'Menu berhasil diperbarui.',
  hapus: 'Menu berhasil dihapus.',
  dipakai: 'Menu tidak bisa dihapus karena masih dipakai oleh paket.'
};

function validasi(body) {
  const errors = [];
  const data = {
    nama_menu: (body.nama_menu || '').trim(),
    kategori: body.kategori,
    harga: Number(body.harga),
    deskripsi: (body.deskripsi || '').trim() || null,
    stok: Number(body.stok),
    gambar: (body.gambar || '').trim() || null
  };

  if (!data.nama_menu) errors.push('Nama menu wajib diisi.');
  else if (data.nama_menu.length > 100) errors.push('Nama menu maksimal 100 karakter.');

  if (!KATEGORI.includes(data.kategori)) errors.push('Kategori harus Makanan atau Minuman.');

  if (body.harga === '' || Number.isNaN(data.harga) || data.harga < 0) {
    errors.push('Harga harus berupa angka 0 atau lebih.');
  }
  if (body.stok === '' || !Number.isInteger(data.stok) || data.stok < 0) {
    errors.push('Stok harus berupa bilangan bulat 0 atau lebih.');
  }
  if (data.gambar && data.gambar.length > 255) errors.push('Nama gambar maksimal 255 karakter.');

  return { errors, data };
}

async function index(req, res, next) {
  try {
    const menus = await menuModel.getAll();
    res.render('menu/index', {
      title: 'Daftar Menu',
      menus,
      pesan: PESAN[req.query.status] || null
    });
  } catch (err) {
    next(err);
  }
}

function tambahForm(req, res) {
  res.render('menu/tambah', {
    title: 'Tambah Menu',
    menu: { kategori: 'Makanan', stok: 0 },
    kategoriList: KATEGORI,
    errors: []
  });
}

async function store(req, res, next) {
  try {
    const { errors, data } = validasi(req.body);
    if (errors.length > 0) {
      return res.status(400).render('menu/tambah', {
        title: 'Tambah Menu',
        menu: req.body,
        kategoriList: KATEGORI,
        errors
      });
    }
    await menuModel.create(data);
    res.redirect('/menu?status=tambah');
  } catch (err) {
    next(err);
  }
}

async function editForm(req, res, next) {
  try {
    const menu = await menuModel.getById(req.params.id);
    if (!menu) return res.status(404).send('Menu tidak ditemukan.');
    res.render('menu/edit', {
      title: 'Edit Menu',
      menu,
      kategoriList: KATEGORI,
      errors: []
    });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { errors, data } = validasi(req.body);
    if (errors.length > 0) {
      return res.status(400).render('menu/edit', {
        title: 'Edit Menu',
        menu: { ...req.body, id: req.params.id },
        kategoriList: KATEGORI,
        errors
      });
    }
    const berubah = await menuModel.update(req.params.id, data);
    if (!berubah) return res.status(404).send('Menu tidak ditemukan.');
    res.redirect('/menu?status=ubah');
  } catch (err) {
    next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const terhapus = await menuModel.remove(req.params.id);
    if (!terhapus) return res.status(404).send('Menu tidak ditemukan.');
    res.redirect('/menu?status=hapus');
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.redirect('/menu?status=dipakai');
    }
    next(err);
  }
}

module.exports = { index, tambahForm, store, editForm, update, destroy };
