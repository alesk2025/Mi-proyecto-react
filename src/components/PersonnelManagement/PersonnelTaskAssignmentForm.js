import React from 'react';

const PersonnelTaskAssignmentForm = ({ taskData, handleTaskChange, handleAssignTaskAction, employees }) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">Asignar Tarea</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="employeeId"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={taskData.employeeId}
          onChange={handleTaskChange}
        >
          <option value="">Selecciona Empleado</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <input
          type="text"
          name="taskType"
          placeholder="Tipo de Tarea"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={taskData.taskType}
          onChange={handleTaskChange}
        />
        <textarea
          name="description"
          placeholder="Descripción de la tarea"
          rows="2"
          className="w-full px-4 py-2 border rounded-lg col-span-full focus:outline-none focus:ring-2 focus:ring-black"
          value={taskData.description}
          onChange={handleTaskChange}
        ></textarea>
        <input
          type="text"
          name="toolsUsed"
          placeholder="Herramientas utilizadas"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={taskData.toolsUsed}
          onChange={handleTaskChange}
        />
        <input
          type="text"
          name="reason"
          placeholder="Motivo (Opcional)"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={taskData.reason}
          onChange={handleTaskChange}
        />
        <select
          name="status"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={taskData.status}
          onChange={handleTaskChange}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En Progreso</option>
          <option value="completada">Completada</option>
        </select>
      </div>
      <button
        onClick={handleAssignTaskAction}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md"
      >
        Asignar y Enviar Tarea
      </button>
    </div>
  );
};

export default PersonnelTaskAssignmentForm;