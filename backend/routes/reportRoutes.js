import express from "express";
import Reporte from "../models/Reporte.js";

const router = express.Router();

// GET: Fetch all reports
router.get("/", async (req, res) => {
  const { status, startDate, endDate } = req.query;

  let filter = {};

  if (status) {
    filter.status = status;
  }
  if (startDate || endDate) {
    filter.fecha = {};
    if (startDate) filter.fecha.$gte = new Date(startDate);
    if (endDate) filter.fecha.$lte = new Date(endDate);
  }

  try {
    const reportes = await Reporte.find(filter).sort({ fecha: -1 });
    res.status(200).json(reportes);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports." });
  }
});

import { Parser } from "json2csv";

router.get("/export", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const reportes = await Reporte.find(filter);

    // Define fields for the CSV
    const fields = ["nombre", "direccion", "descripcion", "fecha", "status"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(reportes);

    // Send the CSV file
    res.header("Content-Type", "text/csv");
    res.attachment("reportes.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting reports:", error);
    res.status(500).json({ message: "Error exporting reports." });
  }
});

// POST: Add a new report
router.post("/", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug the incoming data

    const { nombre, direccion, descripcion, latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude are required." });
    }

    const newReporte = new Reporte({
      nombre,
      direccion,
      descripcion,
      latitude,
      longitude,
    });

    await newReporte.save();
    res
      .status(201)
      .json({ message: "Reporte enviado con éxito.", data: newReporte });
  } catch (error) {
    console.error("Error al guardar el reporte:", error);
    res.status(500).json({ message: "Hubo un error al procesar el reporte." });
  }
});

// PATCH: Update the status of a report
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReporte = await Reporte.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedReporte);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Error updating report." });
  }
});

export default router;
