import React from 'react';

const FinancialReports = ({ transactions }) => {
  const income = transactions
    .filter(t => t.type === 'venta')
    .reduce((sum, t) => sum + t.total, 0);

  const expenses = transactions
    .filter(t => t.type !== 'venta')
    .reduce((sum, t) => sum + t.total, 0);

  const profit = income - expenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800">Ingresos Totales</h4>
        <p className="text-2xl font-bold text-green-600">${income.toFixed(2)}</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h4 className="font-semibold text-red-800">Gastos Totales</h4>
        <p className="text-2xl font-bold text-red-600">${expenses.toFixed(2)}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800">Rentabilidad</h4>
        <p className={`text-2xl font-bold ${
          profit >= 0 ? 'text-blue-600' : 'text-red-600'
        }`}>
          ${Math.abs(profit).toFixed(2)} {profit >= 0 ? 'Ganancia' : 'Pérdida'}
        </p>
      </div>
    </div>
  );
};

export default FinancialReports;