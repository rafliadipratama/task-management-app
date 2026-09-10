import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database...');

  // Hapus data lama
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  // Project 1: Redesain Aplikasi Mobile E-Commerce
  await prisma.project.create({
    data: {
      title: 'Redesain Aplikasi Mobile E-Commerce',
      description: 'Pembaruan antarmuka alur checkout, pengalaman keranjang belanja, dan rekomendasi beranda.',
      tasks: {
        create: [
          {
            title: 'Desain Wireframe Alur Checkout',
            description: 'Membuat prototipe interaktif di Figma untuk fitur one-click checkout dan pemilihan alamat.',
            status: 'done',
            priority: 'high',
          },
          {
            title: 'Integrasi Payment Gateway',
            description: 'Integrasi webhook pembayaran untuk menangani transaksi kartu kredit dan QRIS.',
            status: 'in_progress',
            priority: 'high',
          },
          {
            title: 'Optimasi Mesin Pencarian Produk',
            description: 'Meningkatkan query pencarian otomatis dengan debounce dan filter kategori produk.',
            status: 'todo',
            priority: 'medium',
          },
          {
            title: 'Konfigurasi Notifikasi Push',
            description: 'Mengirimkan notifikasi status pengiriman paket dan promo diskon.',
            status: 'todo',
            priority: 'low',
          },
        ],
      },
    },
  });

  // Project 2: Portal Absensi & HR Internal
  await prisma.project.create({
    data: {
      title: 'Portal Absensi & HR Internal',
      description: 'Aplikasi manajemen karyawan untuk jadwal shift kerja, pengajuan cuti, dan rekap payroll bulanan.',
      tasks: {
        create: [
          {
            title: 'Skema Database Pola Shift Kerja',
            description: 'Merancang tabel untuk shift bergilir, aturan lembur, dan kalender hari libur nasional.',
            status: 'done',
            priority: 'medium',
          },
          {
            title: 'API Verifikasi Titik Lokasi Geolocation',
            description: 'Validasi koordinat GPS saat check-in karyawan agar sesuai radius area kantor.',
            status: 'in_progress',
            priority: 'high',
          },
          {
            title: 'Ekspor Rekap Absensi Bulanan ke Excel',
            description: 'Membuat template spreadsheet laporan jam kerja dan potongan otomatis.',
            status: 'todo',
            priority: 'low',
          },
        ],
      },
    },
  });

  // Project 3: Audit Keamanan & Infrastruktur Cloud
  await prisma.project.create({
    data: {
      title: 'Audit Keamanan & Infrastruktur Cloud',
      description: 'Migrasi arsitektur monolitik ke microservices berbasis kontainer serta pengetatan izin akses IAM.',
      tasks: {
        create: [
          {
            title: 'Setup Otomatisasi CI/CD Pipeline',
            description: 'Konfigurasi alur kerja GitHub Actions untuk automated test dan deployment tanpa downtime.',
            status: 'done',
            priority: 'high',
          },
          {
            title: 'Rotasi Sertifikat SSL & Kunci API Root',
            description: 'Pembaruan berkala SSL gratis via Let\'s Encrypt dan migrasi secrets ke Vault.',
            status: 'done',
            priority: 'high',
          },
          {
            title: 'Uji Beban Performa (Load Testing)',
            description: 'Simulasi beban 15.000 request per detik menjelang promo tanggal kembar menggunakan k6.',
            status: 'in_progress',
            priority: 'medium',
          },
        ],
      },
    },
  });

  console.log(`✅ Seeding database berhasil! Dibuat 3 project dengan 10 task.`);
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
