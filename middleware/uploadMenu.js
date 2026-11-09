const fs = require('fs');
const path = require('path');
const multer = require('multer');

const FOLDER_TUJUAN = path.join(__dirname, '..', 'public', 'uploads', 'menu');
fs.mkdirSync(FOLDER_TUJUAN, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, FOLDER_TUJUAN),
  filename: (req, file, cb) => {
    const ekstensi = path.extname(file.originalname).toLowerCase();
    const unik = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'menu-' + unik + ekstensi);
  }
});

const fileFilter = (req, file, cb) => {
  const ekstensi = path.extname(file.originalname).toLowerCase();
  const mimeValid = ['image/jpeg', 'image/png'].includes(file.mimetype);
  const ekstensiValid = ['.jpg', '.jpeg', '.png'].includes(ekstensi);
  if (mimeValid && ekstensiValid) return cb(null, true);
  cb(new Error('FORMAT_TIDAK_VALID'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB
}).single('gambar');

// Error upload tidak dilempar ke handler 500.
// Pesannya disimpan di req.uploadError supaya controller bisa
// menampilkannya kembali di form.
function uploadMenu(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.uploadError = 'Ukuran gambar maksimal 2 MB.';
      } else if (err.message === 'FORMAT_TIDAK_VALID') {
        req.uploadError = 'Gambar harus berformat JPG atau PNG.';
      } else {
        req.uploadError = 'Gambar gagal diunggah. Silakan coba lagi.';
      }
    }
    next();
  });
}

// Dipakai controller untuk membersihkan file lama atau file yang batal disimpan.
function hapusFileGambar(namaFile) {
  if (!namaFile) return;
  fs.unlink(path.join(FOLDER_TUJUAN, namaFile), () => {});
}

module.exports = { uploadMenu, hapusFileGambar };