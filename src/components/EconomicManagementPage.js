import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import EconomicReportSummary from './EconomicManagement/EconomicReportSummary';
import AnimalProfitabilitySection from './EconomicManagement/AnimalProfitabilitySection';
import TransactionForm from './EconomicManagement/TransactionForm';
import TransactionHistory from './EconomicManagement/TransactionHistory';
import SupplierClientManagement from './EconomicManagement/SupplierClientManagement'; // Nuevo componente

const EconomicManagementPage = ({ transactions, onAddTransaction, onDeleteTransaction, animals, employees, payslips, thirdPartyPayments, currentUser, logoUrl, suppliers, clients, debts, credits, addSupplier, addClient, addDebt, payDebt, addCredit, collectCredit }) => {
  const [transaction, setTransaction] = useState({
    type: 'ingreso',
    category: '',
    amount: '',
    description: '',
    animalId: '',
    product: '',
    quantity: '',
    unit: '',
    pricePerUnit: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
  });
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));
  const [sharedExpensesBreakdown, setSharedExpensesBreakdown] = useState({});
  const [isProfitabilityMinimized, setIsProfitabilityMinimized] = useState(false); // Nuevo estado para minimizar
  

  const sharedExpenseCategories = ['alimento', 'desparasitante', 'vitaminas', 'vacunas'];

  // --- Funciones de Utilidad de Fechas ---
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { year: d.getUTCFullYear(), week: weekNo };
  }

  const getStartAndEndOfWeek = (year, week) => {
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = normalizeDate(new Date(date.setDate(diff)));
    const endOfWeek = normalizeDate(new Date(startOfWeek));
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { start: startOfWeek, end: endOfWeek };
  };

  // --- Lógica de Filtrado de Reportes ---
  const filterItemsBySelectedPeriod = (items, dateProp) => {
    return items.filter(item => {
      const itemDate = normalizeDate(item[dateProp]);

      if (reportPeriod === 'daily') {
        const selectedDay = normalizeDate(selectedDate);
        return itemDate.getTime() === selectedDay.getTime();
      } else if (reportPeriod === 'weekly') {
        const { start, end } = getStartAndEndOfWeek(selectedWeek.year, selectedWeek.week);
        return itemDate >= start && itemDate <= end;
      } else if (reportPeriod === 'monthly') {
        const [year, month] = selectedMonth.split('-').map(Number);
        return itemDate.getFullYear() === year && itemDate.getMonth() === (month - 1);
      }
      return false;
    });
  };

  const currentPeriodTransactions = filterItemsBySelectedPeriod(transactions, 'date');
  const currentPeriodPayslips = filterItemsBySelectedPeriod(payslips, 'paymentDate');
  const currentPeriodThirdPartyPayments = filterItemsBySelectedPeriod(thirdPartyPayments, 'date');
  
  const totalIncomePeriod = currentPeriodTransactions
    .filter(t => t.type === 'ingreso' || t.type === 'venta')
    .reduce((sum, t) => sum + t.total, 0);
  
  const transactionExpensesPeriod = currentPeriodTransactions
    .filter(t => t.type === 'gasto' || t.type === 'compra')
    .reduce((sum, t) => sum + t.total, 0);
  
  const payslipExpensesPeriod = currentPeriodPayslips
    .reduce((sum, ps) => sum + (parseFloat(ps.netSalary) || 0), 0);

  const thirdPartyExpensesPeriod = currentPeriodThirdPartyPayments
    .reduce((sum, tpp) => sum + (parseFloat(tpp.amount) || 0), 0);
  
  const totalExpensesPeriod = transactionExpensesPeriod + payslipExpensesPeriod + thirdPartyExpensesPeriod;

  const netProfitPeriod = totalIncomePeriod - totalExpensesPeriod;

  // --- Lógica de Rentabilidad por Animal ---
  const safeEmployees = employees || [];
  const safeAnimals = animals || [];

  // Costo de mano de obra (salarios)
  // Se asegura que si no hay empleados, el totalSalaries sea 0
  const totalSalaries = payslipExpensesPeriod;
  // Se asegura que si no hay animales, el proratedLaborCostPerAnimal sea 0 para evitar división por cero
  const proratedLaborCostPerAnimal = safeAnimals.length > 0 ? totalSalaries / safeAnimals.length : 0;

  // Costos compartidos (alimento, desparasitante, vitaminas, vacunas)
  const totalSharedExpenses = transactions
    .filter(t => 
      (t.type === 'gasto' || t.type === 'compra') && 
      sharedExpenseCategories.includes(t.category.toLowerCase())
    )
    .reduce((sum, t) => sum + t.total, 0);

  const proratedSharedExpensePerAnimal = safeAnimals.length > 0 ? totalSharedExpenses / safeAnimals.length : 0;

  // Gastos de terceros (general y específico)
  // Se asegura que si no hay pagos a terceros, el generalThirdPartyExpenses sea 0
  const generalThirdPartyExpenses = thirdPartyPayments
    .filter(tpp => tpp.appliesTo === 'general')
    .reduce((sum, tpp) => sum + (parseFloat(tpp.amount) || 0), 0);
  
  const proratedGeneralThirdPartyExpensePerAnimal = safeAnimals.length > 0 ? generalThirdPartyExpenses / safeAnimals.length : 0;


  const animalProfitability = safeAnimals.map(animal => {
    const animalIncome = transactions
      .filter(t => t.animalId === animal.id && t.type === 'venta')
      .reduce((sum, t) => sum + t.total, 0);

    const animalExpenses = transactions
      .filter(t => t.animalId === animal.id && (t.type === 'gasto' || t.type === 'compra') && !sharedExpenseCategories.includes(t.category.toLowerCase()))
      .reduce((sum, t) => sum + t.total, 0);

    // Gastos de terceros específicos para este animal
    const specificThirdPartyExpensesForAnimal = thirdPartyPayments
      .filter(tpp => tpp.appliesTo === 'specific' && tpp.targetAnimalId === animal.id)
      .reduce((sum, tpp) => sum + (parseFloat(tpp.amount) || 0), 0);

    const totalCost = animalExpenses + proratedLaborCostPerAnimal + proratedSharedExpensePerAnimal + specificThirdPartyExpensesForAnimal + proratedGeneralThirdPartyExpensePerAnimal;
    const netProfitAnimal = animalIncome - totalCost;

    return {
      id: animal.id,
      name: animal.name,
      tipoProduccion: animal.tipoProduccion,
      status: animal.estadoReproductivo,
      income: animalIncome,
      expenses: animalExpenses,
      proratedLabor: proratedLaborCostPerAnimal, // Ahora incluye el salario prorrateado
      proratedSharedExpenses: proratedSharedExpensePerAnimal,
      specificThirdPartyExpenses: specificThirdPartyExpensesForAnimal, // Nuevo campo
      proratedGeneralThirdPartyExpenses: proratedGeneralThirdPartyExpensePerAnimal, // Nuevo campo
      totalCost: totalCost,
      netProfit: netProfitAnimal,
    };
  });

  // Efecto para calcular el desglose de gastos compartidos
  useEffect(() => {
    const breakdown = {};
    sharedExpenseCategories.forEach(cat => {
      breakdown[cat] = 0;
    });

    transactions.forEach(t => {
      if ((t.type === 'gasto' || t.type === 'compra') && sharedExpenseCategories.includes(t.category.toLowerCase())) {
        breakdown[t.category.toLowerCase()] += t.total;
      }
    });
    setSharedExpensesBreakdown(breakdown);
  }, [transactions]);

  // Información de la finca/criador para PDFs
  const farmName = currentUser?.farmName || 'Mi Finca Ganadera';
  const adminName = currentUser?.fullName || 'Administrador';
  const defaultLogo = 'https://via.placeholder.com/50x50?text=LOGO'; // Placeholder de logo

  const calculateTotalSale = () => { // Moved from TransactionForm
    const qty = parseFloat(transaction.quantity);
    const price = parseFloat(transaction.pricePerUnit);
    return (qty * price).toFixed(2);
  };

  const handleSubmit = () => { // Moved from TransactionForm
    if (!transaction.date) {
      alert('Por favor, selecciona la fecha de la transacción.');
      return;
    }
    if (transaction.type === 'ingreso' && (!transaction.startDate || !transaction.endDate)) {
      alert('Para ingresos, por favor, selecciona la fecha de inicio y fin del período.');
      return;
    }

    let finalTransaction = { ...transaction };
    if (transaction.type === 'venta') {
      finalTransaction.total = parseFloat(calculateTotalSale()); 
    } else {
      finalTransaction.total = parseFloat(finalTransaction.amount); // Asegurarse de usar finalTransaction.amount
    }
    
    const newId = `TRX-${Date.now().toString().slice(-5)}`;
    onAddTransaction({ ...finalTransaction, id: newId });
    alert(`Transacción de ${finalTransaction.type} registrada por $${finalTransaction.total}.`);
    // Limpiar formulario
    setTransaction({
      type: 'ingreso', category: '', amount: '', description: '',
      animalId: '', product: '', quantity: '', unit: '', pricePerUnit: '', client: '',
      date: new Date().toISOString().split('T')[0], // Resetear fecha a hoy
      startDate: '', endDate: '', // Resetear campos de fecha de período
    });
  };

  const handleGenerateInvoice = (saleData) => {
    if (!saleData || !saleData.client || !saleData.product || !saleData.quantity || !saleData.pricePerUnit) {
      alert('Por favor, completa todos los campos de la venta para generar la factura.');
      return;
    }
  
    const precioUnitario = parseFloat(saleData.pricePerUnit || 0);
    const cantidad = parseFloat(saleData.quantity || 0);
    const total = cantidad * precioUnitario;
  
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm'; // A4 width
    tempDiv.style.padding = '15mm'; // Padding para el contenido
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '10pt';
    tempDiv.style.backgroundColor = '#f8f8f8'; // Fondo ligeramente gris
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
  
    tempDiv.innerHTML = `
      <div style="border: 1px solid #ddd; border-radius: 12px; overflow: hidden; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #2c3e50; color: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <img src="${logoUrl || defaultLogo}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" alt="Logo Finca">
          <div style="text-align: right;">
            <h1 style="margin: 0; font-size: 24pt; font-weight: bold;">${farmName}</h1>
            <p style="margin: 0; font-size: 12pt; opacity: 0.8;">Factura de Venta</p>
          </div>
        </div>
  
        <div style="padding: 25px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <p style="margin: 0;"><strong>Factura ID:</strong> ${saleData.id || 'N/A'}</p>
              <p style="margin: 0;"><strong>Fecha:</strong> ${saleData.date || 'N/A'}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0;"><strong>Cliente:</strong> ${saleData.client || 'N/A'}</p>
              <p style="margin: 0;"><strong>Descripción:</strong> ${saleData.description || 'Venta de productos'}</p>
            </div>
          </div>
  
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px;">
            <thead style="background-color: #f0f0f0;">
              <tr>
                <th style="padding: 12px; border: 1px solid #eee; text-align: left;">Producto</th>
                <th style="padding: 12px; border: 1px solid #eee; text-align: left;">Cantidad</th>
                <th style="padding: 12px; border: 1px solid #eee; text-align: left;">Unidad</th>
                <th style="padding: 12px; border: 1px solid #eee; text-align: left;">Precio Unitario</th>
                <th style="padding: 12px; border: 1px solid #eee; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border: 1px solid #eee;">${saleData.product}</td>
                <td style="padding: 12px; border: 1px solid #eee;">${saleData.quantity}</td>
                <td style="padding: 12px; border: 1px solid #eee;">${saleData.unit}</td>
                <td style="padding: 12px; border: 1px solid #eee;">$${precioUnitario.toFixed(2)}</td>
                <td style="padding: 12px; border: 1px solid #eee;">$${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
  
          <div style="text-align: right; margin-top: 20px;">
            <p style="font-size: 14pt; font-weight: bold; color: #2c3e50; margin: 0;">Total a Pagar: <span style="color: #27ae60;">$${total.toFixed(2)}</span></p>
          </div>
        </div>
  
        <div style="text-align: center; padding: 20px; background-color: #f0f0f0; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
          <p style="font-size: 9pt; color: #555; margin: 0;">¡Gracias por tu compra!</p>
        </div>
  
        <div style="text-align: right; font-size: 8pt; padding: 10px 20px; color: #aaa; background-color: #f8f8f8; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
          <p style="margin: 0;">Generado por Campo Inteligente | Administrador: ${adminName}</p>
          <p style="margin: 0;">Fecha de Generación: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;
  
    document.body.appendChild(tempDiv);
  
    html2canvas(tempDiv, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight; // Corregido: restar pageHeight para la posición
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save(`factura_${saleData.client || 'sin_cliente'}_${saleData.id || 'sin_id'}.pdf`);
      document.body.removeChild(tempDiv);
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Gestión Económica</h3>

      <EconomicReportSummary
        reportPeriod={reportPeriod}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedWeek={selectedWeek}
        setSelectedDate={setSelectedDate}
        setSelectedMonth={setSelectedMonth}
        setReportPeriod={setReportPeriod}
        totalIncomePeriod={totalIncomePeriod}
        totalExpensesPeriod={totalExpensesPeriod}
        netProfitPeriod={netProfitPeriod}
      />

      {/* Sección de Rentabilidad Animal con opción de minimizar */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Rentabilidad por Animal</h2>
          <button
            onClick={() => setIsProfitabilityMinimized(!isProfitabilityMinimized)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            {isProfitabilityMinimized ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>
        {!isProfitabilityMinimized && (
          <AnimalProfitabilitySection
            animalProfitability={animalProfitability}
            totalSharedExpenses={totalSharedExpenses}
            sharedExpensesBreakdown={sharedExpensesBreakdown}
          />
        )}
      </div>

      <TransactionForm
        transaction={transaction}
        handleInputChange={(e) => setTransaction({ ...transaction, [e.target.name]: e.target.value })}
        handleSubmit={handleSubmit}
        handleGenerateInvoice={handleGenerateInvoice}
        animals={safeAnimals}
        calculateTotalSale={calculateTotalSale} // Pass calculateTotalSale to TransactionForm
        suppliers={suppliers}
        clients={clients}
        addSupplier={addSupplier}
        addClient={addClient}
        debts={debts}
        credits={credits}
        addDebt={addDebt}
        payDebt={payDebt}
        addCredit={addCredit}
        collectCredit={collectCredit}
      />

      <TransactionHistory
        transactions={transactions}
        onDeleteTransaction={onDeleteTransaction}
        handleGenerateInvoice={handleGenerateInvoice}
      />

      <SupplierClientManagement
        suppliers={suppliers}
        clients={clients}
        debts={debts}
        credits={credits}
        addSupplier={addSupplier}
        addClient={addClient}
        addDebt={addDebt}
        payDebt={payDebt}
        addCredit={addCredit}
        collectCredit={collectCredit}
      />
    </div>
  );
};

export default EconomicManagementPage;