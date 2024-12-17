import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapaAdmin = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const fetchReportes = async () => {
      const response = await fetch("http://localhost:5000/reportes");
      const data = await response.json();
      setReportes(data);
    };

    fetchReportes();
  }, []);

  return (
    <MapContainer
      center={[19.4326, -99.1332]}
      zoom={13}
      style={{ height: "500px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {reportes.map((reporte) => (
        <Marker
          key={reporte._id}
          position={[reporte.latitude, reporte.longitude]}
        >
          <Popup>
            <strong>{reporte.nombre}</strong>
            <br />
            {reporte.descripcion}
            <br />
            {new Date(reporte.fecha).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapaAdmin;
