const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
    company: { type: String, required: true },
    content: { type: String, required: true },
});

module.exports = mongoose.model('Paper', PaperSchema);
