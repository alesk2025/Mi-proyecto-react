import React, { useState, useEffect, useMemo, memo } from 'react';
import {
  UserGroupIcon, ArchiveBoxIcon, ArrowTrendingUpIcon, ClockIcon, BeakerIcon, TagIcon, UsersIcon, CircleStackIcon, BuildingLibraryIcon, CurrencyDollarIcon, CalendarDaysIcon, SunIcon, MoonIcon, SparklesIcon
} from '@heroicons/react/24/outline'; // Added more icons for variety
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
import SupplierClientManagement from './components/EconomicManagement/SupplierClientManagement';

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

// Memoized Page Components
const AnimalRegistrationPageComponent = memo(AnimalRegistrationPage);
const SanitaryControlPageComponent = memo(SanitaryControlPage);
const ReproductiveControlPageComponent = memo(ReproductiveControlPage);
const ProductionControlPageComponent = memo(ProductionControlPage);
const InventoryPageComponent = memo(InventoryPage);
const EconomicManagementPageComponent = memo(EconomicManagementPage);
const PersonnelManagementPageComponent = memo(PersonnelManagementPage);
const SupplierClientManagementComponent = memo(SupplierClientManagement);
const SubscriptionPlansPageComponent = memo(SubscriptionPlansPage);
// Auth components are small, memoizing them might be overkill but let's be consistent for now.
const AuthLoginFormMemoized = memo(AuthLoginForm);
const AuthRegisterFormMemoized = memo(AuthRegisterForm);


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

  const totalAnimals = useMemo(() => animals.length, [animals]);
  const totalCows = useMemo(() => animals.filter(animal => animal.sexo === 'hembra').length, [animals]);
  const totalBulls = useMemo(() => animals.filter(animal => animal.sexo === 'macho').length, [animals]);

  const pregnantCowsArray = useMemo(() => animals.filter(animal => animal.sexo === 'hembra' && animal.estadoReproductivo === 'preñada'), [animals]);
  const pregnantCowsCount = useMemo(() => pregnantCowsArray.length, [pregnantCowsArray]);

  const productionCows = useMemo(() => animals.filter(animal => animal.sexo === 'hembra' && animal.estadoReproductivo === 'produccion').length, [animals]);
  const dryCows = useMemo(() => animals.filter(animal => animal.sexo === 'hembra' && animal.estadoReproductivo === 'seca').length, [animals]);
  const emptyCows = useMemo(() => animals.filter(animal => animal.sexo === 'hembra' && animal.estadoReproductivo === 'vacia').length, [animals]);

  const pregnantAndDryCows = useMemo(() => pregnantCowsArray.filter(cow => {
    const calvingRecord = calvingSchedule.find(record => record.animalId === cow.id);
    if (calvingRecord && calvingRecord.expectedCalvingDate) {
      const today = new Date();
      const expectedDate = new Date(calvingRecord.expectedCalvingDate);
      const diffTime = Math.abs(expectedDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 100;
    }
    return false;
  }).length, [pregnantCowsArray, calvingSchedule]);

  const totalCalves = useMemo(() => animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Terner')).length, [animals]);
  const totalMautes = useMemo(() => animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Maut')).length, [animals]);
  const totalNovillas = useMemo(() => animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Novilla')).length, [animals]);
  const totalToros = useMemo(() => animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo) === 'Toro').length, [animals]);

  // Datos para los gráficos de producción
  const milkProductionData = useMemo(() => productionRecords
    .filter(record => record.tipoProduccion === 'leche')
    .sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro))
    .map(record => ({ date: record.fechaRegistro, value: record.cantidad })), [productionRecords]);

  const meatProductionData = useMemo(() => productionRecords
    .filter(record => record.tipoProduccion === 'carne')
    .sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro))
    .map(record => ({ date: record.fechaRegistro, value: record.cantidad })), [productionRecords]);

  // Función para dibujar un gráfico simple (simulado con div)
  const renderSimpleChart = (data, barColorClass) => {
    if (data.length < 2) {
      return <p className="text-sm text-gray-500 dark:text-gray-400">No hay suficientes datos para mostrar el gráfico.</p>;
    }
    const maxVal = Math.max(...data.map(d => d.value));
    const minVal = Math.min(...data.map(d => d.value));
    const range = maxVal - minVal;

    return (
      <div className="flex items-end h-32 md:h-48 border-b border-l border-gray-300 dark:border-gray-600 p-1">
        {data.map((d, index) => (
          <div
            key={index}
            className={`w-5 md:w-6 mx-0.5 ${barColorClass}`} // Use Tailwind class for bar color
            style={{
              height: `${range > 0 ? ((d.value - minVal) / range) * 80 + 20 : 50}%`, // Keep dynamic height
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
            <AuthLoginFormMemoized onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} registeredUsers={registeredUsers} />
          ) : (
            <AuthRegisterFormMemoized onRegisterSuccess={handleRegisterUser} onNavigateToLogin={() => setCurrentPage('login')} />
          )}
        </AuthLayout>
      );
    } else {
      let content;
      switch (currentPage) {
        case 'animalRegistration':
          content = (
            <AnimalRegistrationPageComponent
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
            <SanitaryControlPageComponent
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
           <ReproductiveControlPageComponent
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
            <ProductionControlPageComponent
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
            <InventoryPageComponent
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
            <EconomicManagementPageComponent
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
            <PersonnelManagementPageComponent
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
            <SupplierClientManagementComponent
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
            <SubscriptionPlansPageComponent
              currentPlan={currentUser ? currentUser.subscriptionPlan : 'Gratuito'}
              onUpdateSubscription={handleUpdateSubscription}
              plans={SUBSCRIPTION_PLANS}
            />
          );
          break;
        case 'dashboard':
        default:
          // Helper for dashboard cards
          const DashboardCard = ({ title, value, subText, icon: Icon }) => (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-card shadow-lg card-interactive">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h4>
                {Icon && <Icon className="h-8 w-8 text-brand-secondary dark:text-brand-secondary-dark" />}
              </div>
              <p className="text-4xl font-bold text-brand-primary dark:text-brand-primary-dark">{value}</p>
              {subText && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subText}</p>}
            </div>
          );

          content = (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-card shadow-lg card-interactive">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bienvenido al Dashboard, {currentUser ? currentUser.fullName : 'Usuario'}!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tu plan actual es: <span className="font-bold text-brand-secondary dark:text-emerald-400">{currentUser ? currentUser.subscriptionPlan : 'N/A'}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Selecciona una opción del menú lateral para empezar a gestionar tu finca.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-card shadow-lg">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Personalizar Logo de Finca</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="input-default" // Using the new input style
                />
                {logoUrl && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Logo actual:</p>
                    <img src={logoUrl} alt="Logo de la Finca" className="max-h-24 mx-auto rounded-md shadow-md" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <DashboardCard title="Total Animales" value={totalAnimals} subText={`(${getRemaining('animal')} restantes)`} icon={UserGroupIcon} />
                <DashboardCard title="Inventario" value={inventory.length} subText={`(${getRemaining('inventoryItem')} restantes)`} icon={ArchiveBoxIcon} />
                <DashboardCard title="Empleados" value={employees.length} subText={`(${getRemaining('employee')} restantes)`} icon={UsersIcon} />
                <DashboardCard title="Vacas en Producción" value={productionCows} subText="Lecheras activas" icon={ArrowTrendingUpIcon} />
                <DashboardCard title="Vacas Preñadas" value={pregnantCowsCount} subText="Próximos partos" icon={CalendarDaysIcon} />
                <DashboardCard title="Vacas Secas" value={dryCows} subText="Período descanso" icon={MoonIcon} />
                <DashboardCard title="Preñadas y Secas (<100d)" value={pregnantAndDryCows} subText="Menos de 100 días para parir" icon={ClockIcon} />
                <DashboardCard title="Vacas Vacías" value={emptyCows} subText="Listas para servicio" icon={SparklesIcon} />
                <DashboardCard title="Terneros(as)" value={totalCalves} subText="Crías jóvenes" icon={TagIcon} />
                <DashboardCard title="Mautes(as)" value={totalMautes} subText="En crecimiento" icon={TagIcon} />
                <DashboardCard title="Novillas" value={totalNovillas} subText="Jóvenes para cría" icon={TagIcon} />
                <DashboardCard title="Toros" value={totalToros} subText="Machos reproductores" icon={TagIcon} />
              </div>

              {/* Gráficos de Producción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-card shadow-lg card-interactive">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Producción de Leche (Últimos Registros)</h4>
                  {renderSimpleChart(milkProductionData, 'bg-brand-primary')}
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-card shadow-lg card-interactive">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Producción de Carne (Últimos Registros)</h4>
                  {renderSimpleChart(meatProductionData, 'bg-brand-secondary')}
                </div>
              </div>

              <button
                onClick={() => handleNavigate('subscriptionPlans')}
                className="btn btn-primary" // Using new button style
              >
                Ver Planes de Suscripción
              </button>
            </div>
          );
          break;
      }
      return <DashboardLayout onNavigate={handleNavigate} currentPage={currentPage}>{content}</DashboardLayout>;
    }
  };

  return renderPage();
};

export default App;