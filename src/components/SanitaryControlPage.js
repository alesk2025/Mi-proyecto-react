import React, { useState, useEffect, useCallback } from 'react';

const SanitaryControlPage = ({ inventoryItems, onUpdateInventoryQuantity, animals, treatmentsHistory, setTreatmentsHistory, diseasesHistory, setDiseasesHistory, vaccinationSchedule, setVaccinationSchedule, dewormingSchedule, setDewormingSchedule, vitaminSchedule, setVitaminSchedule }) => {
  // Estados para los formularios de registro
  const [treatmentData, setTreatmentData] = useState({
    animalId: '',
    productId: '',
    dosis: '',
    fechaAplicacion: '',
    observaciones: '',
    manualDosis: true, // Modificado para tratamiento general: siempre manual
  });
  const [vaccinationData, setVaccinationData] = useState({
    animalId: '',
    productId: '',
    dosis: '',
    fechaAplicacion: '',
    observaciones: '',
    manualDosis: false,
  });
  const [dewormingData, setDewormingData] = useState({
    animalId: '',
    productId: '',
    dosis: '',
    fechaAplicacion: '',
    observaciones: '',
    manualDosis: false,
  });
  const [vitaminData, setVitaminData] = useState({
    animalId: '',
    productId: '',
    dosis: '',
    fechaAplicacion: '',
    observaciones: '',
    manualDosis: false,
  });
  const [diseaseData, setDiseaseData] = useState({
    animalId: '',
    diseaseName: '',
    symptoms: '',
    diagnosisDate: '',
    treatmentProductId: '',
    treatmentDosis: '',
    treatmentStartDate: '',
    treatmentEndDate: '',
    recoveryDate: '',
    diseaseObservations: '',
  });

  // Frecuencias y umbrales (cargados desde localStorage)
  const [dewormingFrequency, setDewormingFrequency] = useState(() => JSON.parse(localStorage.getItem('dewormingFrequency')) || { value: 3, unit: 'meses' });
  const [vitaminFrequency, setVitaminFrequency] = useState(() => JSON.parse(localStorage.getItem('vitaminFrequency')) || { value: 6, unit: 'meses' });
  const [stockThreshold, setStockThreshold] = useState(() => JSON.parse(localStorage.getItem('stockThreshold')) || 10);

  // Estados para controlar la visibilidad de los acordeones
  const [showTreatmentsHistory, setShowTreatmentsHistory] = useState(false);
  const [showDiseasesHistory, setShowDiseasesHistory] = useState(false);
  const [showVaccinationSchedule, setShowVaccinationSchedule] = useState(false);
  const [showDewormingSchedule, setShowDewormingSchedule] = useState(false);
  const [showVitaminSchedule, setShowVitaminSchedule] = useState(false);

  // Mock de la "IA" para recomendaciones de dosis y tipo de producto para bovinos
  // Simula una "investigación profunda" con datos más específicos y cálculos
  const aiRecommendations = useCallback((productName, animalId) => {
    const lowerCaseName = productName.toLowerCase();
    let type = 'general';
    let recommendedDosis = 'Consultar etiqueta'; // Dosis por defecto
    let frequency = null;
    let detailedRecommendation = 'Se recomienda consultar a un veterinario para la dosis exacta.';

    const animal = animals.find(a => a.id === animalId);
    const animalWeight = animal ? parseFloat(animal.peso) : 0; // Asumiendo que el animal tiene un campo 'peso'

    // Base de datos de productos con información detallada
    const productDatabase = {
      // Vacunas Antirrábicas
      "ravax": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea o intramuscular",
        minAge: "3 meses", frequency: { value: 6, unit: "meses" },
        notes: "Cepa ERA inactivada. Más de 60 años de uso en Venezuela con probada efectividad."
      },
      "rabivac": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea o intramuscular",
        minAge: "3 meses", frequency: { value: 1, unit: "años" },
        notes: "Vacuna inactivada con cepa Pasteur. Amplia distribución en zonas de rabia paresiante."
      },
      "vacuna antirrábica de producción nacional": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "3 meses", frequency: { value: 1, unit: "años" },
        notes: "Usada en campañas oficiales del Ministerio de Agricultura en zonas afectadas por murciélagos hematófagos."
      },
      "rabivac-vet": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "intramuscular o subcutánea",
        minAge: "3 meses", frequency: { value: 1, unit: "años" },
        notes: "Registrada por Agrocalidad en Ecuador."
      },
      "vacunas del mag o plan nacional antirrábico bovino": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "N/A",
        minAge: "N/A", frequency: { value: 1, unit: "años" },
        notes: "Distribución gratuita durante jornadas sanitarias en Ecuador."
      },
      "vacuna antirrábica bovina senasag / iifa": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "3 meses", frequency: { value: 1, unit: "años" },
        notes: "Usada en campañas oficiales en el oriente boliviano."
      },
      "rabiol bovino": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "intramuscular o subcutánea",
        minAge: "N/A", frequency: { value: 1, unit: "años" },
        notes: "Fabricada por Biofarma Paraguay, uso comercial limitado en Bolivia."
      },
      "cdvac rabia": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "intramuscular o subcutánea",
        minAge: "3 meses", frequency: { value: 1, unit: "años" },
        notes: "Para bovinos, ovinos, caprinos, porcinos, equinos. Si primera dosis antes de 6 meses, repetir a los 6 meses."
      },
      "providean rabia": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "intramuscular o subcutánea",
        minAge: "N/A", frequency: { value: 1, unit: "años" },
        notes: "Adyuvante Pilatus GHA500."
      },
      "vacuna biogénesis páresiante": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "intramuscular o subcutánea",
        minAge: "N/A", frequency: { value: 1, unit: "años" },
        notes: "Refuerzo a los 6 meses si fue primovacunación temprana."
      },
      "rabigán": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "3 meses", frequency: { value: 1, unit: "años" },
        notes: "Revacunar anualmente en zonas endémicas de Colombia."
      },
      "aftosa+rabia": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 1, unit: "años" },
        notes: "Vacuna combinada aftosa+rabia, aplicada anualmente en Colombia."
      },
      "rabicán": { // Aunque es para perros/gatos, se menciona su venta para bovinos en Colombia
        type: "vacuna", dosisPerAnimal: 1, unit: "mL", route: "N/A",
        minAge: "N/A", frequency: { value: 1, unit: "años" },
        notes: "Principalmente para perros/gatos, pero se vende en Colombia."
      },
      "nobivac rabia": {
        type: "vacuna", dosisPerAnimal: 1, unit: "mL", route: "intramuscular o subcutánea",
        minAge: "3-6 meses", frequency: { value: 1, unit: "años" },
        notes: "Para bovinos. En Chile/Costa Rica, revacunación cada 2 años para bovinos/caballos."
      },
      "derri a plus": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "N/A", // Asumiendo dosis estándar de 2mL para rabia bovina
        minAge: "N/A", frequency: { value: 1, unit: "años" },
        notes: "Vacuna para bovinos y otros rumiantes; estándar nacional en México."
      },
      "vacuna antirrábica inactivada para herbívoros": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "intramuscular o subcutánea",
        minAge: "3 meses", frequency: { value: 1, unit: "años" },
        notes: "Revacunar a los 30 días, luego anualmente en Brasil."
      },
      "rai-vet": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "N/A", // Asumiendo dosis estándar de 2mL
        minAge: "N/A", frequency: { value: 1, unit: "años" },
        notes: "Utilizada en herbívoros dentro de los programas nacionales de Brasil."
      },
      // Vacunas para Estomatitis
      "vacuna estomatitis": {
        type: "vacuna", dosisPerAnimal: 5, unit: "mL", route: "intramuscular o subcutánea",
        minAge: "3 meses", frequency: { value: 6, unit: "meses" },
        notes: "Marca Vecol S.A. Primovacunación a partir de 3 meses (junto a otras dosis según esquema nacional)."
      },
      "estomavac": {
        type: "vacuna", dosisPerAnimal: 3, unit: "mL", route: "intramuscular",
        minAge: "3 meses", frequency: { value: 6, unit: "meses" }, // Esquema: 3 meses, refuerzo 30 días, luego 8 meses, semestral en adultos
        notes: "Vacuna bivalente nacional contra estomatitis vesicular (Laboratorios CALA). Refuerzo a los 30 días, luego a los 8 meses, y revacunación semestral en adultos."
      },
      // Vacunas para Fiebre Aftosa
      "aftovac": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 6, unit: "meses" },
        notes: "Vacuna bivalente o trivalente contra la fiebre aftosa. Ampliamente usada en campañas de vacunación masiva."
      },
      "aftosa vecol": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 6, unit: "meses" },
        notes: "Vacuna de Vecol (Colombia) contra la fiebre aftosa. Parte de programas nacionales de control."
      },
      "aftogán": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 6, unit: "meses" },
        notes: "Vacuna contra la fiebre aftosa, común en varios países de Latinoamérica."
      },
      "aftosa bago": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 6, unit: "meses" },
        notes: "Vacuna de Biogénesis Bagó (Argentina) contra la fiebre aftosa. Alta eficacia y seguridad."
      },
      "aftosa senasa": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 6, unit: "meses" },
        notes: "Vacuna oficial utilizada en campañas de SENASA (Argentina) para el control de la fiebre aftosa."
      },
      "aftosa agrocalidad": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 6, unit: "meses" },
        notes: "Vacuna aprobada por Agrocalidad (Ecuador) para el control de la fiebre aftosa."
      },
      "aftosa bolivia": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 6, unit: "meses" },
        notes: "Vacuna utilizada en programas de control de fiebre aftosa en Bolivia."
      },
      "aftosa brasil": {
        type: "vacuna", dosisPerAnimal: 2, unit: "mL", route: "subcutánea",
        minAge: "N/A", frequency: { value: 6, unit: "meses" },
        notes: "Vacuna parte del programa nacional de erradicación de fiebre aftosa en Brasil."
      },
      // Desparasitantes (ejemplos existentes)
      "ivermectina 1%": {
        type: "desparasitante", dosisPerKg: 0.2, unit: "ml", route: "subcutáneo", frequency: { value: 3, unit: "meses" },
        notes: "No usar en animales en lactación cuya leche se destine a consumo humano."
      },
      "albendazol 10%": {
        type: "desparasitante", dosisPerKg: 0.5, unit: "ml", route: "oral", frequency: { value: 4, unit: "meses" },
        notes: "Amplio espectro contra parásitos gastrointestinales y pulmonares."
      },
      // Vitaminas (ejemplos existentes)
      "complejo b": {
        type: "vitamina", dosisPerKg: 0.1, unit: "ml", route: "intramuscular", frequency: { value: 2, unit: "meses" },
        notes: "Coadyuvante en casos de estrés, convalecencia o deficiencias nutricionales."
      },
      "vitamina ad3e": {
        type: "vitamina", dosisPerAnimal: 10, unit: "ml", route: "intramuscular", frequency: { value: 6, unit: "meses" },
        notes: "Esencial para el crecimiento, reproducción y salud ósea."
      },
    };

    // Buscar el producto en la base de datos simulada
    const foundProductKey = Object.keys(productDatabase).find(key => lowerCaseName.includes(key));

    if (foundProductKey) {
      const productInfo = productDatabase[foundProductKey];
      type = productInfo.type;
      frequency = productInfo.frequency;

      if (productInfo.dosisPerAnimal) {
        recommendedDosis = `${productInfo.dosisPerAnimal} ${productInfo.unit} ${productInfo.route}`;
        detailedRecommendation = `Dosis recomendada: ${productInfo.dosisPerAnimal} ${productInfo.unit} ${productInfo.route}. ${productInfo.notes}`;
      } else if (productInfo.dosisPerKg && animalWeight > 0) {
        const calculatedDosis = (animalWeight / 10) * productInfo.dosisPerKg;
        recommendedDosis = `${calculatedDosis.toFixed(1)} ${productInfo.unit} ${productInfo.route}`;
        detailedRecommendation = `Dosis calculada para ${animalWeight} kg: ${calculatedDosis.toFixed(1)} ${productInfo.unit} ${productInfo.route}. ${productInfo.notes}`;
      } else {
        detailedRecommendation = `No se pudo calcular la dosis exacta sin el peso del animal o si el producto no tiene dosis por kg. ${productInfo.notes}`;
      }
      // Añadir información de edad mínima si está disponible
      if (productInfo.minAge) {
        detailedRecommendation += ` Edad mínima para aplicación: ${productInfo.minAge}.`;
      }
    } else {
      detailedRecommendation = "Producto no encontrado en la base de datos de IA. Consultar etiqueta o veterinario.";
    }

    return { type, recommendedDosis, frequency, detailedRecommendation };
  }, [animals, dewormingFrequency, vitaminFrequency]);

  // Guardar datos en localStorage cada vez que cambian
  useEffect(() => { localStorage.setItem('dewormingFrequency', JSON.stringify(dewormingFrequency)); }, [dewormingFrequency]);
  useEffect(() => { localStorage.setItem('vitaminFrequency', JSON.stringify(vitaminFrequency)); }, [vitaminFrequency]);
  useEffect(() => { localStorage.setItem('stockThreshold', JSON.stringify(stockThreshold)); }, [stockThreshold]);

  // Manejadores de cambio para los formularios
  const handleTreatmentChange = (e) => {
    const { name, value } = e.target;
    setTreatmentData(prevTreatmentData => ({ ...prevTreatmentData, [name]: value }));
  };

  const handleVaccinationChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'manualDosis') {
      setVaccinationData(prevVaccinationData => ({ ...prevVaccinationData, manualDosis: checked }));
      if (!checked) { // Si desactiva manual, recalcular dosis IA
        const selectedProduct = inventoryItems.find(item => item.id === prevVaccinationData.productId);
        if (selectedProduct && prevVaccinationData.animalId) {
          setVaccinationData(prevVaccinationData => ({ ...prevVaccinationData, dosis: aiRecommendations(selectedProduct.name, prevVaccinationData.animalId).recommendedDosis }));
        }
      }
    } else {
      setVaccinationData(prevVaccinationData => {
        const updatedData = { ...prevVaccinationData, [name]: value };
        if ((name === 'productId' || name === 'animalId') && !updatedData.manualDosis) {
          const selectedProduct = inventoryItems.find(item => item.id === (name === 'productId' ? value : updatedData.productId));
          const currentAnimalId = name === 'animalId' ? value : updatedData.animalId;
          if (selectedProduct && currentAnimalId) {
            updatedData.dosis = aiRecommendations(selectedProduct.name, currentAnimalId).recommendedDosis;
          }
        }
        return updatedData;
      });
    }
  };

  const handleDewormingChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'manualDosis') {
      setDewormingData(prevDewormingData => ({ ...prevDewormingData, manualDosis: checked }));
      if (!checked) {
        const selectedProduct = inventoryItems.find(item => item.id === prevDewormingData.productId);
        if (selectedProduct && prevDewormingData.animalId) {
          setDewormingData(prevDewormingData => ({ ...prevDewormingData, dosis: aiRecommendations(selectedProduct.name, prevDewormingData.animalId).recommendedDosis }));
        }
      }
    } else {
      setDewormingData(prevDewormingData => {
        const updatedData = { ...prevDewormingData, [name]: value };
        if ((name === 'productId' || name === 'animalId') && !updatedData.manualDosis) {
          const selectedProduct = inventoryItems.find(item => item.id === (name === 'productId' ? value : updatedData.productId));
          const currentAnimalId = name === 'animalId' ? value : updatedData.animalId;
          if (selectedProduct && currentAnimalId) {
            updatedData.dosis = aiRecommendations(selectedProduct.name, currentAnimalId).recommendedDosis;
          }
        }
        return updatedData;
      });
    }
  };

  const handleVitaminChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'manualDosis') {
      setVitaminData(prevVitaminData => ({ ...prevVitaminData, manualDosis: checked }));
      if (!checked) {
        const selectedProduct = inventoryItems.find(item => item.id === prevVitaminData.productId);
        if (selectedProduct && prevVitaminData.animalId) {
          setVitaminData(prevVitaminData => ({ ...prevVitaminData, dosis: aiRecommendations(selectedProduct.name, prevVitaminData.animalId).recommendedDosis }));
        }
      }
    } else {
      setVitaminData(prevVitaminData => {
        const updatedData = { ...prevVitaminData, [name]: value };
        if ((name === 'productId' || name === 'animalId') && !updatedData.manualDosis) {
          const selectedProduct = inventoryItems.find(item => item.id === (name === 'productId' ? value : updatedData.productId));
          const currentAnimalId = name === 'animalId' ? value : updatedData.animalId;
          if (selectedProduct && currentAnimalId) {
            updatedData.dosis = aiRecommendations(selectedProduct.name, currentAnimalId).recommendedDosis;
          }
        }
        return updatedData;
      });
    }
  };

  const handleDiseaseChange = (e) => {
    const { name, value } = e.target;
    setDiseaseData(prev => ({ ...prev, [name]: value }));
  };

  // Función para calcular la próxima fecha de aplicación
  const calculateNextDate = (currentDate, frequency) => {
    const date = new Date(currentDate);
    if (!frequency || !frequency.value || !frequency.unit) return null;

    switch (frequency.unit) {
      case 'dias': date.setDate(date.getDate() + frequency.value); break;
      case 'semanas': date.setDate(date.getDate() + (frequency.value * 7)); break;
      case 'meses': date.setMonth(date.getMonth() + frequency.value); break;
      case 'años': date.setFullYear(date.getFullYear() + frequency.value); break;
      default: return null;
    }
    return date.toISOString().split('T')[0];
  };

  // Manejadores para añadir registros
  const handleAddTreatment = (e) => {
    e.preventDefault();
    const newTreatment = { ...treatmentData, id: Date.now(), type: 'general' };
    setTreatmentsHistory(prev => [...prev, newTreatment]);
    // Extraer solo el número de la dosis para descontar del inventario
    const dosisValue = parseFloat(newTreatment.dosis.split(' ')[0]) || 0;
    onUpdateInventoryQuantity(newTreatment.productId, dosisValue);
    setTreatmentData({ animalId: '', productId: '', dosis: '', fechaAplicacion: '', observaciones: '', manualDosis: true });
  };

  const handleAddVaccination = (e) => {
    e.preventDefault();
    const newVaccination = { ...vaccinationData, id: Date.now(), type: 'vacunacion' };
    setTreatmentsHistory(prev => [...prev, newVaccination]);
    const dosisValue = parseFloat(newVaccination.dosis.split(' ')[0]) || 0;
    onUpdateInventoryQuantity(newVaccination.productId, dosisValue);

    const selectedProduct = inventoryItems.find(item => item.id === newVaccination.productId);
    const { frequency } = aiRecommendations(selectedProduct.name, newVaccination.animalId);
    const nextApplicationDate = calculateNextDate(newVaccination.fechaAplicacion, frequency);

    if (nextApplicationDate) {
      setVaccinationSchedule(prev => [...prev, {
        animalId: newVaccination.animalId,
        productName: selectedProduct.name,
        lastApplication: newVaccination.fechaAplicacion,
        nextApplication: nextApplicationDate,
        id: Date.now() + 1,
      }]);
    }
    setVaccinationData({ animalId: '', productId: '', dosis: '', fechaAplicacion: '', observaciones: '', manualDosis: false });
  };

  const handleAddDeworming = (e) => {
    e.preventDefault();
    const newDeworming = { ...dewormingData, id: Date.now(), type: 'desparasitacion' };
    setTreatmentsHistory(prev => [...prev, newDeworming]);
    const dosisValue = parseFloat(newDeworming.dosis.split(' ')[0]) || 0;
    onUpdateInventoryQuantity(newDeworming.productId, dosisValue);

    const selectedProduct = inventoryItems.find(item => item.id === newDeworming.productId);
    const { frequency } = aiRecommendations(selectedProduct.name, newDeworming.animalId);
    const nextApplicationDate = calculateNextDate(newDeworming.fechaAplicacion, frequency);

    if (nextApplicationDate) {
      setDewormingSchedule(prev => [...prev, {
        animalId: newDeworming.animalId,
        productName: selectedProduct.name,
        lastApplication: newDeworming.fechaAplicacion,
        nextApplication: nextApplicationDate,
        id: Date.now() + 2,
      }]);
    }
    setDewormingData({ animalId: '', productId: '', dosis: '', fechaAplicacion: '', observaciones: '', manualDosis: false });
  };

  const handleAddVitamin = (e) => {
    e.preventDefault();
    const newVitamin = { ...vitaminData, id: Date.now(), type: 'vitaminas' };
    setTreatmentsHistory(prev => [...prev, newVitamin]);
    const dosisValue = parseFloat(newVitamin.dosis.split(' ')[0]) || 0;
    onUpdateInventoryQuantity(newVitamin.productId, dosisValue);

    const selectedProduct = inventoryItems.find(item => item.id === newVitamin.productId);
    const { frequency } = aiRecommendations(selectedProduct.name, newVitamin.animalId);
    const nextApplicationDate = calculateNextDate(newVitamin.fechaAplicacion, frequency);

    if (nextApplicationDate) {
      setVitaminSchedule(prev => [...prev, {
        animalId: newVitamin.animalId,
        productName: selectedProduct.name,
        lastApplication: newVitamin.fechaAplicacion,
        nextApplication: nextApplicationDate,
        id: Date.now() + 3,
      }]);
    }
    setVitaminData({ animalId: '', productId: '', dosis: '', fechaAplicacion: '', observaciones: '', manualDosis: false });
  };

  const handleAddDisease = (e) => {
    e.preventDefault();
    const newDisease = { ...diseaseData, id: Date.now() };
    setDiseasesHistory(prev => [...prev, newDisease]);
    setDiseaseData({
      animalId: '', diseaseName: '', symptoms: '', diagnosisDate: '',
      treatmentProductId: '', treatmentDosis: '', treatmentStartDate: '',
      treatmentEndDate: '', recoveryDate: '', diseaseObservations: '',
    });
  };

  // Manejadores para eliminar registros
  const handleDeleteTreatment = (id) => {
    setTreatmentsHistory(prev => prev.filter(t => t.id !== id));
    setVaccinationSchedule(prev => prev.filter(v => v.id !== id));
    setDewormingSchedule(prev => prev.filter(d => d.id !== id));
    setVitaminSchedule(prev => prev.filter(v => v.id !== id));
  };

  const handleDeleteDisease = (id) => {
    setDiseasesHistory(prev => prev.filter(d => d.id !== id));
  };

  // Funciones auxiliares para obtener nombres
  const getAnimalName = (animalId) => {
    const animal = animals.find(a => a.id === animalId);
    return animal ? animal.name : 'Desconocido';
  };

  const getProductName = (productId) => {
    const product = inventoryItems.find(item => item.id === productId);
    return product ? product.name : 'Desconocido';
  };

  // Estado y manejadores para la búsqueda de animales
  const [animalSearchTerm, setAnimalSearchTerm] = useState('');
  const [filteredAnimals, setFilteredAnimals] = useState(animals);

  useEffect(() => {
    setFilteredAnimals(
      animals.filter(animal =>
        animal.name.toLowerCase().includes(animalSearchTerm.toLowerCase()) ||
        animal.id.toLowerCase().includes(animalSearchTerm.toLowerCase())
      )
    );
  }, [animalSearchTerm, animals]);

  const handleAnimalSearchChange = (e) => {
    setAnimalSearchTerm(e.target.value);
  };

  const handleSelectAnimal = (animalId, formType) => {
    const selectedAnimal = animals.find(animal => animal.id === animalId);
    if (!selectedAnimal) return;

    const updateForm = (setter, currentData) => {
      setter(prev => {
        const newData = { ...prev, animalId: animalId };
        // Solo para formularios que no sean 'general' se recalcula la dosis IA
        if (formType !== 'general') {
          const selectedProduct = inventoryItems.find(item => item.id === currentData.productId);
          if (selectedProduct && !currentData.manualDosis) {
            newData.dosis = aiRecommendations(selectedProduct.name, animalId).recommendedDosis;
          }
        }
        return newData;
      });
    };

    switch (formType) {
      case 'general':
        updateForm(setTreatmentData, treatmentData);
        break;
      case 'vaccination':
        updateForm(setVaccinationData, vaccinationData);
        break;
      case 'deworming':
        updateForm(setDewormingData, dewormingData);
        break;
      case 'vitamin':
        updateForm(setVitaminData, vitaminData);
        break;
      case 'disease':
        setDiseaseData(prev => ({ ...prev, animalId: animalId }));
        break;
      default:
        break;
    }
    setAnimalSearchTerm(''); // Limpiar búsqueda después de seleccionar
  };

  // Componente Acordeón reutilizable
  const Accordion = ({ title, children, isOpen, toggleOpen }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
      <button
        className="w-full flex justify-between items-center text-left text-2xl font-semibold text-gray-700 focus:outline-none"
        onClick={toggleOpen}
      >
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="mt-4 border-t pt-4">{children}</div>}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Control Sanitario</h1>

      {/* Sección de Registro de Tratamiento General */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Registrar Tratamiento General</h2>
        <form onSubmit={handleAddTreatment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="animalSearchGeneral" className="block text-sm font-medium text-gray-700 mb-1">Buscar Animal (ID o Nombre)</label>
            <input
              type="text"
              id="animalSearchGeneral"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Escribe ID o nombre del animal"
              value={animalSearchTerm}
              onChange={handleAnimalSearchChange}
            />
            {animalSearchTerm && filteredAnimals.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                {filteredAnimals.map(animal => (
                  <li
                    key={animal.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectAnimal(animal.id, 'general')}
                  >
                    {animal.name} ({animal.id})
                  </li>
                ))}
              </ul>
            )}
            <label htmlFor="animalIdGeneral" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Animal Seleccionado</label>
            <select
              id="animalIdGeneral"
              name="animalId"
              value={treatmentData.animalId}
              onChange={handleTreatmentChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            >
              <option value="">Selecciona un animal</option>
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select
              id="productId"
              name="productId"
              value={treatmentData.productId}
              onChange={handleTreatmentChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            >
              <option value="">Selecciona un producto</option>
              {inventoryItems.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dosis" className="block text-sm font-medium text-gray-700 mb-1">Dosis</label>
            <input
              type="text"
              id="dosis"
              name="dosis"
              value={treatmentData.dosis}
              onChange={handleTreatmentChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition`}
              // La dosis siempre es manual para el tratamiento general, por lo que no hay readOnly condicional
            />
            {/* Se elimina el checkbox de "Dosis Manual" y el texto de recomendación de IA para el tratamiento general */}
          </div>
          <div>
            <label htmlFor="fechaAplicacion" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Aplicación</label>
            <input
              type="date"
              id="fechaAplicacion"
              name="fechaAplicacion"
              value={treatmentData.fechaAplicacion}
              onChange={handleTreatmentChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={treatmentData.observaciones}
              onChange={handleTreatmentChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Registrar Tratamiento General
            </button>
          </div>
        </form>
      </div>

      {/* Secciones de Registros Específicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Registro de Vacunación */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Registrar Vacunación</h2>
          <form onSubmit={handleAddVaccination} className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="animalSearchVaccine" className="block text-sm font-medium text-gray-700 mb-1">Buscar Animal (ID o Nombre)</label>
              <input
                type="text"
                id="animalSearchVaccine"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Escribe ID o nombre del animal"
                value={animalSearchTerm}
                onChange={handleAnimalSearchChange}
              />
              {animalSearchTerm && filteredAnimals.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredAnimals.map(animal => (
                    <li
                      key={animal.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectAnimal(animal.id, 'vaccination')}
                    >
                      {animal.name} ({animal.id})
                    </li>
                  ))}
                </ul>
              )}
              <label htmlFor="vaccineAnimalId" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Animal Seleccionado</label>
              <select
                id="vaccineAnimalId"
                name="animalId"
                value={vaccinationData.animalId}
                onChange={handleVaccinationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              >
                <option value="">Selecciona un animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vaccineProductId" className="block text-sm font-medium text-gray-700 mb-1">Vacuna</label>
              <select
                id="vaccineProductId"
                name="productId"
                value={vaccinationData.productId}
                onChange={handleVaccinationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              >
                <option value="">Selecciona una vacuna</option>
                {inventoryItems.filter(item => item.category === 'vacunas').map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vaccineDosis" className="block text-sm font-medium text-gray-700 mb-1">Dosis</label>
              <input
                type="text"
                id="vaccineDosis"
                name="dosis"
                value={vaccinationData.dosis}
                onChange={handleVaccinationChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition ${vaccinationData.manualDosis ? '' : 'bg-gray-50'}`}
                readOnly={!vaccinationData.manualDosis}
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="manualDosisVaccine"
                  name="manualDosis"
                  checked={vaccinationData.manualDosis}
                  onChange={handleVaccinationChange}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="manualDosisVaccine" className="ml-2 text-sm text-gray-700">Dosis Manual</label>
              </div>
              {!vaccinationData.manualDosis && vaccinationData.productId && vaccinationData.animalId && (
                <p className="text-xs text-gray-600 mt-1">
                  {aiRecommendations(inventoryItems.find(item => item.id === vaccinationData.productId)?.name || '', vaccinationData.animalId).detailedRecommendation}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="vaccineFechaAplicacion" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Aplicación</label>
              <input
                type="date"
                id="vaccineFechaAplicacion"
                name="fechaAplicacion"
                value={vaccinationData.fechaAplicacion}
                onChange={handleVaccinationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
            <div>
              <label htmlFor="vaccineObservaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                id="vaccineObservaciones"
                name="observaciones"
                value={vaccinationData.observaciones}
                onChange={handleVaccinationChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Registrar Vacunación
            </button>
          </form>
        </div>

        {/* Registro de Desparasitación */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Registrar Desparasitación</h2>
          <form onSubmit={handleAddDeworming} className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="animalSearchDeworming" className="block text-sm font-medium text-gray-700 mb-1">Buscar Animal (ID o Nombre)</label>
              <input
                type="text"
                id="animalSearchDeworming"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Escribe ID o nombre del animal"
                value={animalSearchTerm}
                onChange={handleAnimalSearchChange}
              />
              {animalSearchTerm && filteredAnimals.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredAnimals.map(animal => (
                    <li
                      key={animal.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectAnimal(animal.id, 'deworming')}
                    >
                      {animal.name} ({animal.id})
                    </li>
                  ))}
                </ul>
              )}
              <label htmlFor="dewormingAnimalId" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Animal Seleccionado</label>
              <select
                id="dewormingAnimalId"
                name="animalId"
                value={dewormingData.animalId}
                onChange={handleDewormingChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              >
                <option value="">Selecciona un animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dewormingProductId" className="block text-sm font-medium text-gray-700 mb-1">Desparasitante</label>
              <select
                id="dewormingProductId"
                name="productId"
                value={dewormingData.productId}
                onChange={handleDewormingChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              >
                <option value="">Selecciona un desparasitante</option>
                {inventoryItems.filter(item => item.category === 'desparasitantes').map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dewormingDosis" className="block text-sm font-medium text-gray-700 mb-1">Dosis</label>
              <input
                type="text"
                id="dewormingDosis"
                name="dosis"
                value={dewormingData.dosis}
                onChange={handleDewormingChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition ${dewormingData.manualDosis ? '' : 'bg-gray-50'}`}
                readOnly={!dewormingData.manualDosis}
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="manualDosisDeworming"
                  name="manualDosis"
                  checked={dewormingData.manualDosis}
                  onChange={handleDewormingChange}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="manualDosisDeworming" className="ml-2 text-sm text-gray-700">Dosis Manual</label>
              </div>
              {!dewormingData.manualDosis && dewormingData.productId && dewormingData.animalId && (
                <p className="text-xs text-gray-600 mt-1">
                  {aiRecommendations(inventoryItems.find(item => item.id === dewormingData.productId)?.name || '', dewormingData.animalId).detailedRecommendation}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="dewormingFechaAplicacion" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Aplicación</label>
              <input
                type="date"
                id="dewormingFechaAplicacion"
                name="fechaAplicacion"
                value={dewormingData.fechaAplicacion}
                onChange={handleDewormingChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
            <div>
              <label htmlFor="dewormingObservaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                id="dewormingObservaciones"
                name="observaciones"
                value={dewormingData.observaciones}
                onChange={handleDewormingChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Registrar Desparasitación
            </button>
          </form>
        </div>

        {/* Registro de Vitaminas */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Registrar Vitaminas</h2>
          <form onSubmit={handleAddVitamin} className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="animalSearchVitamin" className="block text-sm font-medium text-gray-700 mb-1">Buscar Animal (ID o Nombre)</label>
              <input
                type="text"
                id="animalSearchVitamin"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Escribe ID o nombre del animal"
                value={animalSearchTerm}
                onChange={handleAnimalSearchChange}
              />
              {animalSearchTerm && filteredAnimals.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredAnimals.map(animal => (
                    <li
                      key={animal.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectAnimal(animal.id, 'vitamin')}
                    >
                      {animal.name} ({animal.id})
                    </li>
                  ))}
                </ul>
              )}
              <label htmlFor="vitaminAnimalId" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Animal Seleccionado</label>
              <select
                id="vitaminAnimalId"
                name="animalId"
                value={vitaminData.animalId}
                onChange={handleVitaminChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              >
                <option value="">Selecciona un animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vitaminProductId" className="block text-sm font-medium text-gray-700 mb-1">Vitamina</label>
              <select
                id="vitaminProductId"
                name="productId"
                value={vitaminData.productId}
                onChange={handleVitaminChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              >
                <option value="">Selecciona una vitamina</option>
                {inventoryItems.filter(item => item.category === 'vitaminas').map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vitaminDosis" className="block text-sm font-medium text-gray-700 mb-1">Dosis</label>
              <input
                type="text"
                id="vitaminDosis"
                name="dosis"
                value={vitaminData.dosis}
                onChange={handleVitaminChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition ${vitaminData.manualDosis ? '' : 'bg-gray-50'}`}
                readOnly={!vitaminData.manualDosis}
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="manualDosisVitamin"
                  name="manualDosis"
                  checked={vitaminData.manualDosis}
                  onChange={handleVitaminChange}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="manualDosisVitamin" className="ml-2 text-sm text-gray-700">Dosis Manual</label>
              </div>
              {!vitaminData.manualDosis && vitaminData.productId && vitaminData.animalId && (
                <p className="text-xs text-gray-600 mt-1">
                  {aiRecommendations(inventoryItems.find(item => item.id === vitaminData.productId)?.name || '', vitaminData.animalId).detailedRecommendation}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="vitaminFechaAplicacion" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Aplicación</label>
              <input
                type="date"
                id="vitaminFechaAplicacion"
                name="fechaAplicacion"
                value={vitaminData.fechaAplicacion}
                onChange={handleVitaminChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
            <div>
              <label htmlFor="vitaminObservaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea
                id="vitaminObservaciones"
                name="observaciones"
                value={vitaminData.observaciones}
                onChange={handleVitaminChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Registrar Vitaminas
            </button>
          </form>
        </div>
      </div>

      {/* Sección de Historial de Tratamientos */}
      <Accordion
        title="Historial de Tratamientos"
        isOpen={showTreatmentsHistory}
        toggleOpen={() => setShowTreatmentsHistory(!showTreatmentsHistory)}
      >
        {treatmentsHistory.length === 0 ? (
          <p className="text-gray-500 text-center">No hay tratamientos registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {treatmentsHistory.map(treatment => (
                  <tr key={treatment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAnimalName(treatment.animalId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getProductName(treatment.productId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{treatment.dosis}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{treatment.fechaAplicacion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{treatment.type || 'General'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{treatment.observaciones}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteTreatment(treatment.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Accordion>

      {/* Sección de Registro de Enfermedad */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Registrar Enfermedad</h2>
        <form onSubmit={handleAddDisease} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="animalSearchDisease" className="block text-sm font-medium text-gray-700 mb-1">Buscar Animal (ID o Nombre)</label>
            <input
              type="text"
              id="animalSearchDisease"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Escribe ID o nombre del animal"
              value={animalSearchTerm}
              onChange={handleAnimalSearchChange}
            />
            {animalSearchTerm && filteredAnimals.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                {filteredAnimals.map(animal => (
                  <li
                    key={animal.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectAnimal(animal.id, 'disease')}
                  >
                    {animal.name} ({animal.id})
                  </li>
                ))}
              </ul>
            )}
            <label htmlFor="diseaseAnimalId" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Animal Seleccionado</label>
            <select
              id="diseaseAnimalId"
              name="animalId"
              value={diseaseData.animalId}
              onChange={handleDiseaseChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            >
              <option value="">Selecciona un animal</option>
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="diseaseName" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Enfermedad</label>
            <input
              type="text"
              id="diseaseName"
              name="diseaseName"
              value={diseaseData.diseaseName}
              onChange={handleDiseaseChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">Síntomas</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={diseaseData.symptoms}
              onChange={handleDiseaseChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
            ></textarea>
          </div>
          <div>
            <label htmlFor="diagnosisDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Diagnóstico</label>
            <input
              type="date"
              id="diagnosisDate"
              name="diagnosisDate"
              value={diseaseData.diagnosisDate}
              onChange={handleDiseaseChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>
          <div>
            <label htmlFor="treatmentProductId" className="block text-sm font-medium text-gray-700 mb-1">Medicamento para Tratamiento</label>
            <select
              id="treatmentProductId"
              name="treatmentProductId"
              value={diseaseData.treatmentProductId}
              onChange={handleDiseaseChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            >
              <option value="">Selecciona un producto</option>
              {inventoryItems.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="treatmentDosis" className="block text-sm font-medium text-gray-700 mb-1">Dosis del Tratamiento</label>
            <input
              type="text"
              id="treatmentDosis"
              name="treatmentDosis"
              value={diseaseData.treatmentDosis}
              onChange={handleDiseaseChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>
          <div>
            <label htmlFor="treatmentStartDate" className="block text-sm font-medium text-gray-700 mb-1">Inicio Tratamiento</label>
            <input
              type="date"
              id="treatmentStartDate"
              name="treatmentStartDate"
              value={diseaseData.treatmentStartDate}
              onChange={handleDiseaseChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>
          <div>
            <label htmlFor="treatmentEndDate" className="block text-sm font-medium text-gray-700 mb-1">Fin Tratamiento</label>
            <input
              type="date"
              id="treatmentEndDate"
              name="treatmentEndDate"
              value={diseaseData.treatmentEndDate}
              onChange={handleDiseaseChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>
          <div>
            <label htmlFor="recoveryDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Recuperación</label>
            <input
              type="date"
              id="recoveryDate"
              name="recoveryDate"
              value={diseaseData.recoveryDate}
              onChange={handleDiseaseChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="diseaseObservations" className="block text-sm font-medium text-gray-700 mb-1">Observaciones de la Enfermedad</label>
            <textarea
              id="diseaseObservations"
              name="diseaseObservations"
              value={diseaseData.diseaseObservations}
              onChange={handleDiseaseChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Registrar Enfermedad
            </button>
          </div>
        </form>
      </div>

      {/* Sección de Historial de Enfermedades */}
      <Accordion
        title="Historial de Enfermedades"
        isOpen={showDiseasesHistory}
        toggleOpen={() => setShowDiseasesHistory(!showDiseasesHistory)}
      >
        {diseasesHistory.length === 0 ? (
          <p className="text-gray-500 text-center">No hay enfermedades registradas aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enfermedad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recuperación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {diseasesHistory.map(disease => (
                  <tr key={disease.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAnimalName(disease.animalId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{disease.diseaseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{disease.diagnosisDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{disease.recoveryDate || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteDisease(disease.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Accordion>

      {/* Secciones de Calendarios */}
      <Accordion
        title="Calendario de Vacunación"
        isOpen={showVaccinationSchedule}
        toggleOpen={() => setShowVaccinationSchedule(!showVaccinationSchedule)}
      >
        {vaccinationSchedule.length === 0 ? (
          <p className="text-gray-500 text-center">No hay vacunas programadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacuna</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vaccinationSchedule.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAnimalName(item.animalId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nextApplication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Accordion>

      <Accordion
        title="Calendario de Desparasitación"
        isOpen={showDewormingSchedule}
        toggleOpen={() => setShowDewormingSchedule(!showDewormingSchedule)}
      >
        {dewormingSchedule.length === 0 ? (
          <p className="text-gray-500 text-center">No hay desparasitaciones programadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dewormingSchedule.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAnimalName(item.animalId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nextApplication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Accordion>

      <Accordion
        title="Calendario de Vitaminas"
        isOpen={showVitaminSchedule}
        toggleOpen={() => setShowVitaminSchedule(!showVitaminSchedule)}
      >
        {vitaminSchedule.length === 0 ? (
          <p className="text-gray-500 text-center">No hay vitaminas programadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vitaminSchedule.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAnimalName(item.animalId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nextApplication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Accordion>
    </div>
  );
};

export default SanitaryControlPage;