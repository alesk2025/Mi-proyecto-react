import React from 'react';

const AnimalProfitabilitySection = ({ animalProfitability, totalSharedExpenses, sharedExpensesBreakdown }) => {
  return (
    <div className="mb-8 p-4 border rounded-lg bg-yellow-50">
      <h4 className="text-lg font-semibold mb-3">Rentabilidad por Animal</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID Animal</th>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Tipo Prod.</th>
              <th className="py-2 px-4 border">Ingresos</th>
              <th className="py-2 px-4 border">Gastos Directos</th>
              <th className="py-2 px-4 border">Mano Obra Prorrat. (Salario)</th>
              <th className="py-2 px-4 border">Gastos Compartidos Prorrat.</th> {/* Nuevo encabezado */}
              <th className="py-2 px-4 border">Costo Total</th>
              <th className="py-2 px-4 border">Ganancia Neta</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {animalProfitability.map(ap => (
              <tr key={ap.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{ap.id}</td>
                <td className="py-2 px-4 border">{ap.name}</td>
                <td className="py-2 px-4 border">{ap.tipoProduccion}</td>
                <td className="py-2 px-4 border">${ap.income.toFixed(2)}</td>
                <td className="py-2 px-4 border">${ap.expenses.toFixed(2)}</td>
                <td className="py-2 px-4 border">${ap.proratedLabor.toFixed(2)}</td>
                <td className="py-2 px-4 border">${ap.proratedSharedExpenses.toFixed(2)}</td>
                <td className="py-2 px-4 border">${ap.totalCost.toFixed(2)}</td>
                <td className={`py-2 px-4 border ${ap.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${ap.netProfit.toFixed(2)}
                </td>
                <td className="py-2 px-4 border">
                  {/* Acciones aquí si son necesarias */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 p-4 border rounded-lg bg-yellow-100">
        <h5 className="text-md font-semibold mb-2">Desglose de Gastos Compartidos (Total: ${totalSharedExpenses.toFixed(2)})</h5>
        <ul className="list-disc list-inside ml-4">
          {Object.entries(sharedExpensesBreakdown).map(([category, amount]) => (
            <li key={category} className="text-sm text-gray-700">
              {category.charAt(0).toUpperCase() + category.slice(1)}: ${amount.toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600 mt-2">Costo prorrateado por animal: ${animalProfitability.length > 0 ? (totalSharedExpenses / animalProfitability.length).toFixed(2) : (0).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default AnimalProfitabilitySection;