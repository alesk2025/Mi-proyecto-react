import React from 'react';

const ProfitabilityCharts = ({ animalProfitability }) => {
  // Preparar datos para el gráfico de barras de rentabilidad neta
  const profitabilityData = animalProfitability.map(animal => ({
    name: animal.name,
    netProfit: animal.netProfit,
  }));

  // Encontrar el valor máximo para escalar las barras
  const maxProfit = Math.max(...profitabilityData.map(d => Math.abs(d.netProfit)), 1); // Evitar división por cero

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
      <h4 className="text-lg font-semibold mb-4 text-gray-800">Gráficos de Rentabilidad por Animal</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Barras: Rentabilidad Neta por Animal */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h5 className="text-md font-medium mb-3 text-gray-700">Rentabilidad Neta por Animal</h5>
          <div className="space-y-2">
            {profitabilityData.map((data, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm text-gray-600 truncate">{data.name}</span>
                <div className="flex-grow h-6 bg-gray-200 rounded-full ml-2 relative overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out 
                      ${data.netProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${(Math.abs(data.netProfit) / maxProfit) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                    ${data.netProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Barras: Ingresos vs. Gastos por Animal */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h5 className="text-md font-medium mb-3 text-gray-700">Ingresos vs. Gastos por Animal</h5>
          <div className="space-y-4">
            {animalProfitability.map((animal, index) => (
              <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                <p className="text-sm font-semibold text-gray-800 mb-1">{animal.name}</p>
                <div className="flex items-center mb-1">
                  <span className="w-16 text-xs text-gray-600">Ingresos:</span>
                  <div className="flex-grow h-4 bg-green-200 rounded-full ml-2 relative">
                    <div 
                      className="h-full bg-green-400 rounded-full" 
                      style={{ width: `${(animal.income / (animal.income + animal.totalCost || 1)) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-800">
                      ${animal.income.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-xs text-gray-600">Gastos:</span>
                  <div className="flex-grow h-4 bg-red-200 rounded-full ml-2 relative">
                    <div 
                      className="h-full bg-red-400 rounded-full" 
                      style={{ width: `${(animal.totalCost / (animal.income + animal.totalCost || 1)) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-800">
                      ${animal.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityCharts;

// DONE