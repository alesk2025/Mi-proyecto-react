import React, { useState } from 'react';
import { employees } from '../mock/employees';

const EmployeePayrollPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [payrollData, setPayrollData] = useState({
    grossSalary: 0,
    bonuses: 0,
    deductions: 0,
    observations: '',
    netSalary: 0
  });

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setPayrollData({
        ...payrollData,
        grossSalary: employee.salary,
        netSalary: employee.salary
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === 'observations' ? value : parseFloat(value) || 0;
    
    setPayrollData(prev => {
      const newData = { ...prev, [name]: numericValue };
      if (name !== 'netSalary') {
        newData.netSalary = newData.grossSalary + newData.bonuses - newData.deductions;
      }
      return newData;
    });
  };

  const handleSubmit = () => {
    alert(`Ficha de pago generada para ${selectedEmployee}\nSalario Neto: $${payrollData.netSalary.toFixed(2)}`);
    // Aquí iría la lógica para guardar y enviar por email
  };

  const handleSendEmail = () => {
    alert(`Ficha de pago enviada por email a ${employees.find(e => e.id === selectedEmployee)?.email}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Gestión de Fichas de Pago</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Datos del Trabajador</h4>
          <select
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            value={selectedEmployee}
            onChange={handleEmployeeChange}
          >
            <option value="">Seleccione un trabajador</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.position}
              </option>
            ))}
          </select>

          {selectedEmployee && (
            <div className="space-y-2">
              <p><span className="font-semibold">Nombre:</span> {employees.find(e => e.id === selectedEmployee)?.name}</p>
              <p><span className="font-semibold">Cargo:</span> {employees.find(e => e.id === selectedEmployee)?.position}</p>
              <p><span className="font-semibold">Salario Base:</span> ${employees.find(e => e.id === selectedEmployee)?.salary.toFixed(2)}</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-2">Datos de Pago</h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salario Bruto</label>
                <input
                  type="number"
                  name="grossSalary"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={payrollData.grossSalary}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonificaciones</label>
                <input
                  type="number"
                  name="bonuses"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={payrollData.bonuses}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deducciones</label>
                <input
                  type="number"
                  name="deductions"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={payrollData.deductions}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salario Neto</label>
                <input
                  type="number"
                  name="netSalary"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                  value={payrollData.netSalary.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                name="observations"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={payrollData.observations}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleSubmit}
          className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Guardar Ficha
        </button>
        <button
          onClick={handleSendEmail}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enviar por Email
        </button>
        <button className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors">
          Generar PDF
        </button>
      </div>
    </div>
  );
};

export default EmployeePayrollPage;