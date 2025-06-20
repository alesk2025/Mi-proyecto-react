import React, { useState } from 'react';
import { employees } from '../mock/employees';
import { tasks } from '../mock/tasks';

const EmployeeTasksPage = () => {
  const [taskData, setTaskData] = useState({
    employeeId: '',
    type: '',
    description: '',
    tools: '',
    reason: '',
    status: 'pendiente',
    dueDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = () => {
    alert(`Tarea asignada a ${employees.find(e => e.id === taskData.employeeId)?.name}`);
    // Aquí iría la lógica para guardar la tarea
  };

  const handleSendEmail = () => {
    const employee = employees.find(e => e.id === taskData.employeeId);
    if (employee) {
      alert(`Tarea enviada por email a ${employee.email}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Asignación de Tareas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Datos del Trabajador</h4>
          <select
            name="employeeId"
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            value={taskData.employeeId}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un trabajador</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="font-medium mb-2">Detalles de la Tarea</h4>
          <div className="grid grid-cols-1 gap-3">
            <select
              name="type"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={taskData.type}
              onChange={handleInputChange}
            >
              <option value="">Tipo de Tarea</option>
              <option value="ordeño">Ordeño</option>
              <option value="alimentación">Alimentación</option>
              <option value="limpieza">Limpieza</option>
              <option value="sanitario">Control Sanitario</option>
              <option value="reproductivo">Control Reproductivo</option>
            </select>
            <textarea
              name="description"
              placeholder="Descripción detallada de la tarea"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={taskData.description}
              onChange={handleInputChange}
            ></textarea>
            <input
              type="text"
              name="tools"
              placeholder="Herramientas requeridas"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={taskData.tools}
              onChange={handleInputChange}
            />
            <textarea
              name="reason"
              placeholder="Motivo de la tarea (opcional)"
              rows="2"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={taskData.reason}
              onChange={handleInputChange}
            ></textarea>
            <div className="grid grid-cols-2 gap-3">
              <select
                name="status"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={taskData.status}
                onChange={handleInputChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
              <input
                type="date"
                name="dueDate"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={taskData.dueDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleSubmit}
          className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Guardar Tarea
        </button>
        <button
          onClick={handleSendEmail}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enviar por Email
        </button>
      </div>

      <div className="mt-8">
        <h4 className="font-medium mb-2">Tareas Asignadas</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Trabajador</th>
                <th className="py-2 px-4 border">Tipo</th>
                <th className="py-2 px-4 border">Descripción</th>
                <th className="py-2 px-4 border">Estado</th>
                <th className="py-2 px-4 border">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">
                    {employees.find(e => e.id === task.employeeId)?.name || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border">{task.type}</td>
                  <td className="py-2 px-4 border">{task.description}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'en_progreso' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {task.status === 'pendiente' ? 'Pendiente' :
                       task.status === 'en_progreso' ? 'En Progreso' : 'Completada'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTasksPage;