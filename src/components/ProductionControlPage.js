import React, { useState, useRef, useEffect, useCallback } from 'react';
import { exportToCsv, exportTableToPdf } from '../utils/exportHelpers'; // Importar funciones de exportación

const ProductionControlPage = ({ animals, onUpdateAnimalProduction, onRegisterProductionRecord, productionRecords, setProductionRecords, currentUser, logoUrl }) => {
  const [currentProductionSection, setCurrentProductionSection] = useState('general'); // 'general', 'leche', 'carne', 'potreros'

  const [productionData, setProductionData] = useState({
    animalId: '',
    fechaRegistro: '',
    tipoProduccion: '', // 'leche', 'carne'
    cantidad: '', // Cantidad de producción (ej. litros de leche, kg de carne)
    unidadMedida: '', // 'litros', 'kg'
    observaciones: '',
  });

  const [editingRecord, setEditingRecord] = useState(null); // To hold the record being edited
  const productionTableRef = useRef(null); // Ref for the production history table

  // Estados para el análisis de tendencias y consejos de IA
  const [milkTrend, setMilkTrend] = useState('estable'); // 'aumentando', 'decayendo', 'estable'
  const [meatTrend, setMeatTrend] = useState('estable'); // 'aumentando', 'decayendo', 'estable'
  const [milkAdvice, setMilkAdvice] = useState('');
  const [meatAdvice, setMeatAdvice] = useState('');
  const [aiAdviceHistory, setAiAdviceHistory] = useState([]); // Nuevo estado para el historial de consejos

  // Estados para el control de potreros
  const [pastureMap, setPastureMap] = useState(null);
  const [pastureData, setPastureData] = useState({
    name: '',
    size: '', // en hectáreas o m2
    grassType: '',
    status: 'disponible', // 'disponible', 'en_uso', 'no_disponible'
    lastUsedDate: '', // Fecha de finalización de uso
    cowCount: '', // Cantidad de vacas a pastorear
    recommendedDays: '', // Días recomendados por la IA
  });
  const [pastures, setPastures] = useState([]); // Lista de potreros registrados

  // Función para calcular la tendencia y generar consejos
  const analyzeProductionAndAdvise = useCallback((records, type) => {
    const relevantRecords = records
      .filter(record => record.tipoProduccion === type)
      .sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro));

    if (relevantRecords.length < 2) {
      return { trend: 'estable', advice: 'Necesitamos más datos para analizar la tendencia de producción.' };
    }

    const latestRecords = relevantRecords.slice(-3); // Tomar los últimos 3 registros para un análisis simple

    if (latestRecords.length < 2) {
      return { trend: 'estable', advice: 'Necesitamos al menos dos registros para analizar la tendencia.' };
    }

    let increasingCount = 0;
    let decreasingCount = 0;

    for (let i = 1; i < latestRecords.length; i++) {
      if (latestRecords[i].cantidad > latestRecords[i - 1].cantidad) {
        increasingCount++;
      } else if (latestRecords[i].cantidad < latestRecords[i - 1].cantidad) {
        decreasingCount++;
      }
    }

    let trend = 'estable';
    let advice = '';

    if (increasingCount > decreasingCount) {
      trend = 'aumentando';
      advice = `¡Excelente! La producción de ${type} está aumentando. Sigue con las buenas prácticas de alimentación y manejo.`;
    } else if (decreasingCount > increasingCount) {
      trend = 'decayendo';
      advice = `¡Atención! La producción de ${type} está decayendo. Considera revisar la dieta, el estado de salud del animal o el manejo del estrés.`;
    } else {
      trend = 'estable';
      advice = `La producción de ${type} se mantiene estable. Si buscas mejorarla, evalúa optimizar la alimentación o el confort del animal.`;
    }

    return { trend, advice };
  }, []); // No dependencies needed as it only uses its arguments

  useEffect(() => {
    const { trend: milkT, advice: milkA } = analyzeProductionAndAdvise(productionRecords, 'leche');
    setMilkTrend(milkT);
    setMilkAdvice(milkA);
    if (milkA && milkA !== 'Necesitamos más datos para analizar la tendencia de producción.' && milkA !== 'Necesitamos al menos dos registros para analizar la tendencia.') {
      setAiAdviceHistory(prev => [...prev, { date: new Date().toISOString().split('T')[0], type: 'leche', advice: milkA }]);
    }

    const { trend: meatT, advice: meatA } = analyzeProductionAndAdvise(productionRecords, 'carne');
    setMeatTrend(meatT);
    setMeatAdvice(meatA);
    if (meatA && meatA !== 'Necesitamos más datos para analizar la tendencia de producción.' && meatA !== 'Necesitamos al menos dos registros para analizar la tendencia.') {
      setAiAdviceHistory(prev => [...prev, { date: new Date().toISOString().split('T')[0], type: 'carne', advice: meatA }]);
    }
  }, [productionRecords, analyzeProductionAndAdvise]); // Add analyzeProductionAndAdvise to dependencies

  const handleProductionChange = (e) => {
    const { name, value } = e.target;
    setProductionData({ ...productionData, [name]: value });
  };

  const handleProductionSubmit = () => {
    const { animalId, fechaRegistro, tipoProduccion, cantidad, unidadMedida, observaciones } = productionData;

    if (!animalId || !fechaRegistro || !tipoProduccion || !cantidad || !unidadMedida) {
      alert('¡Ups! Para registrar la producción, necesitamos que completes todos los campos obligatorios. ¡No te rindas, ya casi lo logras!');
      return;
    }

    onRegisterProductionRecord({
      id: `PROD-${Date.now().toString().slice(-5)}`, // Generar ID único
      animalId,
      fechaRegistro,
      tipoProduccion,
      cantidad: parseFloat(cantidad),
      unidadMedida,
      observaciones,
    });

    alert('¡Producción registrada con éxito! ¡Tus animales son unos campeones!');
    setProductionData({
      animalId: '',
      fechaRegistro: '',
      tipoProduccion: '',
      cantidad: '',
      unidadMedida: '',
      observaciones: '',
    });
  };

  const handleDeleteProductionRecord = (recordId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro de producción? ¡Esta acción no se puede deshacer!')) {
      const updatedRecords = productionRecords.filter(record => record.id !== recordId);
      setProductionRecords(updatedRecords); // Update state in App.js via prop
      alert('¡Registro de producción eliminado! Como si nunca hubiera existido.');
    }
  };

  const startEditingProductionRecord = (record) => {
    setEditingRecord({ ...record }); // Create a copy to edit
    alert('¡A editar se ha dicho! Modifica los campos y guarda los cambios.');
  };

  const handleEditingProductionChange = (e) => {
    const { name, value } = e.target;
    setEditingRecord(prev => ({ ...prev, [name]: value }));
  };

  const saveEditedProductionRecord = () => {
    const updatedRecords = productionRecords.map(record =>
      record.id === editingRecord.id ? editingRecord : record
    );
    setProductionRecords(updatedRecords); // Update state in App.js via prop
    setEditingRecord(null); // Exit editing mode
    alert('¡Cambios guardados! Tu historial de producción está al día.');
  };

  const cancelEditingProductionRecord = () => {
    setEditingRecord(null); // Exit editing mode
    alert('¡Edición cancelada! No te preocupes, tus datos están a salvo.');
  };

  const handleExportProductionHistory = async (format) => {
    if (productionRecords.length === 0) {
      alert('¡No hay registros de producción para exportar! ¿Qué esperas para empezar a registrar?');
      return;
    }

    const filename = `historial_produccion_${new Date().toISOString().split('T')[0]}`;
    const farmName = currentUser?.farmName || 'Mi Finca Ganadera';
    const adminName = currentUser?.fullName || 'Administrador';

    if (format === 'csv') {
      exportToCsv(productionRecords, filename);
      alert('¡Exportando a CSV! Tu historial estará listo en un santiamén.');
    } else if (format === 'pdf') {
      await exportTableToPdf(productionTableRef.current, filename, 'Historial de Producción', farmName, adminName, logoUrl);
      alert('¡Generando PDF! Tu historial se verá de lujo en papel.');
    }
  };

  const filteredProductionRecords = productionRecords.filter(record => {
    if (currentProductionSection === 'carne' && record.tipoProduccion !== 'carne') {
      return false;
    }
    if (currentProductionSection === 'leche' && record.tipoProduccion !== 'leche') {
      return false;
    }
    return true;
  });

  // --- Lógica de Potreros ---
  const handlePastureMapUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPastureMap(reader.result);
        alert('¡Mapa de potreros subido con éxito!');
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateRecommendedDays = useCallback((cowCount, pastureSizeM2) => {
    // Asumiendo 5000m2 por potrero como base para las reglas dadas
    // Reglas: 18-20 vacas = 1 día, 10 vacas = 2 días
    // Esto es una simplificación, la capacidad de carga real depende de muchos factores
    const baseAreaPerCowPerDay = 5000 / 18; // m2 por vaca por día (para 18 vacas en 5000m2)

    if (cowCount <= 0 || pastureSizeM2 <= 0) return 0;

    const totalCowDaysCapacity = pastureSizeM2 / baseAreaPerCowPerDay;
    const days = totalCowDaysCapacity / cowCount;

    return Math.round(days);
  }, []); // No dependencies needed as it only uses its arguments

  const handlePastureDataChange = (e) => {
    const { name, value } = e.target;
    let updatedPastureData = { ...pastureData, [name]: value };

    if (name === 'cowCount' || name === 'size') {
      const currentCowCount = name === 'cowCount' ? parseFloat(value) : parseFloat(pastureData.cowCount);
      const currentPastureSize = name === 'size' ? parseFloat(value) : parseFloat(pastureData.size);
      if (!isNaN(currentCowCount) && !isNaN(currentPastureSize) && currentPastureSize > 0) {
        updatedPastureData.recommendedDays = calculateRecommendedDays(currentCowCount, currentPastureSize);
      } else {
        updatedPastureData.recommendedDays = '';
      }
    }
    setPastureData(updatedPastureData);
  };

  const handleAddPasture = () => {
    if (!pastureData.name || !pastureData.size || !pastureData.grassType || !pastureData.cowCount) {
      alert('¡Faltan datos! Por favor, completa el nombre, tamaño, tipo de pasto y cantidad de vacas.');
      return;
    }
    const newPasture = { ...pastureData, id: `POT-${Date.now().toString().slice(-5)}` };
    setPastures(prev => [...prev, newPasture]);
    alert(`¡Potrero ${newPasture.name} registrado con éxito!`);
    setPastureData({ name: '', size: '', grassType: '', status: 'disponible', lastUsedDate: '', cowCount: '', recommendedDays: '' });
  };

  const handleUsePasture = (id) => {
    setPastures(prev => prev.map(p => p.id === id ? { ...p, status: 'en_uso', lastUsedDate: '' } : p));
    alert('¡Potrero marcado como en uso!');
  };

  const handleFinalizePastureUse = (id) => {
    setPastures(prev => prev.map(p => p.id === id ? { ...p, status: 'no_disponible', lastUsedDate: new Date().toISOString().split('T')[0] } : p));
    alert('¡Uso de potrero finalizado! Iniciando periodo de descanso.');
  };

  // Automatización de estado de potreros
  useEffect(() => {
    const today = new Date();
    const updatedPastures = pastures.map(p => {
      if (p.status === 'no_disponible' && p.lastUsedDate) {
        const lastUsed = new Date(p.lastUsedDate);
        const diffTime = Math.abs(today - lastUsed);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 30) { // 30 días de descanso
          return { ...p, status: 'disponible' };
        }
      }
      return p;
    });
    setPastures(updatedPastures);

    // Aviso de no dejar pasar el potrero de no más de 90 días
    pastures.forEach(p => {
      if (p.status === 'disponible' && p.lastUsedDate) {
        const lastUsed = new Date(p.lastUsedDate);
        const diffTime = Math.abs(today - lastUsed);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 90) {
          console.warn(`¡Atención! El potrero ${p.name} lleva ${diffDays} días sin usarse. Considera rotarlo.`);
        }
      }
    });
  }, [pastures]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Control de Producción y Potreros</h3>

      {/* Navegación de Secciones */}
      <div className="flex justify-center mb-8 space-x-4 p-2 bg-gray-100 rounded-lg shadow-inner">
        <button
          onClick={() => setCurrentProductionSection('general')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${currentProductionSection === 'general' ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
        >
          Producción General
        </button>
        <button
          onClick={() => setCurrentProductionSection('leche')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${currentProductionSection === 'leche' ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
        >
          Producción de Leche
        </button>
        <button
          onClick={() => setCurrentProductionSection('carne')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${currentProductionSection === 'carne' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
        >
          Producción de Carne
        </button>
        <button
          onClick={() => setCurrentProductionSection('potreros')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${currentProductionSection === 'potreros' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
        >
          Control de Potreros
        </button>
      </div>

      {currentProductionSection !== 'potreros' && (
        <>
          {/* Sección de Tendencias y Consejos */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Análisis de Tendencias de Producción</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-100">
                <p className="text-gray-700 font-bold mb-2">Tendencia de Leche:</p>
                <span className={`text-xl font-bold ${milkTrend === 'aumentando' ? 'text-green-600' : milkTrend === 'decayendo' ? 'text-red-600' : 'text-gray-600'}`}>
                  {milkTrend === 'aumentando' ? '¡Aumentando! 📈' : milkTrend === 'decayendo' ? '¡Decayendo! 📉' : 'Estable ↔️'}
                </span>
                <p className="text-sm text-gray-600 mt-2">{milkAdvice}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-100">
                <p className="text-gray-700 font-bold mb-2">Tendencia de Carne:</p>
                <span className={`text-xl font-bold ${meatTrend === 'aumentando' ? 'text-green-600' : meatTrend === 'decayendo' ? 'text-red-600' : 'text-gray-600'}`}>
                  {meatTrend === 'aumentando' ? '¡Aumentando! 📈' : meatTrend === 'decayendo' ? '¡Decayendo! 📉' : 'Estable ↔️'}
                </span>
                <p className="text-sm text-gray-600 mt-2">{meatAdvice}</p>
              </div>
            </div>
          </div>

          {/* Historial de Consejos de la IA */}
          <div className="p-6 border border-blue-200 rounded-lg bg-blue-50 shadow-sm mb-8">
            <h4 className="text-lg font-semibold mb-4 text-blue-800">Historial de Consejos de la IA</h4>
            {aiAdviceHistory.length === 0 ? (
              <p className="text-gray-600">Aún no hay consejos de la IA. ¡Registra más producción para obtenerlos!</p>
            ) : (
              <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                {aiAdviceHistory.map((advice, index) => (
                  <div key={index} className="mb-3 p-3 bg-blue-100 rounded-lg border border-blue-200 flex items-start space-x-3">
                    <span className="text-blue-600 text-xl">💡</span>
                    <div>
                      <p className="text-sm text-gray-800 font-medium">
                        <span className="font-bold">{advice.date} - {advice.type.charAt(0).toUpperCase() + advice.type.slice(1)}:</span>
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{advice.advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario de Registro de Producción */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm mb-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Registrar Nueva Producción</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="animalId" className="block text-gray-700 text-sm font-bold mb-1">Animal:</label>
                <select
                  id="animalId"
                  name="animalId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={productionData.animalId}
                  onChange={handleProductionChange}
                >
                  <option value="">Selecciona Animal</option>
                  {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="fechaRegistro" className="block text-gray-700 text-sm font-bold mb-1">Fecha de Registro:</label>
                <input
                  type="date"
                  id="fechaRegistro"
                  name="fechaRegistro"
                  placeholder="Fecha de Registro"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={productionData.fechaRegistro}
                  onChange={handleProductionChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="tipoProduccion" className="block text-gray-700 text-sm font-bold mb-1">Tipo de Producción:</label>
                <select
                  id="tipoProduccion"
                  name="tipoProduccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={productionData.tipoProduccion}
                  onChange={handleProductionChange}
                >
                  <option value="">Selecciona Tipo</option>
                  <option value="leche">Leche</option>
                  <option value="carne">Carne</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="cantidad" className="block text-gray-700 text-sm font-bold mb-1">Cantidad:</label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  placeholder="Cantidad"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={productionData.cantidad}
                  onChange={handleProductionChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="unidadMedida" className="block text-gray-700 text-sm font-bold mb-1">Unidad de Medida:</label>
                <input
                  type="text"
                  id="unidadMedida"
                  name="unidadMedida"
                  placeholder="Unidad de Medida (ej. litros, kg)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={productionData.unidadMedida}
                  onChange={handleProductionChange}
                />
              </div>
              <div className="flex flex-col col-span-full">
                <label htmlFor="observaciones" className="block text-gray-700 text-sm font-bold mb-1">Observaciones:</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  placeholder="Observaciones"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
                  value={productionData.observaciones}
                  onChange={handleProductionChange}
                ></textarea>
              </div>
            </div>
            <button
              onClick={handleProductionSubmit}
              className="w-full mt-6 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
            >
              Registrar Producción
            </button>
          </div>

          {/* Historial de Producción */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Historial de Producción</h4>
            <div className="flex justify-end mb-4 space-x-2">
              <button
                onClick={() => handleExportProductionHistory('csv')}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Exportar a CSV
              </button>
              <button
                onClick={() => handleExportProductionHistory('pdf')}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                Exportar a PDF
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table ref={productionTableRef} className="min-w-full bg-white text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold rounded-tl-lg">ID Registro</th>
                    <th className="py-3 px-4 text-left font-semibold">ID Animal</th>
                    <th className="py-3 px-4 text-left font-semibold">Fecha</th>
                    <th className="py-3 px-4 text-left font-semibold">Tipo</th>
                    <th className="py-3 px-4 text-left font-semibold">Cantidad</th>
                    <th className="py-3 px-4 text-left font-semibold">Unidad</th>
                    <th className="py-3 px-4 text-left font-semibold">Observaciones</th>
                    <th className="py-3 px-4 text-left font-semibold rounded-tr-lg">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProductionRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-100 transition-colors">
                      <td className="py-3 px-4">{record.id}</td>
                      <td className="py-3 px-4">{record.animalId}</td>
                      <td className="py-3 px-4">{record.fechaRegistro}</td>
                      <td className="py-3 px-4">{record.tipoProduccion}</td>
                      <td className="py-3 px-4">{record.cantidad}</td>
                      <td className="py-3 px-4">{record.unidadMedida}</td>
                      <td className="py-3 px-4">{record.observaciones}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => startEditingProductionRecord(record)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-2 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProductionRecord(record.id)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Form for Production Record */}
            {editingRecord && (
              <div className="mt-8 p-6 border border-yellow-300 rounded-lg bg-yellow-50 shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Editar Registro de Producción: {editingRecord.id}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-1">ID Animal:</label>
                    <input
                      type="text"
                      name="animalId"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                      value={editingRecord.animalId}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Fecha Registro:</label>
                    <input
                      type="date"
                      name="fechaRegistro"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                      value={editingRecord.fechaRegistro}
                      onChange={handleEditingProductionChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Tipo Producción:</label>
                    <input
                      type="text"
                      name="tipoProduccion"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                      value={editingRecord.tipoProduccion}
                      onChange={handleEditingProductionChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Cantidad:</label>
                    <input
                      type="number"
                      name="cantidad"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                      value={editingRecord.cantidad}
                      onChange={handleEditingProductionChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Unidad Medida:</label>
                    <input
                      type="text"
                      name="unidadMedida"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                      value={editingRecord.unidadMedida}
                      onChange={handleEditingProductionChange}
                    />
                  </div>
                  <div className="flex flex-col col-span-full">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Observaciones:</label>
                    <textarea
                      name="observaciones"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
                      value={editingRecord.observaciones}
                      onChange={handleEditingProductionChange}
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={saveEditedProductionRecord}
                    className="bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={cancelEditingProductionRecord}
                    className="bg-gray-600 text-white py-2 px-5 rounded-lg hover:bg-gray-700 transition-colors shadow-md"
                  >
                    Cancelar Edición
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {currentProductionSection === 'potreros' && (
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Control de Potreros</h4>

          {/* Subir Mapa de Potreros */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-inner">
            <label className="block text-gray-700 text-sm font-bold mb-2">Subir Mapa de Potreros (JPG)</label>
            <input
              type="file"
              accept="image/jpeg"
              onChange={handlePastureMapUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
            />
            {pastureMap && (
              <div className="mt-4 text-center p-2 border border-gray-200 rounded-lg bg-gray-50">
                <img src={pastureMap} alt="Mapa de Potreros" className="max-h-80 mx-auto rounded-lg shadow-md" />
              </div>
            )}
          </div>

          {/* Registrar Potrero */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-100 shadow-inner mb-8">
            <h5 className="text-md font-semibold mb-4 text-gray-800">Registrar Nuevo Potrero</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="pastureName" className="block text-gray-700 text-sm font-bold mb-1">Nombre/Número del Potrero:</label>
                <input
                  type="text"
                  id="pastureName"
                  name="name"
                  placeholder="Ej. Potrero 1, La Loma"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={pastureData.name}
                  onChange={handlePastureDataChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="pastureSize" className="block text-gray-700 text-sm font-bold mb-1">Tamaño (m²):</label>
                <input
                  type="number"
                  id="pastureSize"
                  name="size"
                  placeholder="Ej. 5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={pastureData.size}
                  onChange={handlePastureDataChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="grassType" className="block text-gray-700 text-sm font-bold mb-1">Tipo de Pasto:</label>
                <input
                  type="text"
                  id="grassType"
                  name="grassType"
                  placeholder="Ej. Brachiaria, Estrella"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={pastureData.grassType}
                  onChange={handlePastureDataChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="cowCount" className="block text-gray-700 text-sm font-bold mb-1">Cantidad de Vacas a Pastorear:</label>
                <input
                  type="number"
                  id="cowCount"
                  name="cowCount"
                  placeholder="Ej. 15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={pastureData.cowCount}
                  onChange={handlePastureDataChange}
                />
              </div>
              {pastureData.recommendedDays !== '' && (
                <p className="col-span-full text-sm text-gray-700 font-bold p-2 bg-blue-100 rounded-lg border border-blue-200">
                  Recomendación IA: Este potrero puede usarse por <span className="text-blue-700 font-extrabold">{pastureData.recommendedDays}</span> días con <span className="text-blue-700 font-extrabold">{pastureData.cowCount}</span> vacas.
                </p>
              )}
            </div>
            <button
              onClick={handleAddPasture}
              className="w-full mt-6 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
            >
              Registrar Potrero
            </button>
          </div>

          {/* Lista de Potreros */}
          <h5 className="text-lg font-semibold mb-4 text-gray-800">Estado de Potreros</h5>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Nombre</th>
                  <th className="py-3 px-4 text-left font-semibold">Tamaño</th>
                  <th className="py-3 px-4 text-left font-semibold">Tipo de Pasto</th>
                  <th className="py-3 px-4 text-left font-semibold">Estado</th>
                  <th className="py-3 px-4 text-left font-semibold">Último Uso</th>
                  <th className="py-3 px-4 text-left font-semibold">Vacas</th>
                  <th className="py-3 px-4 text-left font-semibold">Días Rec.</th>
                  <th className="py-3 px-4 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pastures.map(pasture => (
                  <tr key={pasture.id} className="hover:bg-gray-100 transition-colors">
                    <td className="py-3 px-4">{pasture.name}</td>
                    <td className="py-3 px-4">{pasture.size} m²</td>
                    <td className="py-3 px-4">{pasture.grassType}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        pasture.status === 'disponible' ? 'text-green-600' :
                        pasture.status === 'en_uso' ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {pasture.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">{pasture.lastUsedDate || 'N/A'}</td>
                    <td className="py-3 px-4">{pasture.cowCount || 'N/A'}</td>
                    <td className="py-3 px-4">{pasture.recommendedDays || 'N/A'}</td>
                    <td className="py-3 px-4">
                      {pasture.status === 'disponible' && (
                        <button
                          onClick={() => handleUsePasture(pasture.id)}
                          className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors text-xs shadow-sm mr-2"
                        >
                          Usar
                        </button>
                      )}
                      {pasture.status === 'en_uso' && (
                        <button
                          onClick={() => handleFinalizePastureUse(pasture.id)}
                          className="bg-orange-500 text-white py-1 px-3 rounded-lg hover:bg-orange-600 transition-colors text-xs shadow-sm mr-2"
                        >
                          Finalizar Uso
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionControlPage;