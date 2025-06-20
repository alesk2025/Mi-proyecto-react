import React, { useState } from 'react';
import { transactions } from '../mock/transactions';
import { animals } from '../mock/animals';

const EconomicReportsPage = () => {
  const [reportType, setReportType] = useState('ganancias_gastos');
  const [dateRange, setDateRange] = useState({
    start: '2023-01-01',
    end: '2023-12-31'
  });

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  const income = filteredTransactions
    .filter(t => t.type === 'venta')
    .reduce((sum, t) => sum + t.total, 0);

  const expenses = filteredTransactions
    .filter(t => t.type !== 'venta')
    .reduce((sum, t) => sum + t.total, 0);

  const milkProduction = animals
    .filter(a => a.productionType === 'leche' && a.status === 'en_produccion')
    .reduce((sum, a) => sum + (a.dailyMilk || 0), 0);

  const cowsInProduction = animals
    .filter(a => a.productionType === 'leche' && a.status === 'en_produccion')
    .length;

  const pregnantCows = animals
    .filter(a => a.status === 'preñada')
    .length;

  const dryCows = animals
    .filter(a => a.status === 'seca')
    .length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Reportes Económicos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="ganancias_gastos">Ganancias vs Gastos</option>
            <option value="rentabilidad">Rentabilidad por Animal</option>
            <option value="produccion">Producción Lechera</option>
            <option value="inventario">Inventario Animal</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {reportType === 'ganancias_gastos' && (
        <div>
          <h4 className="font