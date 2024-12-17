import mongoose from "mongoose";
import Reporte from "./models/Reporte.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define the geographical bounds for Aguascalientes
const aguascalientesBounds = {
  north: 21.9268,
  south: 21.7816,
  west: -102.3581,
  east: -102.2433,
};

// Generate random latitude and longitude within bounds
const getRandomCoordinates = () => {
  const lat =
    Math.random() * (aguascalientesBounds.north - aguascalientesBounds.south) +
    aguascalientesBounds.south;
  const lng =
    Math.random() * (aguascalientesBounds.east - aguascalientesBounds.west) +
    aguascalientesBounds.west;
  return { lat, lng };
};

// Generate random dates
const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Generate fake data
const generateFakeData = (num) => {
  const fakeData = [];
  for (let i = 0; i < num; i++) {
    const { lat, lng } = getRandomCoordinates();
    fakeData.push({
      nombre: `Ciudadano ${i + 1}`,
      direccion: `Calle Falsa ${i + 1}, Colonia Inventada`,
      descripcion: `Reporte de fuga de agua número ${i + 1}`,
      fecha: getRandomDate(new Date(2023, 0, 1), new Date()), // Random date in 2023
      latitude: lat,
      longitude: lng,
      status: Math.random() > 0.5 ? "Resolved" : "Pending", // Random status
    });
  }
  return fakeData;
};

// Populate the database
const populateDatabase = async () => {
  const fakeReports = generateFakeData(50); // Generate 50 fake reports
  try {
    await Reporte.insertMany(fakeReports);
    console.log("Fake data inserted successfully");
  } catch (error) {
    console.error("Error inserting fake data:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
populateDatabase();
