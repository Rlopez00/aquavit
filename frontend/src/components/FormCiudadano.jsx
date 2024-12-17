import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

const RecenterMapOnUserLocation = ({ userLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation, map]);

  return null;
};

const FormCiudadano = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    descripcion: "",
    latitude: null,
    longitude: null,
  });
  const [message, setMessage] = useState("");
  const [userLocation, setUserLocation] = useState({
    lat: 19.4326,
    lng: -99.1332,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error detectando ubicación:", error);
        }
      );
    } else {
      console.error("Geolocalización no soportada.");
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      if (!response.ok) {
        console.error("Error obteniendo dirección.");
        return;
      }
      const data = await response.json();
      if (data && data.display_name) {
        setFormData((prev) => ({
          ...prev,
          direccion: data.display_name,
        }));
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        await reverseGeocode(lat, lng);
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]} />
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      setMessage("Por favor seleccione una ubicación en el mapa.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(
          "Reporte enviado con éxito. ¡Gracias por contribuir a la conservación del agua!"
        );
        setFormData({
          nombre: "",
          direccion: "",
          descripcion: "",
          latitude: null,
          longitude: null,
        });
      } else {
        setMessage("Hubo un problema al enviar el reporte.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7f9] py-10 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-[#006994] mb-4 flex items-center space-x-2">
          <span role="img" aria-label="Water Drop">
            💧
          </span>
          <span>Reportar Fuga de Agua</span>
        </h1>
        <p className="text-gray-700 mb-6">
          Ayúdenos a conservar el agua. Si ha detectado una fuga, por favor
          repórtela aquí. Su colaboración es invaluable.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              placeholder="Ingrese su nombre"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00aadd]"
            />
          </div>
          <div>
            <label
              htmlFor="direccion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
              placeholder="Seleccione la ubicación en el mapa o edite su dirección"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00aadd]"
            />
          </div>
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción del problema
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              placeholder="Describa brevemente el tipo de fuga u otra información relevante"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00aadd]"
            ></textarea>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Ubicación
            </span>
            <div className="relative w-full h-64 border border-gray-300 rounded overflow-hidden">
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <RecenterMapOnUserLocation userLocation={userLocation} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <LocationMarker />
              </MapContainer>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Haga clic en el mapa para seleccionar la ubicación exacta de la
              fuga.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-[#006994] text-white py-2 px-4 rounded hover:bg-[#00587a] font-semibold"
          >
            Enviar Reporte
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormCiudadano;
