import mongoose from "mongoose";

const carSchema = mongoose.Schema({
    make: {
        type: String, 
        required: true,
    },
    brand: {
        type: String, 
        required: true,
    },
    year: {
        type: Number, 
        required: true,
    },
    imageUrl: { // Add this field
        type: String,
        required: false, // Set to true if you want every car to have an image
    }, 
    imagePath: {
        type: String, 
        required: false,
    },
    inventoryCount: {
        type: Number,
        default: 0,
        required: true,
    },
}, {
    timestamps: true,
});

export const Car = mongoose.model('Car', carSchema);
