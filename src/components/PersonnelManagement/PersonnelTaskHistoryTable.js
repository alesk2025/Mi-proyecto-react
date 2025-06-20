import React from 'react';

const PersonnelTaskHistoryTable = ({ tasks, employees, onDeleteTask, handlegeneratePdf }) => {
  return (
    <>
      <h4 className="text-lg font-semibold mb-3 mt-8 text-gray-800">Historial de Tareas</h4>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold rounded-tl-lg">Empleado</th>
              <th className="py-3 px-4 text-left font-semibold">Tipo</th>
              <th className="py-3 px-4 text-left font-semibold">Descripción</th>
              <th className="py-3 px-4 text-left font-semibold">Estado</th>
              <th className="py-3 px-4 text-left font-semibold rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-100 transition-colors">
                <td className="py-3 px-4">{employees.find(emp => emp.id === task.employeeId)?.name || 'N/A'}</td>
                <td className="py-3 px-4">{task.taskType}</td>
                <td className="py-3 px-4">{task.description}</td>
                <td className="py-3 px-4">{task.status}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handlegeneratePdf('Asignación de Tarea', task)}
                    className="text-blue-600 hover:text-blue-800 font-medium mr-2 transition-colors"
                  >
                    Ver PDF
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PersonnelTaskHistoryTable;