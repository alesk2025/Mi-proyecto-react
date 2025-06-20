import React from 'react';

const TransactionHistory = ({ transactions, onDeleteTransaction, handleGenerateInvoice }) => {
  return (
    <>
      <h4 className="text-lg font-semibold mb-3">Historial de Transacciones</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Tipo</th>
              <th className="py-2 px-4 border">Categoría</th>
              <th className="py-2 px-4 border">Descripción</th>
              <th className="py-2 px-4 border">Monto</th>
              <th className="py-2 px-4 border">Animal ID</th>
              <th className="py-2 px-4 border">Fecha</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(trx => (
              <tr key={trx.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{trx.id}</td>
                <td className="py-2 px-4 border">{trx.type}</td>
                <td className="py-2 px-4 border">{trx.category}</td>
                <td className="py-2 px-4 border">{trx.description || trx.product}</td>
                <td className="py-2 px-4 border">${trx.total.toFixed(2)}</td>
                <td className="py-2 px-4 border">{trx.animalId || 'N/A'}</td>
                <td className="py-2 px-4 border">{trx.date || 'N/A'}</td>
                <td className="py-2 px-4 border">
                  {trx.type === 'venta' && (
                    <button
                      onClick={() => handleGenerateInvoice(trx)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Ver PDF
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTransaction(trx.id)}
                    className="text-red-600 hover:underline"
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

export default TransactionHistory;