const express = require("express");
const mongoose = require("mongoose");
const app = express();

const connectDB = require("./config/database");
const MuseumCollection = require("./models/MuseumCollection");
const Category = require("./models/Category");

app.use(express.json());

// GET / - Informasi API
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
            "DELETE /museum-collections/:id"
        ]
    });
});

// GET /museum-collections
// Filtering, Pagination, Sorting, Projection
app.get("/museum-collections", async (req, res) => {
    try {
        const {
            periode,
            kategori,
            page = 1,
            limit = 10,
            sortBy = "namaKoleksi",
            order = "asc",
            fields
        } = req.query;

        const filter = {};

        if (periode) {
            filter.periode = {
                $regex: periode,
                $options: "i"
            };
        }

        if (kategori) {
            if (!mongoose.Types.ObjectId.isValid(kategori)) {
                return res.status(400).json({
                    status: "error",
                    message: "ID kategori tidak valid"
                });
            }

            filter.kategori = kategori;
        }

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.min(
            100,
            Math.max(1, parseInt(limit, 10) || 10)
        );

        const allowedSortFields = [
            "namaKoleksi",
            "periode",
            "asalDaerah",
            "tahunDitemukan",
            "createdAt"
        ];

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "namaKoleksi";

        const sortOrder = String(order).toLowerCase() === "desc" ? -1 : 1;

        const projection = fields
            ? fields.split(",").join(" ")
            : "";

        const total = await MuseumCollection.countDocuments(filter);

        const collections = await MuseumCollection.find(filter)
            .select(projection)
            .populate("kategori")
            .sort({ [sortField]: sortOrder })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            status: "success",
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
            data: collections
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// GET /museum-collections/:id
app.get("/museum-collections/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "ID koleksi tidak valid"
            });
        }

        const collection = await MuseumCollection.findById(req.params.id)
            .populate("kategori");

        if (!collection) {
            return res.status(404).json({
                status: "error",
                message: "Data koleksi tidak ditemukan"
            });
        }

        res.json({
            status: "success",
            data: collection
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// POST /museum-collections
app.post("/museum-collections", async (req, res) => {
    try {
        const {
            namaKoleksi,
            kategori,
            periode,
            asalDaerah,
            tahunDitemukan,
            detailPenemuan
        } = req.body;

        if (!namaKoleksi || !kategori || !periode) {
            return res.status(400).json({
                status: "error",
                message: "Field wajib belum lengkap"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(kategori)) {
            return res.status(400).json({
                status: "error",
                message: "ID kategori tidak valid"
            });
        }

        const categoryExists = await Category.findById(kategori);

        if (!categoryExists) {
            return res.status(404).json({
                status: "error",
                message: "Kategori tidak ditemukan"
            });
        }

        const newCollection = await MuseumCollection.create({
            namaKoleksi,
            kategori,
            periode,
            asalDaerah,
            tahunDitemukan,
            detailPenemuan
        });

        await newCollection.populate("kategori");

        res.status(201).json({
            status: "success",
            message: "Data koleksi berhasil ditambahkan",
            data: newCollection
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// PUT /museum-collections/:id
app.put("/museum-collections/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "ID koleksi tidak valid"
            });
        }

        const {
            namaKoleksi,
            kategori,
            periode,
            asalDaerah,
            tahunDitemukan,
            detailPenemuan
        } = req.body;

        if (!namaKoleksi || !kategori || !periode) {
            return res.status(400).json({
                status: "error",
                message: "Field wajib belum lengkap"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(kategori)) {
            return res.status(400).json({
                status: "error",
                message: "ID kategori tidak valid"
            });
        }

        const categoryExists = await Category.findById(kategori);

        if (!categoryExists) {
            return res.status(404).json({
                status: "error",
                message: "Kategori tidak ditemukan"
            });
        }

        const updatedCollection = await MuseumCollection.findByIdAndUpdate(
            req.params.id,
            {
                namaKoleksi,
                kategori,
                periode,
                asalDaerah,
                tahunDitemukan,
                detailPenemuan
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("kategori");

        if (!updatedCollection) {
            return res.status(404).json({
                status: "error",
                message: "Data koleksi tidak ditemukan"
            });
        }

        res.json({
            status: "success",
            message: "Data koleksi berhasil diubah",
            data: updatedCollection
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// DELETE /museum-collections/:id
app.delete("/museum-collections/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "ID koleksi tidak valid"
            });
        }

        const deletedCollection = await MuseumCollection.findByIdAndDelete(
            req.params.id
        );

        if (!deletedCollection) {
            return res.status(404).json({
                status: "error",
                message: "Data koleksi tidak ditemukan"
            });
        }

        res.json({
            status: "success",
            message: "Data koleksi berhasil dihapus",
            data: deletedCollection
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// Endpoint tidak ditemukan
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Endpoint tidak ditemukan"
    });
});

// Menjalankan server
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server berjalan di http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Gagal menjalankan server:", error);
        });
}

module.exports = app;