import express, { request } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Car } from "./models/carModel.js";
import carsRoute from "./routes/carsRoute.js";
import cors from "cors";

const app = express();

// Middleware for parsing request body in Postman
app.use(express.json());

// Middleware CORS for security policies
// Option 1 use for development
app.use(cors()); // equivalent to cors(*) and allows all requests to be made to the server

// Option 2 - use for production because allows it allows for more control and security
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"], 
//     allowedHeaders: ["Content-Type"],
//   })
// );

// Express .get() function
app.get('/', (request, response) => {   
    console.log(request);
    return response.status(240).send('Welcome to my MERN Stack Lesson!')
});

// route calls
app.use('/cars', carsRoute);


//MongoDB connect 
mongoose
 .connect(mongoDBURL)
 .then(() => {
    console.log("Connected to MongoDB Successfully!");
    app.listen(PORT, () => {
        console.log(`App lisenting on port: ${PORT}`);
    });    
  })
 .catch(err => {
    console.log(err);
  });
