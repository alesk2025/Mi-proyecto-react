import React from 'react';

const AnimalStatusHistory = ({ animal, statusHistory }) => {
  if (!animal) {
    return <p>Selecciona un animal para ver su historial de estado.</p>;
  }

  const animalHistory = statusHistory.filter(record => record.animalId === animal.id);

  if (animalHistory.length === 0) {
    return <p>No hay historial de estado para {animal.name} ({animal.id}).</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h4 className="text-lg font-semibold mb-4">Historial de Estado de {animal.name} ({animal.id})</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Fecha</th>
              <th className="py-2 px-4 border">Estado Anterior</th>
              <th className="py-2 px-4 border">Nuevo Estado</th>
              <th className="py-2 px-4 border">Evento</th>
              <th className="py-2 px-4 border">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {animalHistory.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{record.date}</td>
                <td className="py-2 px-4 border">{record.oldStatus || 'N/A'}</td>
                <td className="py-2 px-4 border">{record.newStatus}</td>
                <td className="py-2 px-4 border">{record.eventType || 'N/A'}</td>
                <td className="py-2 px-4 border">{record.observations || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimalStatusHistory;

// DONE