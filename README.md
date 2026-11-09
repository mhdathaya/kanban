# TaskBoard Kanban

Aplikasi Kanban berbasis web untuk mengelola tugas dalam empat status: Backlog, To Do, In Progress, dan Done. Pengguna dapat membuat, mengedit, menghapus, memindahkan, dan memfilter tugas, serta mengelola profil akun. Data tugas disimpan di browser; autentikasi menggunakan API DummyJSON.

## Technology stack

- React 19 dan TypeScript
- Vite 8
- React Router
- Zustand
- Axios dengan request/response interceptor dan refresh token
- Ant Design (komponen UI lokal) dan `@dnd-kit` untuk drag-and-drop

## Prasyarat

- Node.js yang kompatibel dengan Vite 8 (Node.js 20.19+ atau 22.12+)
- npm
- Koneksi internet untuk autentikasi ke DummyJSON (`https://dummyjson.com`)

## Installation guide

1. Clone atau unduh repository ini, lalu buka folder project:

   ```bash
   cd kanban
   ```

2. Pasang dependency:

   ```bash
   npm install
   ```

## Environment configuration

Aplikasi saat ini tidak memerlukan file `.env`. URL API DummyJSON dikonfigurasi di `src/services/api.ts`. Untuk mengganti endpoint, ubah nilai `API_BASE_URL` pada file tersebut. Pastikan browser memiliki koneksi internet untuk login dan refresh sesi.

## How to run the application

Jalankan server development:

```bash
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal (umumnya `http://localhost:5173`).

Perintah lain:

```bash
npm run build    # Type-check dan build production ke dist/
npm run preview  # Preview hasil build production
npm run lint     # Jalankan Oxlint
```

## Test account credentials

Gunakan akun uji DummyJSON berikut pada halaman login:

- **Username:** `emilys`
- **Password:** `emilyspass`

Login memerlukan koneksi internet karena kredensial diverifikasi oleh DummyJSON.

