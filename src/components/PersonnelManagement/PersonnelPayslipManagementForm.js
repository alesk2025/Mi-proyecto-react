import React from 'react';

const PersonnelPayslipManagementForm = ({ payrollData, handlePayrollChange, handleSendPayslipAction, employees, calculateNetSalary }) => {
  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">Gestionar Fichas de Pago</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="employeeId"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={payrollData.employeeId}
          onChange={handlePayrollChange}
        >
          <option value="">Selecciona Empleado</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <input
          type="number"
          name="grossAmount"
          placeholder="Monto Bruto"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={payrollData.grossAmount}
          onChange={handlePayrollChange}
        />
        <input
          type="number"
          name="bonuses"
          placeholder="Bonificaciones"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={payrollData.bonuses}
          onChange={handlePayrollChange}
        />
        <input
          type="number"
          name="deductions"
          placeholder="Deducciones"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={payrollData.deductions}
          onChange={handlePayrollChange}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Fecha Inicio Período"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={payrollData.startDate}
          onChange={handlePayrollChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="Fecha Fin Período"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={payrollData.endDate}
          onChange={handlePayrollChange}
        />
        <input
          type="date"
          name="paymentDate"
          placeholder="Fecha de Emisión del Pago"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={payrollData.paymentDate}
          onChange={handlePayrollChange}
        />
        <textarea
          name="observations"
          placeholder="Observaciones"
          rows="2"
          className="w-full px-4 py-2 border rounded-lg col-span-full focus:outline-none focus:ring-2 focus:ring-black"
          value={payrollData.observations}
          onChange={handlePayrollChange}
        ></textarea>
        <div className="col-span-full p-2 bg-gray-100 rounded-lg">
          <p className="font-semibold">Monto Neto a Recibir: ${calculateNetSalary()}</p>
        </div>
      </div>
      <button
        onClick={handleSendPayslipAction}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        Guardar y Enviar Ficha
      </button>
    </div>
  );
};

export default PersonnelPayslipManagementForm;