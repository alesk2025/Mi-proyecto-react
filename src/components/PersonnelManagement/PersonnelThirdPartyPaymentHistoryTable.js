import React from 'react';

const PersonnelThirdPartyPaymentHistoryTable = ({ thirdPartyPayments, onDeleteThirdPartyPayment, handlegeneratePdf, animals }) => {
  return (
    <>
      <h4 className="text-lg font-semibold mb-3 mt-8 text-gray-800">Historial de Pagos a Terceros</h4>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold rounded-tl-lg">ID Pago</th>
              <th className="py-3 px-4 text-left font-semibold">Persona/Empresa</th>
              <th className="py-3 px-4 text-left font-semibold">Descripción</th>
              <th className="py-3 px-4 text-left font-semibold">Monto</th>
              <th className="py-3 px-4 text-left font-semibold">Fecha</th>
              <th className="py-3 px-4 text-left font-semibold">Aplicado a</th>
              <th className="py-3 px-4 text-left font-semibold rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {thirdPartyPayments.map(tpp => (
              <tr key={tpp.id} className="hover:bg-gray-100 transition-colors">
                <td className="py-3 px-4">{tpp.id}</td>
                <td className="py-3 px-4">{tpp.personName}</td>
                <td className="py-3 px-4">{tpp.description}</td>
                <td className="py-3 px-4">${(parseFloat(tpp.amount) || 0).toFixed(2)}</td>
                <td className="py-3 px-4">{tpp.date}</td>
                <td className="py-3 px-4">
                  {tpp.appliesTo === 'general' ? 'General' : (animals.find(a => a.id === tpp.targetAnimalId)?.name || 'N/A')}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handlegeneratePdf('Pago a Tercero', tpp)}
                    className="text-blue-600 hover:text-blue-800 font-medium mr-2 transition-colors"
                  >
                    Ver PDF
                  </button>
                  <button
                    onClick={() => onDeleteThirdPartyPayment(tpp.id)}
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

export default PersonnelThirdPartyPaymentHistoryTable;