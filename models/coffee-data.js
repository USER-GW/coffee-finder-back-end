const mongoose = require('mongoose');

// Coffee Data Schema
const coffeeDataSchema = new mongoose.Schema({
    Quality: { type: Number, required: true, min: 0, max: 5 },
    Staff: { type: Number, required: true, min: 0, max: 5 },
    Aesthetics: { type: Number, required: true, min: 0, max: 5 },
    Good4Work: { type: Number, required: true, min: 0, max: 5 },
    WiFi: { type: Number, required: true, min: 0, max: 5 },
    Food: { type: Number, min: 0, max: 5 },
    Veggie: { type: Number, min: 0, max: 5 },
    // Cleanliness: { type: Number, min: 0, max: 5 },
    Price: { type: Number, min: 0, max: 5 },
    Accessibility: { type: Number, min: 0, max: 5 },
    Loud: { type: Number, min: 0, max: 5 },
    Good4Meetings: { type: Number, min: 0, max: 5 },
    Rating: { type: Number, required: true, min: 0, max: 5 },
});

const shopsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    coffeeData: {  
        type: coffeeDataSchema,
    },
});


const CoffeeShops = mongoose.model('Shops', shopsSchema);

module.exports = {
    CoffeeShops,
};