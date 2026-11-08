const pool = require('../config/db');

async function getAll() {
  const [rows] = await pool.execute(
    'SELECT id, nama_menu, kategori, harga, deskripsi, stok, gambar FROM menu ORDER BY id DESC'
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.execute(
    'SELECT id, nama_menu, kategori, harga, deskripsi, stok, gambar FROM menu WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const [result] = await pool.execute(
    'INSERT INTO menu (nama_menu, kategori, harga, deskripsi, stok, gambar) VALUES (?, ?, ?, ?, ?, ?)',
    [data.nama_menu, data.kategori, data.harga, data.deskripsi, data.stok, data.gambar]
  );
  return result.insertId;
}

async function update(id, data) {
  const [result] = await pool.execute(
    'UPDATE menu SET nama_menu = ?, kategori = ?, harga = ?, deskripsi = ?, stok = ?, gambar = ? WHERE id = ?',
    [data.nama_menu, data.kategori, data.harga, data.deskripsi, data.stok, data.gambar, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM menu WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
