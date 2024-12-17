import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  imagenUrl: { type: String, default: null },
  status: { type: String, default: "Pending" },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Reporte = mongoose.model("Reporte", reporteSchema);
export default Reporte;
