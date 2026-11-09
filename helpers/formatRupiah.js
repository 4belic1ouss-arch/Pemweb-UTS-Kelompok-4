// Mengubah angka menjadi format rupiah, contoh: 25000 -> "Rp 25.000"
// Dipakai juga oleh Orang 3 (Paket) dan Orang 4 (Pemesanan).
function formatRupiah(angka) {
  const nilai = Number(angka) || 0;
  return 'Rp ' + Math.round(nilai).toLocaleString('id-ID');
}

module.exports = formatRupiah;