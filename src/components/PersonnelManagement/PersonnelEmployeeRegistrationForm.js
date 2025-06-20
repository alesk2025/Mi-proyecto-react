import React from 'react';

const PersonnelEmployeeRegistrationForm = ({ employeeData, handleEmployeeChange, handleAddEmployee }) => {
  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">Registrar Nuevo Empleado</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre Completo"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={employeeData.name}
          onChange={handleEmployeeChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={employeeData.email}
          onChange={handleEmployeeChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Cargo"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={employeeData.position}
          onChange={handleEmployeeChange}
        />
        <input
          type="text"
          name="schedule"
          placeholder="Turno / Horario"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={employeeData.schedule}
          onChange={handleEmployeeChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salario Base"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={employeeData.salary}
          onChange={handleEmployeeChange}
        />
      </div>
      <button
        onClick={handleAddEmployee}
        className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
      >
        Registrar Empleado
      </button>
    </div>
  );
};

export default PersonnelEmployeeRegistrationForm;