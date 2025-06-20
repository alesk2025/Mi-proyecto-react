import React from 'react';

const PersonnelPayslipHistoryTable = ({ groupedPayslips, employees, onDeletePayslip, handlegeneratePdf, showPayslipHistory, setShowPayslipHistory }) => {
  return (
    <>
      <h4 className="text-lg font-semibold mb-3 mt-8 cursor-pointer flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm" onClick={() => setShowPayslipHistory(!showPayslipHistory)}>
        Historial de Fichas de Pago
        <svg className={`w-5 h-5 transform transition-transform ${showPayslipHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </h4>
      {showPayslipHistory && (
        <div className="overflow-x-auto">
          {Object.keys(groupedPayslips).length === 0 ? (
            <p className="text-gray-600 p-4">No hay fichas de pago registradas.</p>
          ) : (
            Object.keys(groupedPayslips).sort((a, b) => {
              const [monthA, yearA] = a.split(' ');
              const [monthB, yearB] = b.split(' ');
              const dateA = new Date(`${monthA} 1, ${yearA}`);
              const dateB = new Date(`${monthB} 1, ${yearB}`);
              return dateB - dateA;
            }).map(monthYear => (
              <div key={monthYear} className="mb-6">
                <h5 className="text-md font-semibold mb-2 bg-gray-200 p-2 rounded-lg text-gray-700">{monthYear}</h5>
                <table className="min-w-full bg-white text-sm rounded-lg shadow-md">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="py-2 px-4 text-left font-semibold">ID Ficha</th>
                      <th className="py-2 px-4 text-left font-semibold">Empleado</th>
                      <th className="py-2 px-4 text-left font-semibold">Monto Neto</th>
                      <th className="py-2 px-4 text-left font-semibold">Período</th>
                      <th className="py-2 px-4 text-left font-semibold">Fecha Pago</th>
                      <th className="py-2 px-4 text-left font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {groupedPayslips[monthYear].map(ps => (
                      <tr key={ps.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-4">{ps.id}</td>
                        <td className="py-2 px-4">{employees.find(emp => emp.id === ps.employeeId)?.name || 'N/A'}</td>
                        <td className="py-2 px-4">${(parseFloat(ps.netSalary) || 0).toFixed(2)}</td>
                        <td className="py-2 px-4">{ps.startDate} al {ps.endDate}</td>
                        <td className="py-2 px-4">{ps.paymentDate}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handlegeneratePdf('Ficha de Pago', ps)}
                            className="text-blue-600 hover:text-blue-800 font-medium mr-2 transition-colors"
                          >
                            Ver PDF
                          </button>
                          <button
                            onClick={() => onDeletePayslip(ps.id)}
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
            ))
          )}
        </div>
      )}
    </>
  );
};

export default PersonnelPayslipHistoryTable;