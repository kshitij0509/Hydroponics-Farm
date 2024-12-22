const mongoose = require('mongoose');

const CropReadingSchema = new mongoose.Schema({
    datetime: { type: Date, required: true },
    name: { type: String, required: true },
    ph: { type: Number, required: true },
    ec: { type: Number, required: true },
    temperature: { type: Number, required: true },
    batch_no: { type: String, required: true },
    // photo_url: { type: String, required: false }, // URL of the image from Cloudinary
     crop: {type: mongoose.Schema.Types.ObjectId, ref:'Crop' }
}, { timestamps: true });

module.exports = mongoose.model('CropReading', CropReadingSchema);
