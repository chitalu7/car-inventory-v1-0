import express from 'express';
import { Car } from '../models/carModel.js';
import admin from 'firebase-admin';

// Firebase Admin SDK initialization

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: // Storage bucket here
    });
}

const bucket = admin.storage().bucket();


const router = express.Router();

router.get('/', async (request, response) => {  
    try {
        const cars = await Car.find({});
        response.status(200).json({
            count: cars.length,
            data: cars
        });
    } catch (err) {
        console.error(err.message);
        response.status(500).send({ message: err.message });
    }
});

router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const car = await Car.findById(id);

        if (!car) {
            return response.status(404).send({ message: "Car not found" });
        }

        const imagePath = car.imagePath; // Using imagePath for Firebase Storage operations

        await Car.findByIdAndDelete(id);


        if (imagePath) {
          try {
              await bucket.file(imagePath).delete();
          } catch (err) {
              console.error("Failed to delete image from Firebase Storage:", err.message);
          }
      }

        response.status(200).send({ message: 'Car and image deleted successfully!' });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});


router.put('/:id', async (request, response) => {
    try {
        const hasInventoryCount = request.body.inventoryCount !== undefined;
        if (!request.body.make || !request.body.brand || !request.body.year || !hasInventoryCount) {
            return response.status(400).send({ message: "Send all required fields: make, brand, year, and inventoryCount." });
        }
        const { id } = request.params;

        // First, find the current car record to get the current image URL
        const currentCar = await Car.findById(id);
        if (!currentCar) {
            return response.status(404).send({ message: "Car not found" });
        }

        let newImagePath = '';
        if (request.body.imageUrl) {
            newImagePath = extractImagePath(request.body.imageUrl);
        }

        // If the image URL is updated, attempt to delete the old image
        if (request.body.imageUrl && currentCar.imageUrl !== request.body.imageUrl) {
            const oldImagePath = extractImagePath(currentCar.imageUrl);
            if (oldImagePath) {
                try {
                    await admin.storage().bucket().file(oldImagePath).delete();
                } catch (err) {
                    // Halt the update process if the old image could not be deleted
                    console.error("Failed to delete old image from Firebase Storage:", err.message);
                    return response.status(500).send({ message: "Failed to delete the old image from Firebase Storage. Contact your Firebase Administrator." });
                }
            }
        }

        // Proceed with updating the car record only if the old image was successfully deleted or if the image URL was not updated
        const updateData = {
            make: request.body.make,
            brand: request.body.brand,
            year: request.body.year,
            ...(request.body.imageUrl && { imageUrl: request.body.imageUrl, imagePath: newImagePath }),
            ...(request.body.inventoryCount !== undefined && { inventoryCount: request.body.inventoryCount }), // Explicitly handle inventoryCount
        };

        const result = await Car.findByIdAndUpdate(id, updateData, { new: true });

        if (!result) {
            return response.status(404).send({ message: "Car not found after attempting to update" });
        } else {
            response.status(200).send(result);
        }
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});



router.get('/:id', async (request, response) => { 
    try {
        const { id } = request.params;
        const car = await Car.findById(id);

        if (!car) {
            return response.status(404).send({ message: "Car not found" });
        }

        response.status(200).json(car);
    } catch (err) {
        console.error(err.message);
        response.status(500).send({ message: err.message });  
    }
});


router.post('/', async (request, response) => {
    try {
        const { make, brand, year, imageUrl, inventoryCount } = request.body;
        if (!make || !brand || !year || !imageUrl) {
            return response.status(400).send({ message: 'Make, Brand, Year, and Image URL are required' });
        }

        let imagePath = extractImagePath(imageUrl);

        const newCar = new Car({
            make,
            brand,
            year,
            imageUrl,
            imagePath,
            inventoryCount: inventoryCount || 0 // Use provided inventoryCount or default to 0
        });

        const car = await newCar.save();

        response.status(201).send(car);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});


// router.post('/', async (request, response) => {  
//     try {
//         const { make, brand, year, imageUrl } = request.body;
//         if (!make || !brand || !year || !imageUrl) {
//             return response.status(400).send({ message: 'Make, Brand, Year, and Image URL are required' });
//         }

//         let imagePath = extractImagePath(imageUrl);

//         const newCar = new Car({
//             make,
//             brand,
//             year,
//             imageUrl,
//             imagePath
//         });

//         const car = await Car.create(newCar);

//         response.status(201).send(car);
//     } catch (error) {
//         console.error(error.message);
//         response.status(500).send({ message: error.message });
//     }
// });

// Helper function to extract the image path from the imageUrl
function extractImagePath(imageUrl) {
    const matches = imageUrl.match(/car_images%2F(.+?)\?/);
    if (matches) {
        return `car_images/${matches[1].replace(/%2F/g, '/')}`;
    }
    return ''; // Return an empty string or a default value if no path can be extracted
}

export default router;