# 👑 PRESIDENTKU - Location Based Services (LBS)
Aplikasi mobile modern untuk pelacakan lokasi, visualisasi peta, reverse geocoding, dan deteksi area geofencing.

---

## 📱 Arsitektur & Navigasi Antarmuka (UI/UX)

Aplikasi dirancang dengan standar **Human Interface Guidelines** dan **Material 3**:
- **Bottom Navigation Bar**: Memudahkan navigasi dengan satu tangan (*Thumb Zone*).
- **Tipografi & Spacing Proporsional**: Menggunakan warna slate bersih (`#F8FAFC`), card putih dengan soft shadow, dan kontras warna yang nyaman di mata.
- **Micro-interactions**: Feedback loading indicator, ripple efek lokasi pengguna, dan status badge interaktif.

### 1. Tab Koordinat (`CoordinateScreen`)
- **Fungsi**: Membaca sensor GPS perangkat secara real-time dan menangani izin lokasi (*Permission*).
- **Tampilan**:
  - Kartu putih elegan dengan pin lokasi biru.
  - Data `Latitude`, `Longitude`, dan `Accuracy` (satuan meter `±5.0 m`).
  - Indikator status koneksi GPS.
  - Tombol aksi utama **"Ambil Lokasi"**.

### 2. Tab Peta (`MapScreen`)
- **Fungsi**: Visualisasi posisi pengguna pada peta interaktif.
- **Tampilan**:
  - Full-screen Interactive Map dengan custom marker pin merah dan ripple akurasi biru.
  - Floating card di bagian atas: Menampilkan status **GPS Aktif** serta nilai koordinat terkini.
  - Floating controls di sisi kanan bawah (mudah dijangkau jempol): Tombol **Pusatkan Peta (My Location)** dan tombol **Zoom In/Out**.

### 3. Tab Geofence (`GeofenceScreen`)
- **Fungsi**: Location Intelligence yang menggabungkan:
  - **Reverse Geocoding**: Mengubah koordinat GPS menjadi alamat jalan lengkap yang mudah dibaca (`Jl. Raya Tlogomas No.246, Lowokwaru, Kota Malang, Jawa Timur 65144`).
  - **Geofencing**: Mendeteksi keberadaan pengguna di dalam radius **Area Kampus UMM** (overlay lingkaran ungu).
  - **Smart Feedback**: Banner notifikasi sambutan saat masuk area kampus (`🔔 Anda masuk area Kampus UMM - Selamat datang di area kampus.`).
  - **Mode Simulasi Pengujian**: Segmented control (*Dalam Kampus* vs *Luar Kampus*) untuk mempermudah demonstrasi aplikasi kepada dosen.

---

## 🚀 Cara Menjalankan Aplikasi

1. Buka terminal di folder proyek:
   ```bash
   npx expo start -c
   ```
2. Scan QR Code menggunakan aplikasi **Expo Go** di HP kamu.
