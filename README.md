# ⛽ FuelTrip ID - Kalkulator Biaya Bahan Bakar & Mudik

Aplikasi web kalkulator estimasi konsumsi bahan bakar dan total biaya operasional perjalanan harian maupun mudik dengan kalkulasi instan, preset kendaraan, dan format mata uang Rupiah.

🌐 **Live Demo**: [https://raffi-cmd.github.io/fueltrip-id/](https://raffi-cmd.github.io/fueltrip-id/)

---

## 🌟 Fitur Utama

- **Kalkulasi Real-Time & Akurat**: Menghitung estimasi volume BBM (Liter), total biaya (IDR), biaya per KM, dan bagi rata per penumpang (*Split Cost*).
- **Tipe Perjalanan**: Mendukung Sekali Jalan (*One-Way*) dan Pulang-Pergi (*Round-Trip 2x*).
- **Preset Kendaraan Indonesia**: Motor Matic, Motor Bebek, Maxi Scooter, LCGC/City Car, LMPV (Avanza/Xenia/Xpander), Compact SUV, Diesel Modern, Medium MPV, dan Large SUV.
- **Preset Harga BBM**: Pertamina (Pertalite, Pertamax, Turbo, Bio Solar, Dexlite, Dex), Shell, BP, dan Vivo.
- **Rute Populer & Mudik**: Rekomendasi jarak kilometer dan estimasi tarif tol (Tol Trans Jawa, Trans Sumatera, Komuter Jabodetabek).
- **Bagi Biaya (*Carpooling / Split Cost*)**: Menghitung kontribusi per orang untuk 1-10 penumpang.
- **Ekspor & Berbagi**: Salin rincian ke clipboard dan tombol langsung kirim ringkasan ke WhatsApp.
- **Riwayat Komputasi**: Menyimpan 5 perhitungan terakhir di `localStorage`.
- **Mode Gelap / Terang**: UI bertema modern fintech/otomotif dengan responsivitas tinggi.
- **100% Client-Side / Offline Ready**: Berjalan cepat tanpa latensi server.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Icon Set**: Lucide React
- **Testing**: Vitest (100% test coverage domain math)
- **Deployment**: GitHub Pages (via GitHub Actions)

---

## 🚀 Menjalankan di Lokal

1. Clone repositori:
   ```bash
   git clone https://github.com/raffi-cmd/fueltrip-id.git
   cd fueltrip-id
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Jalankan pengujian (Unit Tests):
   ```bash
   npm test
   ```

5. Build untuk produksi:
   ```bash
   npm run build
   ```

---

## 📄 Lisensi

MIT License © 2026 FuelTrip ID
