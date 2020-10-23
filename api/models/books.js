const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    price: { type: Number, required: true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true }
});

module.exports = mongoose.model('Book', bookSchema);