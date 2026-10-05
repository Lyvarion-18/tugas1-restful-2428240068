# Tugas 1 RESTful API Express

## Identitas

Nama: Varrel Fernando

NIM: 2428240068

Topik 13: Museum - Koleksi Museum

Endpoint: /museum-collections

## Deskripsi

RESTful API untuk mengelola data koleksi museum.

API ini menyediakan fitur:
- Menampilkan seluruh data koleksi museum
- Menampilkan data berdasarkan ID
- Menambahkan data koleksi museum
- Mengubah data koleksi museum
- Menghapus data koleksi museum
- Filter data berdasarkan periode

## Endpoint

### GET /museum-collections

Menampilkan seluruh data koleksi museum.

Contoh:

/museum-collections

### GET /museum-collections/:id

Menampilkan data koleksi museum berdasarkan ID.

Contoh:

/museum-collections/1

### GET /museum-collections?periode=Sriwijaya

Menampilkan data koleksi berdasarkan periode.

Contoh:

/museum-collections?periode=Sriwijaya

### POST /museum-collections

Menambahkan data koleksi museum.

Contoh request:

{
  "namaKoleksi": "Arca Ganesha",
  "kategori": "arca",
  "periode": "Sriwijaya",
  "asalDaerah": "Palembang",
  "tahunDitemukan": 1930
}

### PUT /museum-collections/:id

Mengubah data koleksi museum berdasarkan ID.

Contoh:

/museum-collections/1

### DELETE /museum-collections/:id

Menghapus data koleksi museum berdasarkan ID.

Contoh:

/museum-collections/4

## Field Data

| Field | Tipe | Keterangan |
|---|---|---|
| namaKoleksi | string | Nama koleksi museum |
| kategori | string | Kategori koleksi |
| periode | string | Periode sejarah koleksi |
| asalDaerah | string | Asal daerah koleksi |
| tahunDitemukan | number | Tahun koleksi ditemukan |

## Menjalankan Project

Install dependency:

npm install

Menjalankan server:

npm start

Server berjalan pada:

http://localhost:3000

## Repository

Repository GitHub:

[Akan ditambahkan setelah repository dibuat.](https://github.com/Lyvarion-18/tugas1-restful-2428240068)

## Deployment

Aplikasi dapat diakses melalui link berikut:

Akan ditambahkan setelah deployment Vercel selesai.