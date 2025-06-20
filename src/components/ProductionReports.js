import React from 'react';

const ProductionReports = ({ animals }) => {
  const cowsInProduction = animals.filter(a => 
    a.productionType === 'leche' && a.status === 'en_produccion'
  ).length;

  const pregnantCows = animals.filter(a => 
    a.status === 'preñada'
  ).length;

  const dryCows = animals.filter(a => 
    a.status === 'seca'
  ).length;

  const totalDailyMilk = animals
    .filter(a => a.productionType === 'leche' && a.status === 'en_produccion')
    .reduce((sum, cow) => sum + (cow.dailyMilk || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800">Vacas en Producción</h4>
        <p className="text-2xl font-bold text-green-600">{cowsInProduction}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800">Vacas Preñadas</h4>
        <p className="text-2xl font-bold text-blue-600">{pregnantCows}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800">Vacas Secas</h4>
        <p className="text-2xl font-bold text-yellow-600">{dryCows}</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-800">Producción Diaria</h4>
        <p className="text-2xl font-bold text-purple-600">
          {totalDailyMilk} Litros
        </p>
      </div>
    </div>
  );
};

export default ProductionReports;