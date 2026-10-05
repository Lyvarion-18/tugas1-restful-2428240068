const express = require("express");
const app = express();

app.use(express.json());


// DATA AWAL
let collections = [
    {
        id: 1,
        namaKoleksi: "Arca Buddha Bukit Siguntang",
        kategori: "arca",
        periode: "Sriwijaya",
        asalDaerah: "Palembang",
        tahunDitemukan: 1920
    },
    {
        id: 2,
        namaKoleksi: "Prasasti Kedukan Bukit",
        kategori: "prasasti",
        periode: "Sriwijaya",
        asalDaerah: "Palembang",
        tahunDitemukan: 1920
    },
    {
        id: 3,
        namaKoleksi: "Kendi Keramik Kuno",
        kategori: "keramik",
        periode: "Kolonial",
        asalDaerah: "Palembang",
        tahunDitemukan: 1955
    }
];

let nextId = 4;


// GET /
// Menampilkan informasi API
app.get("/", (req, res) => {
    res.json({
        nama: "Varrel Fernando",
        nim: "2428240068",
        topik: 13,
        endpoints: [
            "GET /museum-collections",
            "GET /museum-collections/:id",
            "POST /museum-collections",
            "PUT /museum-collections/:id",
            "DELETE /museum-collections/:id",
            "GET /museum-collections?periode=Sriwijaya"
        ]
    });
});


// GET /museum-collections
// Menampilkan semua koleksi museum
app.get("/museum-collections", (req, res) => {

    const periode = req.query.periode;

    if (periode) {
        const hasil = collections.filter(
            (item) => item.periode.toLowerCase() === periode.toLowerCase()
        );

        return res.json(hasil);
    }

    res.json(collections);
});


// GET /museum-collections/:id
// Menampilkan satu koleksi berdasarkan id
app.get("/museum-collections/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const collection = collections.find(
        (item) => item.id === id
    );

    if (!collection) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    res.json(collection);
});


// POST /museum-collections
// Menambahkan koleksi baru
app.post("/museum-collections", (req, res) => {

    const {
        namaKoleksi,
        kategori,
        periode,
        asalDaerah,
        tahunDitemukan
    } = req.body;

    if (!namaKoleksi || !kategori || !periode) {
        return res.status(400).json({
            status: "error",
            message: "Field wajib belum lengkap",
            data: null
        });
    }

    const newCollection = {
        id: nextId,
        namaKoleksi: namaKoleksi,
        kategori: kategori,
        periode: periode,
        asalDaerah: asalDaerah,
        tahunDitemukan: tahunDitemukan
    };

    collections.push(newCollection);
    nextId++;

    res.status(201).json({
        status: "success",
        message: "Data koleksi berhasil ditambahkan",
        data: newCollection
    });
});


// PUT /museum-collections/:id
// Mengubah seluruh data koleksi
app.put("/museum-collections/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = collections.findIndex(
        (item) => item.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    const {
        namaKoleksi,
        kategori,
        periode,
        asalDaerah,
        tahunDitemukan
    } = req.body;

    if (!namaKoleksi || !kategori || !periode) {
        return res.status(400).json({
            status: "error",
            message: "Field wajib belum lengkap",
            data: null
        });
    }

    const updatedCollection = {
        id: id,
        namaKoleksi: namaKoleksi,
        kategori: kategori,
        periode: periode,
        asalDaerah: asalDaerah,
        tahunDitemukan: tahunDitemukan
    };

    collections[index] = updatedCollection;

    res.json({
        status: "success",
        message: "Data koleksi berhasil diubah",
        data: updatedCollection
    });
});


// DELETE /museum-collections/:id
// Menghapus koleksi berdasarkan id
app.delete("/museum-collections/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = collections.findIndex(
        (item) => item.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    collections.splice(index, 1);

    res.status(200).json({
        status: "success",
        message: `Data koleksi dengan id ${id} berhasil dihapus`,
        data: null
    });
});


// Jika endpoint tidak ditemukan
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Endpoint tidak ditemukan",
        data: null
    });
});


// MENJALANKAN SERVER
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;