# Aplikasi Manajemen Task & Project (Task Management App)

Aplikasi web *full-stack end-to-end* untuk mengelola **Project** dan **Task**, dibangun untuk memenuhi persyaratan **Technical Interview – Web Developer di SPEND GROUP**.

Repositori ini disusun menggunakan pendekatan **Monorepo** yang rapi, terdiri dari frontend **Next.js (App Router)**, backend REST API **Express.js + TypeScript**, serta **Prisma ORM** yang terhubung ke database relasional (**PostgreSQL**, dengan opsi fallback **SQLite** instan tanpa konfigurasi tambahan untuk pengujian lokal).

---

## 🌟 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Arsitektur & Tech Stack](#-arsitektur--tech-stack)
- [Alasan Pemilihan Library & Teknologi](#-alasan-pemilihan-library--teknologi)
- [Struktur Folder Monorepo](#-struktur-folder-monorepo)
- [Prasyarat Sistem](#-prasyarat-sistem)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Panduan Menjalankan Aplikasi](#-panduan-menjalankan-aplikasi)
  - [Opsi A: Pengujian Lokal Instan (SQLite - 0 Ketergantungan Eksternal)](#opsi-a-pengujian-lokal-instan-rekomendasi-evaluasi-cepat)
  - [Opsi B: PostgreSQL dengan Docker Compose](#opsi-b-postgresql-dengan-docker-compose)
  - [Opsi C: PostgreSQL Lokal Asli](#opsi-c-postgresql-lokal-asli)
- [Skema & Migrasi Database](#-skema--migrasi-database)
- [Dokumentasi REST API](#-dokumentasi-rest-api)
- [Asumsi & Keputusan Desain](#-asumsi--keputusan-desain)
- [Uji Coba & Build](#-uji-coba--build)

---

## ✨ Fitur Utama

### 1. Sisi Frontend (Client-Side)
- **Dashboard Daftar Project (`/`)**:
  - Menampilkan seluruh project dalam kartu (*card*) responsif.
  - Indikator kemajuan (*progress bar*) persentase penyelesaian dan rincian jumlah status (*To Do*, *Sedang Dikerjakan*, *Selesai*).
  - Ringkasan metrik global (*Total Project, Total Task, Sedang Dikerjakan, Telah Selesai*).
  - Fitur pencarian project berdasarkan nama atau deskripsi.
  - Modal pembuatan project baru dan modal edit project dengan validasi input.
  - Fitur hapus project dengan dialog konfirmasi (*cascade delete* pada seluruh task terkait).
- **Halaman Detail Project (`/projects/[id]`)**:
  - Navigasi *breadcrumb* kembali ke daftar project.
  - Header informasi project lengkap dengan *progress bar* dan statistik counter.
  - **Pencarian & Filter Task**:
    * **Pencarian Kata Kunci**: Pencarian teks instan pada judul maupun deskripsi task.
    * **Filter Status**: `Semua`, `To Do`, `Sedang Dikerjakan`, `Selesai`.
    * **Filter Prioritas**: `Semua Prioritas`, `Rendah`, `Sedang`, `Tinggi`.
  - **Manajemen Task (CRUD)**:
    * Tambah task baru melalui modal formulir interaktif.
    * Edit judul, deskripsi, prioritas, dan status task.
    * Hapus task dengan konfirmasi dialog modal yang aman.
    * **1-Click Status Switcher**: Tombol cepat untuk mengubah status task (`todo`, `in_progress`, `done`) dengan *optimistic UI update*.
    * **Label Prioritas Visual**: Indikator warna badge yang jelas (Hijau/Sky untuk Rendah, Indigo untuk Sedang, Rose/Merah untuk Tinggi).
- **Manajemen State UI Lengkap**:
  - **Loading State**: Tampilan *skeleton loader* berdenyut yang halus saat proses *fetching* data.
  - **Empty State**: Ilustrasi dan pesan informatif saat belum ada project, belum ada task, atau tidak ada hasil yang cocok dengan pencarian/filter.
  - **Error State**: Pesan galat jelas dengan tombol *Coba Lagi*.
  - **Success State**: Notifikasi *toast* interaktif (`react-hot-toast`) pada setiap aksi pembuatan, pembaruan, penghapusan, dan pengubahan status.
- **Desain Responsif**: Tampilan antarmuka fleksibel dan nyaman diakses pada perangkat seluler (*mobile*) maupun desktop.

### 2. Sisi Backend (Server-Side & Database)
- **RESTful API**: Menyediakan endpoint standar untuk entitas Project dan Task.
- **Relasi Database**: Relasi *One-to-Many* (Satu Project memiliki Banyak Task) dengan penghapusan kaskade (*onDelete: Cascade*).
- **Validasi Skema**: Validasi ketat pada *body*, *query*, dan *parameter URL* menggunakan pustaka **Zod**.
- **Penanganan Galat Terpusat**: *Error middleware* yang mengembalikan struktur respon error yang konsisten.
- **Keamanan & Logging**: Middleware produksi mencakup CORS, Helmet, dan Morgan.

---

## 🛠 Arsitektur & Tech Stack

| Bagian | Teknologi | Versi | Peran |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router) | 14.2.x | Framework React modern dengan routing berbasis folder |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) | 5.7.x | *Static typing* end-to-end untuk mencegah bug runtime |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 3.4.x | Utility-first CSS untuk UI yang bersih, rapi, dan responsif |
| **Ikon** | [Lucide React](https://lucide.dev/) | 0.468.x | Set ikon SVG yang ringan dan modern |
| **Notifikasi** | [React Hot Toast](https://react-hot-toast.com/) | 2.4.x | Notifikasi feedback pengguna yang elegan |
| **Backend** | [Express.js](https://expressjs.com/) | 4.21.x | Framework REST API Node.js yang cepat dan fleksibel |
| **ORM** | [Prisma ORM](https://www.prisma.io/) | 5.22.x | Type-safe ORM untuk manajemen skema, migrasi, dan seed |
| **Validasi** | [Zod](https://zod.dev/) | 3.23.x | Validasi skema runtime berbasis TypeScript |
| **Database** | PostgreSQL / SQLite | 16 / 3 | Database relasional SQL |

---

## 💡 Alasan Pemilihan Library & Teknologi

Sesuai instruksi pada dokumen tes teknis:

1. **Next.js (App Router)**:
   - Pendekatan routing berbasis direktori (`/` dan `/projects/[id]`) memudahkan penyusunan halaman dan pemisahan *layout* secara modular.
2. **Express.js + TypeScript**:
   - Struktur berlapis (*routes* -> *controllers* -> *services* -> *validations*) sangat mudah dipahami (*readable*), dipelihara (*maintainable*), dan diuji (*testable*) tanpa *overhead* yang berlebihan.
3. **Prisma ORM**:
   - Memastikan integritas tipe data antara database dan backend secara otomatis, mempermudah relasi *one-to-many*, serta mengelola skema migrasi dan seeding dengan konsisten.
4. **Zod**:
   - Memberikan jaminan keamanan tipe data saat runtime dan menghasilkan pesan kesalahan validasi yang jelas bagi pengguna.
5. **Tailwind CSS**:
   - Memprioritaskan kerapian dan kemudahan penggunaan (*usability*) tanpa visual yang berlebihan.
6. **Dukungan Dual Database (PostgreSQL & SQLite)**:
   - PostgreSQL disediakan sebagai database utama yang disyaratkan dalam soal (lengkap dengan konfigurasi Docker Compose & file migrasi DDL SQL). Namun, disediakan pula script SQLite otomatis agar penguji dapat langsung mengevaluasi fungsionalitas aplikasi secara instan tanpa hambatan lingkungan instalasi.

---

## 📁 Struktur Folder Monorepo

```text
task-management-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              # Skema Prisma aktif
│   │   ├── schema.postgres.prisma     # Referensi skema PostgreSQL
│   │   ├── schema.sqlite.prisma       # Referensi skema SQLite
│   │   ├── seed.ts                    # Script data awal (seed)
│   │   └── migrations/
│   │       └── 20260910000000_init/
│   │           └── migration.sql      # File DDL SQL migrasi PostgreSQL
│   ├── src/
│   │   ├── config/                    # Konfigurasi env & Prisma
│   │   ├── controllers/               # Handler request HTTP
│   │   ├── middleware/                # Middleware error & validasi Zod
│   │   ├── routes/                    # Definisi rute REST API
│   │   ├── services/                  # Logika bisnis & interaksi database
│   │   ├── validations/               # Skema validasi Zod
│   │   └── index.ts                   # Entry point server Express
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout & Toaster
│   │   │   ├── page.tsx               # Halaman Dashboard Project
│   │   │   ├── globals.css            # Pengaturan CSS & Tailwind
│   │   │   └── projects/[id]/
│   │   │       └── page.tsx           # Halaman Detail Project & Task
│   │   ├── components/                # Komponen UI modular
│   │   │   ├── Badge.tsx              # Label status dan prioritas
│   │   │   ├── ConfirmDialog.tsx      # Modal dialog konfirmasi hapus
│   │   │   ├── EmptyState.tsx         # Tampilan kondisi kosong
│   │   │   ├── ErrorState.tsx         # Tampilan kondisi error
│   │   │   ├── LoadingSkeleton.tsx    # Komponen loading skeleton
│   │   │   ├── Modal.tsx              # Komponen dasar modal
│   │   │   ├── Navbar.tsx             # Bilah navigasi atas
│   │   │   ├── ProgressBar.tsx        # Indikator progres penyelesaian
│   │   │   ├── ProjectCard.tsx        # Kartu ringkasan project
│   │   │   ├── ProjectModal.tsx       # Formulir tambah/edit project
│   │   │   ├── TaskCard.tsx           # Kartu task dengan pengubah status
│   │   │   ├── TaskFilters.tsx        # Fitur pencarian & filter task
│   │   │   ├── TaskModal.tsx          # Formulir tambah/edit task
│   │   │   └── ToastProvider.tsx      # Konfigurasi notifikasi toast
│   │   ├── lib/
│   │   │   ├── api.ts                 # Klien API REST
│   │   │   └── utils.ts               # Fungsi pembantu kelas CSS & format tanggal
│   │   └── types/
│   │       └── index.ts               # Definisi tipe TypeScript
│   ├── .env.example
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml                 # Layanan kontainer PostgreSQL
├── package.json                       # Konfigurasi npm workspaces & script root
└── README.md                          # Dokumentasi lengkap
```

---

## 📋 Prasyarat Sistem

- **Node.js**: `v18.17.0` atau yang lebih baru (diuji pada `v20.18.0`)
- **npm**: `v9.x` atau `v10.x`
- Opsional: **Docker & Docker Compose** (jika ingin menjalankan PostgreSQL via kontainer)

---

## ⚙️ Konfigurasi Environment

### Backend (`backend/.env`)

Salin `backend/.env.example` ke `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Contoh variabel:
```env
PORT=5001
NODE_ENV=development

# Opsi SQLite (evaluasi instan):
DATABASE_URL="file:./dev.db"

# Opsi PostgreSQL (Docker / Lokal):
# DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/task_management_db?schema=public"

CLIENT_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

Salin `frontend/.env.example` ke `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
```

Contoh variabel:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 🚀 Panduan Menjalankan Aplikasi

Anda dapat menjalankan aplikasi menggunakan **Opsi A (SQLite Instan)** atau **Opsi B (PostgreSQL)**.

### Opsi A: Pengujian Lokal Instan (Rekomendasi Evaluasi Cepat)

Tidak memerlukan instalasi service database eksternal.

1. **Install dependensi**:
   ```bash
   npm install
   ```

2. **Inisialisasi Database SQLite & Data Awal (Seed)**:
   ```bash
   npm run db:use-sqlite --workspace=backend
   ```
   *(Perintah ini akan membuat database lokal `dev.db`, menerapkan skema tabel, dan mengisi 3 project serta 10 task awal).*

3. **Jalankan Frontend & Backend Sekaligus**:
   ```bash
   npm run dev
   ```

4. **Buka di Browser**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

### Opsi B: PostgreSQL dengan Docker Compose

1. **Jalankan Kontainer PostgreSQL**:
   ```bash
   docker compose up -d
   ```

2. **Atur Environment Backend**:
   Pada file `backend/.env`, gunakan URL PostgreSQL:
   ```env
   DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/task_management_db?schema=public"
   ```

3. **Sinkronisasi Skema & Seed Data ke PostgreSQL**:
   ```bash
   npm run db:use-postgres --workspace=backend
   ```

4. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```

---

### Opsi C: PostgreSQL Lokal Asli

1. Buat database:
   ```sql
   CREATE DATABASE task_management_db;
   ```
2. Sesuaikan username dan password pada `DATABASE_URL` di `backend/.env`.
3. Jalankan migrasi dan seed:
   ```bash
   npm run db:use-postgres --workspace=backend
   ```
4. Jalankan aplikasi dengan `npm run dev`.

---

## 🗄 Skema & Migrasi Database

### Relasi Entitas
```text
+------------------------------------+          +------------------------------------+
|             Project                |          |                Task                |
+------------------------------------+          +------------------------------------+
| id          : UUID / String (PK)   |<---+     | id          : UUID / String (PK)   |
| title       : String (NOT NULL)    |    |     | title       : String (NOT NULL)    |
| description : String (NULLABLE)    |    +-----| projectId   : UUID / String (FK)   |
| createdAt   : DateTime (DEFAULT)   | 1      N | description : String (NULLABLE)    |
| updatedAt   : DateTime (UPDATED)   |          | status      : Enum (todo,          |
+------------------------------------+          |               in_progress, done)   |
                                                | priority    : Enum (low,           |
                                                |               medium, high)        |
                                                | createdAt   : DateTime (DEFAULT)   |
                                                | updatedAt   : DateTime (UPDATED)   |
                                                +------------------------------------+
```

- **Cascade Delete**: Ketika suatu `Project` dihapus, seluruh `Task` yang berada di dalamnya akan terhapus otomatis secara bersih.
- **Index**: Terdapat index pada `projectId`, `status`, dan `priority` untuk kecepatan pencarian data.

---

## 📡 Dokumentasi REST API

Base URL: `http://localhost:5001/api`

### Health Check
- `GET /health` - Memeriksa status kesehatan layanan backend.

### Endpoint Project
| Metode | Endpoint | Deskripsi | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/projects` | Mengambil seluruh project beserta statistik task | - |
| `GET` | `/projects/:id` | Mengambil detail satu project beserta tasknya | - |
| `POST` | `/projects` | Membuat project baru | `{ "title": string, "description"?: string }` |
| `PATCH` | `/projects/:id` | Memperbarui project | `{ "title"?: string, "description"?: string }` |
| `DELETE` | `/projects/:id` | Menghapus project beserta seluruh task di dalamnya | - |

### Endpoint Task
| Metode | Endpoint | Deskripsi | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Mengambil daftar task dengan filter | Query: `projectId`, `search`, `status`, `priority`, `sortBy`, `order` |
| `GET` | `/tasks/:id` | Mengambil detail satu task | - |
| `POST` | `/tasks` | Membuat task baru | Body: `{ "title": string, "description"?: string, "status"?: "todo" \| "in_progress" \| "done", "priority"?: "low" \| "medium" \| "high", "projectId": string }` |
| `PATCH` | `/tasks/:id` | Memperbarui task | Body: `{ "title"?: string, "description"?: string, "status"?: string, "priority"?: string }` |
| `DELETE` | `/tasks/:id` | Menghapus task | - |

### Format Standar Respon

**Berhasil (200 / 201)**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Project berhasil dibuat"
}
```

**Gagal (400 / 404 / 500)**:
```json
{
  "success": false,
  "error": {
    "message": "Validasi data gagal",
    "details": [
      { "field": "title", "message": "Judul project wajib diisi" }
    ]
  }
}
```

---

## 📌 Asumsi & Keputusan Desain

1. **Struktur Monorepo**:
   - Menempatkan backend dan frontend dalam satu repositori menggunakan npm workspaces sesuai saran pada instruksi tes. Hal ini menyederhanakan proses instalasi dan memungkinkan eksekusi frontend & backend secara bersamaan melalui satu perintah (`npm run dev`).
2. **Status & Prioritas Task**:
   - Nilai status: `todo` (Akan Dikerjakan), `in_progress` (Sedang Dikerjakan), dan `done` (Selesai).
   - Nilai prioritas: `low` (Rendah), `medium` (Sedang), dan `high` (Tinggi).
   - Pengubahan status pada kartu task dilakukan secara instan dengan *optimistic UI update*. Jika koneksi bermasalah, state otomatis dikembalikan ke nilai semula disertai notifikasi toast error.
3. **Fleksibilitas Database**:
   - Menjaga kepatuhan 100% terhadap spesifikasi PostgreSQL sambil menyediakan skema SQLite yang siap pakai agar proses review tes berlangsung cepat dan nyaman.
4. **Validasi Menyeluruh**:
   - Semua input divalidasi ganda: pada sisi antarmuka pengguna (modal formulir) dan sisi controller backend via skema Zod.

---

## 🧪 Uji Coba & Build

Untuk memastikan semua modul terkompilasi tanpa kesalahan:

```bash
# Build backend
npm run build --workspace=backend

# Build frontend
npm run build --workspace=frontend

# Jalankan seeder database
npm run db:seed --workspace=backend
```

---

*Dibuat untuk evaluasi tes teknis posisi Web Developer di SPEND GROUP.*
