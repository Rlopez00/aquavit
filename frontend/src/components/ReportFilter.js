import React, { useState } from "react";

const ReportFilter = ({ onFilter }) => {
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter({ status, startDate, endDate });
  };

  return (
    <form
      onSubmit={handleFilter}
      className="flex flex-wrap gap-4 items-end bg-[#f0f7f9] p-4 rounded-md"
    >
      <div className="flex flex-col">
        <label
          htmlFor="status"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Estado
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00aadd]"
        >
          <option value="">Todos</option>
          <option value="Pending">Pendiente</option>
          <option value="Resolved">Resuelto</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="startDate"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Fecha Inicio
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00aadd]"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="endDate"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Fecha Fin
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#00aadd]"
        />
      </div>
      <div className="flex-none">
        <button
          type="submit"
          className="px-6 py-2 bg-[#006994] text-white rounded-md hover:bg-[#00587a] font-medium"
        >
          Filtrar
        </button>
      </div>
    </form>
  );
};

export default ReportFilter;
