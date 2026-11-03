const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    namaKategori: {
        type: String,
        required: true,
        unique: true
    },
    deskripsi: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Category', categorySchema);