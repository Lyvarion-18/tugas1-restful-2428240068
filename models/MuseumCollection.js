const mongoose = require('mongoose');

const museumCollectionSchema = new mongoose.Schema({
    namaKoleksi: {
        type: String,
        required: true
    },

    kategori: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    periode: {
        type: String,
        required: true
    },

    asalDaerah: {
        type: String,
        default: ''
    },

    tahunDitemukan: {
        type: Number
    },

    // EMBEDDING
    detailPenemuan: {
        lokasiPenemuan: {
            type: String,
            default: ''
        },
        kondisi: {
            type: String,
            default: ''
        },
        keterangan: {
            type: String,
            default: ''
        }
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('MuseumCollection', museumCollectionSchema);