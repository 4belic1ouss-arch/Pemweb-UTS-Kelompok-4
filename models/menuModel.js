const db = require('../config/db');

// Mendukung config/db.js berupa pool callback (mysql2) maupun pool promise (mysql2/promise).
const pool = typeof db.promise === 'function' ? db.promise() : db;

const MenuModel = {
  // filter opsional: { kategori, q } (q = pencarian nama)
  async getAll(filter = {}) {
    const kondisi = [];
    const nilai = [];

    if (filter.kategori) {
      kondisi.push('kategori_menu = ?');
      nilai.push(filter.kategori);
    }
    if (filter.q) {
      kondisi.push('nama_menu LIKE ?');
      nilai.push('%' + filter.q + '%');
    }

    const where = kondisi.length ? 'WHERE ' + kondisi.join(' AND ') : '';
    const [rows] = await pool.query(
      `SELECT * FROM menu ${where} ORDER BY nama_menu ASC`,
      nilai
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM menu WHERE id_menu = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [hasil] = await pool.query(
      `INSERT INTO menu (nama_menu, kategori_menu, deskripsi_menu, harga_menu, stok, gambar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.nama_menu,
        data.kategori_menu,
        data.deskripsi_menu || null,
        data.harga_menu,
        data.stok,
        data.gambar || null
      ]
    );
    return hasil.insertId;
  },

  async update(id, data) {
    const [hasil] = await pool.query(
      `UPDATE menu
          SET nama_menu = ?, kategori_menu = ?, deskripsi_menu = ?,
              harga_menu = ?, stok = ?, gambar = ?
        WHERE id_menu = ?`,
      [
        data.nama_menu,
        data.kategori_menu,
        data.deskripsi_menu || null,
        data.harga_menu,
        data.stok,
        data.gambar || null,
        id
      ]
    );
    return hasil.affectedRows;
  },

  async remove(id) {
    const [hasil] = await pool.query('DELETE FROM menu WHERE id_menu = ?', [id]);
    return hasil.affectedRows;
  },

  // true jika menu sudah dipakai di salah satu paket
  async isUsedInPaket(id) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total FROM paket_menu WHERE id_menu = ?',
      [id]
    );
    return rows[0].total > 0;
  },

  // Membaca nilai ENUM kategori_menu langsung dari database,
  // jadi tidak perlu ditulis manual dan selalu sama dengan schema.
  async getKategori() {
    const [rows] = await pool.query("SHOW COLUMNS FROM menu LIKE 'kategori_menu'");
    if (!rows.length) return [];
    const cocok = rows[0].Type.match(/'([^']*)'/g) || [];
    return cocok.map((s) => s.replace(/'/g, ''));
  }
};

module.exports = MenuModel;