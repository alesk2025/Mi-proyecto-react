import React, { useState, useEffect } from 'react';
import AuthLayout from './components/AuthLayout';
import AuthRegisterForm from './components/AuthRegisterForm';
import AuthLoginForm from './components/AuthLoginForm';
import DashboardLayout from './components/DashboardLayout';
import AnimalRegistrationPage from './components/AnimalRegistrationPage';
import SanitaryControlPage from './components/SanitaryControlPage';
import ReproductiveControlPage from './components/ReproductiveControlPage';
import InventoryPage from './components/InventoryPage';
import EconomicManagementPage from './components/EconomicManagementPage';
import PersonnelManagementPage from './components/PersonnelManagementPage';
import SubscriptionPlansPage from './components/SubscriptionPlansPage';
import ProductionControlPage from './components/ProductionControlPage';
import SupplierClientManagement from './components/EconomicManagement/SupplierClientManagement'; // Importar el componente

import { classifyAnimalAge } from './utils/helpers';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorageHelpers';

import { animals as initialAnimalsData } from './mock/animals';
import { inventoryItems as initialInventoryItemsData } from './mock/inventory';
import { employees as initialEmployeesData, mockPayslips as initialPayslipsData } from './mock/employees';
import { tasks as initialTasksData } from './mock/tasks';
import { transactions as initialTransactionsData } from './mock/transactions';
import { reproductiveRecords as initialReproductiveRecordsData } from './mock/reproductive';
import { productionRecords as initialProductionRecordsData } from './mock/production';
import { defaultSuppliersData } from './mock/suppliers';
import { defaultClientsData } from './mock/clients';

const SUBSCRIPTION_PLANS = {
  "Gratuito": {
    maxAnimals: 10,				
    maxEmployees: 1,				
    maxInventoryItems: 15,
    price: 0,
    benefits: ["Registro básico", "Reportes limitados"]
  },
  "Basico": {
    maxAnimals: 18,
    maxEmployees: 2,
    maxInventoryItems: 25,
    price: 2.99,
    benefits: ["Todo lo gratuito", "Más animales y empleados", "Reportes detallados"]
  },
  "Standard": {
    maxAnimals: 28,
    maxEmployees: 5,
    maxInventoryItems: Infinity,
    price: 6.99,
    benefits: ["Todo lo básico", "Más capacidad", "Productos ilimitados"]
  },
  "Premium": {
    maxAnimals: Infinity,
    maxEmployees: Infinity,
    maxInventoryItems: Infinity,
    price: 24.99,
    benefits: ["Todo ilimitado", "Asesoría empresarial (simulado)", "Seguimiento y consultas veterinarias gratis (simulado)"]
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [logoUrl, setLogoUrl] = useState(() => loadFromLocalStorage('farmLogoUrl', ''));

  const [animals, setAnimals] = useState(() => loadFromLocalStorage('animals', initialAnimalsData));
  const [inventory, setInventory] = useState(() => loadFromLocalStorage('inventory', initialInventoryItemsData));
  const [reproductiveRecords, setReproductiveRecords] = useState(() => loadFromLocalStorage('reproductiveRecords', initialReproductiveRecordsData));
  const [productionRecords, setProductionRecords] = useState(() => loadFromLocalStorage('productionRecords', initialProductionRecordsData));
  const [employees, setEmployees] = useState(() => loadFromLocalStorage('employees', initialEmployeesData));
  const [tasks, setTasks] = useState(() => loadFromLocalStorage('tasks', initialTasksData));
  const [transactions, setTransactions] = useState(() => loadFromLocalStorage('transactions', initialTransactionsData));
  const [payslips, setPayslips] = useState(() => loadFromLocalStorage('payslips', initialPayslipsData));
  const [thirdPartyPayments, setThirdPartyPayments] = useState(() => loadFromLocalStorage('thirdPartyPayments', []));
  const [registeredUsers, setRegisteredUsers] = useState(() => loadFromLocalStorage('registeredUsers', []));
  const [suppliers, setSuppliers] = useState(() => loadFromLocalStorage('suppliers', defaultSuppliersData));
  const [clients, setClients] = useState(() => loadFromLocalStorage('clients', defaultClientsData));
  const [debts, setDebts] = useState(() => loadFromLocalStorage('debts', []));
  const [credits, setCredits] = useState(() => loadFromLocalStorage('credits', []));

  // Estados para Control Reproductivo
  const [calvingSchedule, setCalvingSchedule] = useState(() => loadFromLocalStorage('calvingSchedule', []));
  const [naturalMatingHistory, setNaturalMatingHistory] = useState(() => loadFromLocalStorage('naturalMatingHistory', []));

  // Estados para Control Sanitario
  const [treatmentsHistory, setTreatmentsHistory] = useState(() => loadFromLocalStorage('treatmentsHistory', []));
  const [diseasesHistory, setDiseasesHistory] = useState(() => loadFromLocalStorage('diseasesHistory', []));
  const [vaccinationSchedule, setVaccinationSchedule] = useState(() => loadFromLocalStorage('vaccinationSchedule', []));
  const [dewormingSchedule, setDewormingSchedule] = useState(() => loadFromLocalStorage('dewormingSchedule', []));
  const [vitaminSchedule, setVitaminSchedule] = useState(() => loadFromLocalStorage('vitaminSchedule', []));


  // Sincronización con localStorage
  useEffect(() => { saveToLocalStorage('registeredUsers', registeredUsers); }, [registeredUsers]);
  useEffect(() => { saveToLocalStorage('animals', animals); }, [animals]);
  useEffect(() => { saveToLocalStorage('inventory', inventory); }, [inventory]);
  useEffect(() => { saveToLocalStorage('employees', employees); }, [employees]);
  useEffect(() => { saveToLocalStorage('tasks', tasks); }, [tasks]);
  useEffect(() => { saveToLocalStorage('transactions', transactions); }, [transactions]);
  useEffect(() => { saveToLocalStorage('payslips', payslips); }, [payslips]);
  useEffect(() => { saveToLocalStorage('thirdPartyPayments', thirdPartyPayments); }, [thirdPartyPayments]);
  useEffect(() => { saveToLocalStorage('reproductiveRecords', reproductiveRecords); }, [reproductiveRecords]);
  useEffect(() => { saveToLocalStorage('productionRecords', productionRecords); }, [productionRecords]);
  useEffect(() => { saveToLocalStorage('farmLogoUrl', logoUrl); }, [logoUrl]);
  useEffect(() => { saveToLocalStorage('suppliers', suppliers); }, [suppliers]);
  useEffect(() => { saveToLocalStorage('clients', clients); }, [clients]);
  useEffect(() => { saveToLocalStorage('debts', debts); }, [debts]);
  useEffect(() => { saveToLocalStorage('credits', credits); }, [credits]);
  // Sincronizar estados de Control Reproductivo
  useEffect(() => { saveToLocalStorage('calvingSchedule', calvingSchedule); }, [calvingSchedule]);
  useEffect(() => { saveToLocalStorage('naturalMatingHistory', naturalMatingHistory); }, [naturalMatingHistory]);
  // Sincronizar estados de Control Sanitario
  useEffect(() => { saveToLocalStorage('treatmentsHistory', treatmentsHistory); }, [treatmentsHistory]);
  useEffect(() => { saveToLocalStorage('diseasesHistory', diseasesHistory); }, [diseasesHistory]);
  useEffect(() => { saveToLocalStorage('vaccinationSchedule', vaccinationSchedule); }, [vaccinationSchedule]);
  useEffect(() => { saveToLocalStorage('dewormingSchedule', dewormingSchedule); }, [dewormingSchedule]);
  useEffect(() => { saveToLocalStorage('vitaminSchedule', vitaminSchedule); }, [vitaminSchedule]);


  const checkLimit = (type) => {
    if (!currentUser) return false;
    const plan = SUBSCRIPTION_PLANS[currentUser.subscriptionPlan];
    if (!plan) return false;

    switch (type) {
      case 'animal':
        return animals.length < plan.maxAnimals;
      case 'employee':
        return employees.length < plan.maxEmployees;
      case 'inventoryItem':
        return inventory.length < plan.maxInventoryItems;
      default:
        return false;
    }
  };

  const getRemaining = (type) => {
    if (!currentUser) return 0;
    const plan = SUBSCRIPTION_PLANS[currentUser.subscriptionPlan];
    if (!plan) return 0;

    switch (type) {
      case 'animal':
        return plan.maxAnimals === Infinity ? 'Ilimitado' : plan.maxAnimals - animals.length;
      case 'employee':
        return plan.maxEmployees === Infinity ? 'Ilimitado' : plan.maxEmployees - employees.length;
      case 'inventoryItem':
        return plan.maxInventoryItems === Infinity ? 'Ilimitado' : plan.maxInventoryItems - inventory.length;
      default:
        return 0;
    }
  };

  const handleRegisterAnimal = (newAnimal) => {
    if (!checkLimit('animal')) {
      alert(`Límite de animales alcanzado para tu plan ${currentUser.subscriptionPlan}. Actualiza tu suscripción.`);
      return;
    }
    setAnimals([...animals, newAnimal]);
  };

  const handleUpdateAnimalProduction = (animalId, updateData) => {
   const updatedAnimals = animals.map(animal =>
      animal.id === animalId ? { ...animal, ...updateData } : animal
    );
    setAnimals(updatedAnimals);
 };
 
  const handleReproductiveRecordStatus = (id, nuevoEstado) => {
  const updatedRecords = reproductiveRecords.map(r =>
    r.id === id ? { ...r, estado: nuevoEstado } : r
  );
  setReproductiveRecords(updatedRecords);
};


  const handleDeletePregnantCow = (id) => {
  setAnimals(prev =>
    prev.map(animal =>
      animal.id === id
        ? { ...animal, estadoReproductivo: '', fechaUltimaGestacion: '' }
        : animal
       )
     );
   };

    const handleEditAnimal = (updatedAnimal) => {
    setAnimals(animals.map(animal =>
      animal.id === updatedAnimal.id ? updatedAnimal : animal
    ));
  };

  const handleDeleteAnimal = (id) => {
    setAnimals(animals.filter(animal => animal.id !== id));
  };

  const handleAddItemToInventory = (newItem) => {
    if (!checkLimit('inventoryItem')) {
      alert(`Límite de productos en inventario alcanzado para tu plan ${currentUser.subscriptionPlan}. Actualiza tu suscripción.`);
      return;
    }
    setInventory([...inventory, newItem]);
  };

  const handleUpdateInventoryQuantity = (itemId, amountUsed) => {
    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity - amountUsed;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 0 };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleDeleteInventoryItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleExportInventory = (type) => {
    alert(`Exportando inventario a ${type} (simulado).`);
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(trx => trx.id !== id));
  };

  const handleAddEmployee = (newEmployee) => {
    if (!checkLimit('employee')) {
      alert(`Límite de empleados alcanzado para tu plan ${currentUser.subscriptionPlan}. Actualiza tu suscripción.`);
      return;
    }
    setEmployees([...employees, newEmployee]);
  };

  const handleSendPayslip = (employeeId, payslipData) => {
    const newPayslipId = `PS-${Date.now().toString().slice(-5)}`;
    const netSalaryNum = parseFloat(payslipData.netSalary) || 0;
    setPayslips([...payslips, { ...payslipData, id: newPayslipId, employeeId, netSalary: netSalaryNum }]);
    alert(`Ficha de pago para ${employeeId} enviada por correo (simulado).`);
  };

  const handleDeletePayslip = (id) => {
    setPayslips(payslips.filter(ps => ps.id !== id));
  };

  const handleAssignTask = (employeeId, taskData) => {
    const newTaskId = `TASK-${Date.now().toString().slice(-5)}`;
    setTasks([...tasks, { ...taskData, id: newTaskId, employeeId }]);
    alert(`Tarea asignada a ${taskData.employeeId}.`);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleAddThirdPartyPayment = (paymentData) => {
    const newPaymentId = `TPP-${Date.now().toString().slice(-5)}`;
    const amountNum = parseFloat(paymentData.amount) || 0;
    setThirdPartyPayments([...thirdPartyPayments, { ...paymentData, id: newPaymentId, amount: amountNum }]);
    alert(`Pago a tercero ${paymentData.personName} registrado.`);
  };

  const handleDeleteThirdPartyPayment = (id) => {
    setThirdPartyPayments(thirdPartyPayments.filter(payment => payment.id !== id));
  };

  const handleRegisterProductionRecord = (newRecord) => {
    setProductionRecords(prev => [...prev, newRecord]);
  };

  // Funciones para proveedores y clientes
  const handleAddSupplier = (supplier) => {
    setSuppliers([...suppliers, supplier]);
  };

  const handleAddClient = (client) => {
    setClients([...clients, client]);
  };

  const handleAddDebt = (debt) => {
    setDebts([...debts, debt]);
  };

  const handlePayDebt = (id) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, paid: true, paymentDate: new Date().toISOString().split('T')[0] } : debt));
  };

  const handleAddCredit = (credit) => {
    setCredits([...credits, credit]);
  };

  const handleCollectCredit = (id) => {
    setCredits(credits.map(credit => credit.id === id ? { ...credit, collected: true, collectionDate: new Date().toISOString().split('T')[0] } : credit));
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleRegisterUser = (userData) => {
    if (registeredUsers.some(u => u.email === userData.email)) {
      alert('Este correo ya está registrado. Por favor, inicia sesión o usa otro correo.');
      return false;
    }
    const newUser = { ...userData, id: `USR-${Date.now().toString().slice(-5)}`, subscriptionPlan: "Gratuito" };
    setRegisteredUsers([...registeredUsers, newUser]);
    return true;
  };

  const handleNavigate = (page) => {
    if (page === 'logout') {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const handleUpdateSubscription = (planName) => {
    if (currentUser) {
      const updatedUsers = registeredUsers.map(u =>
        u.id === currentUser.id ? { ...u, subscriptionPlan: planName } : u
      );
      setRegisteredUsers(updatedUsers);
      setCurrentUser({ ...currentUser, subscriptionPlan: planName });
      alert(`Tu plan ha sido actualizado a ${planName}. (Simulado)`);
      setCurrentPage('dashboard');
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
        alert('Logo subido con éxito y guardado para futuros PDFs.');
      };
      reader.readAsDataURL(file);
    }
  };

  const totalAnimals = animals.length;
  const totalCows = animals.filter(animal => animal.sexo === 'hembra').length;
  const totalBulls = animals.filter(animal => animal.sexo === 'macho').length;
  
  // Vacas preñadas (estado reproductivo 'preñada')
  const pregnantCows = animals.filter(animal => animal.sexo === 'hembra' && animal.estadoReproductivo === 'preñada');
  
  // Vacas en producción (estado reproductivo 'produccion')
  const productionCows = animals.filter(animal => animal.sexo === 'hembra' && animal.estadoReproductivo === 'produccion').length;
  
  // Vacas secas (estado reproductivo 'seca')
  const dryCows = animals.filter(animal => animal.sexo === 'hembra' && animal.estadoReproductivo === 'seca').length;
  
  // Vacas vacías (estado reproductivo 'vacia')
  const emptyCows = animals.filter(animal => animal.sexo === 'hembra' && animal.estadoReproductivo === 'vacia').length;

  // Vacas preñadas y secas (menos de 100 días para parir)
  const pregnantAndDryCows = pregnantCows.filter(cow => {
    const calvingRecord = calvingSchedule.find(record => record.animalId === cow.id);
    if (calvingRecord && calvingRecord.expectedCalvingDate) {
      const today = new Date();
      const expectedDate = new Date(calvingRecord.expectedCalvingDate);
      const diffTime = Math.abs(expectedDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 100;
    }
    return false;
  }).length;

  const totalCalves = animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Terner')).length;
  const totalMautes = animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Maut')).length;
  const totalNovillas = animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Novilla')).length;
  const totalToros = animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo) === 'Toro').length;

  // Datos para los gráficos de producción
  const milkProductionData = productionRecords
    .filter(record => record.tipoProduccion === 'leche')
    .sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro))
    .map(record => ({ date: record.fechaRegistro, value: record.cantidad }));

  const meatProductionData = productionRecords
    .filter(record => record.tipoProduccion === 'carne')
    .sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro))
    .map(record => ({ date: record.fechaRegistro, value: record.cantidad }));

  // Función para dibujar un gráfico simple (simulado con div)
  const renderSimpleChart = (data, color) => {
    if (data.length < 2) {
      return <p className="text-sm text-gray-500">No hay suficientes datos para mostrar el gráfico.</p>;
    }
    const maxVal = Math.max(...data.map(d => d.value));
    const minVal = Math.min(...data.map(d => d.value));
    const range = maxVal - minVal;

    return (
      <div className="flex items-end h-24 border-b border-l border-gray-300 p-1">
        {data.map((d, index) => (
          <div
            key={index}
            className="w-4 mx-0.5"
            style={{
              height: `${range > 0 ? ((d.value - minVal) / range) * 80 + 20 : 50}%`,
              backgroundColor: color,
              transition: 'height 0.3s ease-in-out',
            }}
            title={`${d.date}: ${d.value}`}
          ></div>
        ))}
      </div>
    );
  };


  const renderPage = () => {
    if (!isLoggedIn) {
      return (
        <AuthLayout>
          {currentPage === 'login' ? (
            <AuthLoginForm onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} registeredUsers={registeredUsers} />
          ) : (
            <AuthRegisterForm onRegisterSuccess={handleRegisterUser} onNavigateToLogin={() => setCurrentPage('login')} />
          )}
        </AuthLayout>
      );
    } else {
      let content;
      switch (currentPage) {
        case 'animalRegistration':
          content = (
            <AnimalRegistrationPage
              onRegisterAnimal={handleRegisterAnimal}
              onUpdateAnimalProduction={handleUpdateAnimalProduction}
              animals={animals}
              currentUser={currentUser}
              logoUrl={logoUrl}
            />
          );
          break;
        case 'sanitaryControl':
          content = (
            <SanitaryControlPage
              inventoryItems={inventory}
              onUpdateInventoryQuantity={handleUpdateInventoryQuantity}
              animals={animals}
              treatmentsHistory={treatmentsHistory}
              setTreatmentsHistory={setTreatmentsHistory}
              diseasesHistory={diseasesHistory}
              setDiseasesHistory={setDiseasesHistory}
              vaccinationSchedule={vaccinationSchedule}
              setVaccinationSchedule={setVaccinationSchedule}
              dewormingSchedule={dewormingSchedule}
              setDewormingSchedule={setDewormingSchedule}
              vitaminSchedule={vitaminSchedule}
              setVitaminSchedule={setVitaminSchedule}
            />
          );
          break;
       case 'reproductiveControl':
         content = (
           <ReproductiveControlPage
             animals={animals}
             onUpdateAnimalProduction={handleUpdateAnimalProduction}
             onRegisterAnimal={handleRegisterAnimal}
             onRegisterReproductiveEvent={(event) => {
                setReproductiveRecords(prev => [...prev, event]);
             }}
             onDeletePregnantCow={handleDeletePregnantCow}
             reproductiveRecords={reproductiveRecords}
             setReproductiveRecords={setReproductiveRecords}
             currentUser={currentUser}
             logoUrl={logoUrl}
             // Pasando los estados y sus setters al componente ReproductiveControlPage
             calvingSchedule={calvingSchedule}
             setCalvingSchedule={setCalvingSchedule}
             naturalMatingHistory={naturalMatingHistory}
             setNaturalMatingHistory={setNaturalMatingHistory}
           />
         );
         break;
        case 'productionControl':
          content = (
            <ProductionControlPage
              animals={animals}
              onUpdateAnimalProduction={handleUpdateAnimalProduction}
              onRegisterProductionRecord={handleRegisterProductionRecord}
              productionRecords={productionRecords}
              setProductionRecords={setProductionRecords}
              currentUser={currentUser}
              logoUrl={logoUrl}
            />
          );
          break;
        case 'inventory':
          content = (
            <InventoryPage
              inventoryItems={inventory}
              onAddItem={handleAddItemToInventory}
              onUpdateItemQuantity={handleUpdateInventoryQuantity}
              onExport={handleExportInventory}
              animals={animals}
              onDeleteAnimal={handleDeleteAnimal}
              onEditAnimal={handleEditAnimal}
              classifyAnimalAge={classifyAnimalAge}
              onDeleteInventoryItem={handleDeleteInventoryItem}
            />
          );
          break;
        case 'economicManagement':
          content = (
            <EconomicManagementPage
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              animals={animals}
              employees={employees}
              payslips={payslips}
              thirdPartyPayments={thirdPartyPayments}
              currentUser={currentUser}
              logoUrl={logoUrl}
              suppliers={suppliers}
              clients={clients}
              debts={debts}
              credits={credits}
              addSupplier={handleAddSupplier}
              addClient={handleAddClient}
              addDebt={handleAddDebt}
              payDebt={handlePayDebt}
              addCredit={handleAddCredit}
              collectCredit={handleCollectCredit}
            />
          );
          break;
        case 'personnelManagement':
          content = (
            <PersonnelManagementPage
              employees={employees}
              tasks={tasks}
              onAddEmployee={handleAddEmployee}
              onSendPayslip={handleSendPayslip}
              onDeletePayslip={handleDeletePayslip}
              onAssignTask={handleAssignTask}
              onDeleteTask={handleDeleteTask}
              thirdPartyPayments={thirdPartyPayments}
              onAddThirdPartyPayment={handleAddThirdPartyPayment}
              onDeleteThirdPartyPayment={handleDeleteThirdPartyPayment}
              payslips={payslips}
              currentUser={currentUser}
              animals={animals}
              logoUrl={logoUrl}
            />
          );
          break;
        case 'supplierClientManagement': // Nueva ruta
          content = (
            <SupplierClientManagement
              suppliers={suppliers}
              clients={clients}
              debts={debts}
              credits={credits}
              addSupplier={handleAddSupplier}
              addClient={handleAddClient}
              addDebt={handleAddDebt}
              payDebt={handlePayDebt}
              addCredit={handleAddCredit}
              collectCredit={handleCollectCredit}
            />
          );
          break;
        case 'subscriptionPlans':
          content = (
            <SubscriptionPlansPage
              currentPlan={currentUser ? currentUser.subscriptionPlan : 'Gratuito'}
              onUpdateSubscription={handleUpdateSubscription}
              plans={SUBSCRIPTION_PLANS}
            />
          );
          break;
        case 'dashboard':
        default:
          content = (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Bienvenido al Dashboard, {currentUser ? currentUser.fullName : 'Usuario'}!</h3>
              <p className="text-gray-700">Tu plan actual es: <span className="font-bold">{currentUser ? currentUser.subscriptionPlan : 'N/A'}</span></p>
              <p className="text-700">Selecciona una opción del menú lateral para empezar a gestionar tu finca.</p>
              
              <div className="mt-6 mb-8 p-4 border rounded-lg bg-blue-50">
                <h4 className="text-lg font-semibold mb-3">Personalizar Logo de Finca</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {logoUrl && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-700 mb-2">Logo actual:</p>
                    <img src={logoUrl} alt="Logo de la Finca" className="max-h-24 mx-auto rounded-lg shadow-md" />
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Tarjeta de Total Animales */}
                <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Total Animales</h4>
                  <p className="text-4xl font-bold mt-2">{totalAnimals}</p>
                  <p className="text-sm opacity-80 mt-1">({getRemaining('animal')} restantes)</p>
                </div>
                {/* Tarjeta de Productos */}
                <div className="p-6 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Productos</h4>
                  <p className="text-4xl font-bold mt-2">{inventory.length}</p>
                  <p className="text-sm opacity-80 mt-1">({getRemaining('inventoryItem')} restantes)</p>
                </div>
                {/* Tarjeta de Empleados */}
                <div className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Empleados</h4>
                  <p className="text-4xl font-bold mt-2">{employees.length}</p>
                  <p className="text-sm opacity-80 mt-1">({getRemaining('employee')} restantes)</p>
                </div>
                {/* Tarjeta de Vacas en Producción */}
                <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Vacas en Producción</h4>
                  <p className="text-4xl font-bold mt-2">{productionCows}</p>
                  <p className="text-sm opacity-80 mt-1">Vacas lecheras activas</p>
                </div>
                {/* Tarjeta de Vacas Preñadas */}
                <div className="p-6 bg-gradient-to-br from-pink-500 to-pink-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Vacas Preñadas</h4>
                  <p className="text-4xl font-bold mt-2">{pregnantCows.length}</p>
                  <p className="text-sm opacity-80 mt-1">Próximos partos</p>
                </div>
                {/* Tarjeta de Vacas Secas */}
                <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Vacas Secas</h4>
                  <p className="text-4xl font-bold mt-2">{dryCows}</p>
                  <p className="text-sm opacity-80 mt-1">En período de descanso</p>
                </div>
                {/* Tarjeta de Vacas Preñadas y Secas */}
                <div className="p-6 bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Vacas Preñadas y Secas</h4>
                  <p className="text-4xl font-bold mt-2">{pregnantAndDryCows}</p>
                  <p className="text-sm opacity-80 mt-1">Menos de 100 días para parir</p>
                </div>
                {/* Tarjeta de Vacas Vacías */}
                <div className="p-6 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Vacas Vacías</h4>
                  <p className="text-4xl font-bold mt-2">{emptyCows}</p>
                  <p className="text-sm opacity-80 mt-1">Listas para inseminación</p>
                </div>
                {/* Tarjeta de Terneros */}
                <div className="p-6 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Terneros</h4>
                  <p className="text-4xl font-bold mt-2">{totalCalves}</p>
                  <p className="text-sm opacity-80 mt-1">Crías jóvenes</p>
                </div>
                {/* Tarjeta de Mautes */}
                <div className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Mautes</h4>
                  <p className="text-4xl font-bold mt-2">{totalMautes}</p>
                  <p className="text-sm opacity-80 mt-1">Animales en crecimiento</p>
                </div>
                {/* Tarjeta de Novillas */}
                <div className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Novillas</h4>
                  <p className="text-4xl font-bold mt-2">{totalNovillas}</p>
                  <p className="text-sm opacity-80 mt-1">Hembras jóvenes para cría</p>
                </div>
                {/* Tarjeta de Toros */}
                <div className="p-6 bg-gradient-to-br from-gray-500 to-gray-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col justify-between">
                  <h4 className="font-semibold text-lg">Toros</h4>
                  <p className="text-4xl font-bold mt-2">{totalToros}</p>
                  <p className="text-sm opacity-80 mt-1">Machos reproductores</p>
                </div>
              </div>

              {/* Gráficos de Producción */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Producción de Leche (Últimos Registros)</h4>
                  {renderSimpleChart(milkProductionData, '#34D399')}
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4">Producción de Carne (Últimos Registros)</h4>
                  {renderSimpleChart(meatProductionData, '#FBBF24')}
                </div>
              </div>

              <button
                onClick={() => handleNavigate('subscriptionPlans')}
                className="mt-6 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ver Planes de Suscripción
              </button>
            </div>
          );
          break;
      }
      return <DashboardLayout onNavigate={handleNavigate}>{content}</DashboardLayout>;
    }
  };

  return renderPage();
};

export default App;