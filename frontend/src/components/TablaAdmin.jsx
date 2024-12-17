import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ReportFilter from "./ReportFilter";

const ITEMS_PER_PAGE = 10; // Number of reports per page

const TablaAdmin = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReporte, setSelectedReporte] = useState(null); // For modal
  const [showModal, setShowModal] = useState(false);

  // Fetch reports from the backend with optional filters
  const fetchReportes = async (filters = {}) => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    try {
      const response = await fetch(`http://localhost:5000/reportes?${query}`);
      if (response.ok) {
        const data = await response.json();
        setReportes(data);
      } else {
        console.error("Error fetching reports:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a report as resolved
  const handleResolve = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/reportes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" }),
      });

      if (response.ok) {
        // Refresh reports after updating status
        fetchReportes();
        setShowModal(false);
      } else {
        console.error("Error resolving report:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Export reports to CSV
  const handleExport = async () => {
    try {
      const response = await fetch("http://localhost:5000/reportes/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reportes.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting reports:", error);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Cargando reportes...</p>
    );

  // Pagination logic
  const totalItems = reportes.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReportes = reportes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openModal = (reporte) => {
    setSelectedReporte(reporte);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReporte(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f7f9] p-6">
      <h1 className="text-3xl font-bold text-[#006994] mb-8 flex items-center space-x-2">
        <span role="img" aria-label="Water Drop">
          💧
        </span>
        <span>Panel de Administración</span>
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Table Section */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-semibold text-[#006994]">
              Lista de Reportes
            </h2>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-[#006994] text-white rounded-md hover:bg-[#00587a] font-medium"
            >
              Exportar CSV
            </button>
          </div>

          <ReportFilter onFilter={fetchReportes} />

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              <thead className="sticky top-0 bg-[#006994] text-white uppercase text-xs font-medium tracking-wider">
                <tr>
                  <th className="border border-gray-200 px-4 py-3 text-left">
                    Nombre
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left">
                    Dirección
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left">
                    Descripción
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left">
                    Fecha
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left">
                    Estado
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentReportes.map((reporte) => {
                  const shortDesc = reporte.descripcion
                    ? reporte.descripcion.slice(0, 50) +
                      (reporte.descripcion.length > 50 ? "..." : "")
                    : "";
                  return (
                    <tr key={reporte._id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {reporte.nombre}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {reporte.direccion}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700 truncate max-w-[150px]">
                        {shortDesc}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        {new Date(reporte.fecha).toLocaleString()}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            reporte.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {reporte.status === "Resolved"
                            ? "Resuelto"
                            : "Pendiente"}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-700">
                        <button
                          onClick={() => openModal(reporte)}
                          className="px-3 py-1 bg-[#00aadd] text-white rounded-md hover:bg-[#008bb3] text-sm font-medium"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="text-gray-700 text-sm px-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-[#006994] mb-4 flex items-center space-x-2">
            <span role="img" aria-label="Location Icon">
              📍
            </span>
            <span>Mapa de Reportes (Aguascalientes)</span>
          </h2>
          <p className="text-gray-700 mb-4">
            Visualice la ubicación de las fugas reportadas.
          </p>
          <div className="relative w-full h-96 border border-gray-200 rounded overflow-hidden">
            <MapContainer
              center={[21.8853, -102.2916]}
              zoom={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              {reportes.map((reporte) => {
                if (
                  typeof reporte.latitude === "number" &&
                  typeof reporte.longitude === "number"
                ) {
                  return (
                    <Marker
                      key={reporte._id}
                      position={[reporte.latitude, reporte.longitude]}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>Nombre:</strong> {reporte.nombre} <br />
                          <strong>Descripción:</strong> {reporte.descripcion}{" "}
                          <br />
                          <strong>Dirección:</strong> {reporte.direccion} <br />
                          <strong>Estado:</strong>{" "}
                          {reporte.status === "Resolved"
                            ? "Resuelto"
                            : "Pendiente"}
                        </div>
                      </Popup>
                    </Marker>
                  );
                } else {
                  console.warn(
                    `Invalid coordinates for reporte ${reporte._id}:`,
                    reporte.latitude,
                    reporte.longitude
                  );
                  return null;
                }
              })}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedReporte && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500"
              onClick={closeModal}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold text-[#006994] mb-4">
              Detalles del Reporte
            </h3>
            <p>
              <strong>Nombre:</strong> {selectedReporte.nombre}
            </p>
            <p>
              <strong>Descripción:</strong> {selectedReporte.descripcion}
            </p>
            <p>
              <strong>Dirección:</strong> {selectedReporte.direccion}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(selectedReporte.fecha).toLocaleString()}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {selectedReporte.status === "Resolved" ? "Resuelto" : "Pendiente"}
            </p>

            {selectedReporte.status !== "Resolved" && (
              <div className="mt-4">
                <button
                  onClick={() => handleResolve(selectedReporte._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Marcar como Resuelto
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaAdmin;
