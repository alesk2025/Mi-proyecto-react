import React, { memo } from 'react';

const EconomicReportSummaryComponent = ({ reportPeriod, selectedDate, selectedMonth, selectedWeek, setSelectedDate, setSelectedMonth, setReportPeriod, totalIncomePeriod, totalExpensesPeriod, netProfitPeriod }) => {
  // Funciones de utilidad de fechas (duplicadas para mantener el componente autocontenido y bajo 200 líneas)
  
  return (
    <div className="mb-8 p-4 border rounded-card bg-green-50">
      <h4 className="text-lg font-semibold mb-3">Reportes Financieros Periódicos</h4>
      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => setReportPeriod('daily')}
          className={`${reportPeriod === 'daily' ? 'btn-primary' : 'btn-default'}`}
        >
          Diario
        </button>
        <button
          onClick={() => setReportPeriod('weekly')}
          className={`${reportPeriod === 'weekly' ? 'btn-primary' : 'btn-default'}`}
        >
          Semanal
        </button>
        <button
          onClick={() => setReportPeriod('monthly')}
          className={`${reportPeriod === 'monthly' ? 'btn-primary' : 'btn-default'}`}
        >
          Mensual
        </button>
      </div>

      {/* Controles de selección de fecha/período */}
      <div className="mb-4 flex justify-center">
        {reportPeriod === 'daily' && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-default"
          />
        )}
        {reportPeriod === 'weekly' && (
          <input
            type="week"
            value={`${selectedWeek.year}-W${String(selectedWeek.week).padStart(2, '0')}`}
            onChange={(e) => {
              const [year, week] = e.target.value.split('-W');
              setSelectedWeek({ year: Number(year), week: Number(week) });
            }}
            className="input-default"
          />
        )}
        {reportPeriod === 'monthly' && (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-default"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
        <div className="p-3 bg-green-100 rounded-card">
          <p className="text-sm font-medium">Ingresos del Periodo</p>
          <p className="text-2xl font-bold">${totalIncomePeriod.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-red-100 rounded-card">
          <p className="text-sm font-medium">Gastos del Periodo</p>
          <p className="text-2xl font-bold">${totalExpensesPeriod.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-card">
          <p className="text-sm font-medium">Ganancia Neta del Periodo</p>
          <p className="text-2xl font-bold">${netProfitPeriod.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(EconomicReportSummaryComponent);