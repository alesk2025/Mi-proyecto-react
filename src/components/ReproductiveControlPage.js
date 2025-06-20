import React, { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReproductiveControlPage = ({ animals, onUpdateAnimalProduction, onRegisterAnimal, onRegisterReproductiveEvent, onDeletePregnantCow, reproductiveRecords, setReproductiveRecords, currentUser, logoUrl, calvingSchedule, setCalvingSchedule, naturalMatingHistory, setNaturalMatingHistory }) => {
  const [reproductiveData, setReproductiveData] = useState({
    animalId: '',
    eventType: '', // 'diagnostico_prenez', 'parto', 'inseminacion', 'celo', 'monta_natural'
    eventDate: '',
    details: '',
    semenId: '', // Para inseminacion
    semenProvider: '', // Para inseminacion
    machoId: '', // Para monta_natural
    calfId: '', // Para parto
    calfSex: '', // Para parto
    calfWeight: '', // Para parto
    calfObservations: '', // Para parto
    diagnosisResult: '', // 'preñada', 'vacia'
    expectedCalvingDate: '', // Para diagnostico_prenez (fecha confirmada por veterinario)
  });

  const [filterAnimalId, setFilterAnimalId] = useState('');
  const [filterEventType, setFilterEventType] = useState('');

  // Estado para las notificaciones de partos próximos
  const [upcomingCalvingNotifications, setUpcomingCalvingNotifications] = useState([]);

  // Estado para el modal de registro de ternero
  const [showCalfModal, setShowCalfModal] = useState(false);
  const [currentCalvingAnimal, setCurrentCalvingAnimal] = useState(null);
  const [calfData, setCalfData] = useState({
    calfId: '',
    calfSex: '',
    calfWeight: '',
    calfObservations: '',
  });

  // Efecto para generar notificaciones de partos próximos
  useEffect(() => {
    const today = new Date();
    const notifications = [];
    calvingSchedule.forEach(item => {
      const calvingDate = new Date(item.expectedCalvingDate);
      const daysRemaining = Math.ceil((calvingDate - today) / (1000 * 60 * 60 * 24));

      // Notificar si faltan 30 días o menos, o si ya está vencido
      if (daysRemaining <= 30 && daysRemaining >= 0) {
        notifications.push({
          id: item.id,
          animalId: item.animalId,
          message: `¡Atención! El parto de ${getAnimalName(item.animalId)} (${item.animalId}) está programado para el ${item.expectedCalvingDate}. Faltan ${daysRemaining} días.`,
          type: 'warning',
        });
      } else if (daysRemaining < 0) {
        notifications.push({
          id: item.id,
          animalId: item.animalId,
          message: `¡Alerta! El parto de ${getAnimalName(item.animalId)} (${item.animalId}) estaba programado para el ${item.expectedCalvingDate} y está VENCIDO por ${Math.abs(daysRemaining)} días.`,
          type: 'danger',
        });
      }
    });
    setUpcomingCalvingNotifications(notifications);
  }, [calvingSchedule, animals]); // Dependencia de animals para getAnimalName

  // Función para calcular la fecha probable de parto (283 días después de la inseminación/diagnóstico)
  // Esta función ahora es más una guía, la fecha final la da el veterinario en el diagnóstico
  const calculateEstimatedCalvingDate = (eventDate) => {
    if (!eventDate) return '';
    const date = new Date(eventDate);
    date.setDate(date.getDate() + 283); // Gestación promedio de bovinos
    return date.toISOString().split('T')[0];
  };

  // Manejador de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReproductiveData(prev => {
      const newData = { ...prev, [name]: value };
      // Si el evento es diagnóstico de preñez y se ingresa la fecha probable de parto, usar esa
      if (name === 'expectedCalvingDate' && newData.eventType === 'diagnostico_prenez' && newData.diagnosisResult === 'preñada') {
        // No recalcular, usar el valor ingresado por el usuario
      } else if (name === 'eventDate' && (newData.eventType === 'inseminacion' || newData.eventType === 'monta_natural')) {
        // Estimar fecha de parto para inseminación o monta natural
        newData.expectedCalvingDate = calculateEstimatedCalvingDate(value);
      }
      return newData;
    });
  };

  // Manejador para el envío del formulario
  const handleSubmit = async () => {
    const { animalId, eventType, eventDate, diagnosisResult, expectedCalvingDate, calfId, calfSex, calfWeight, calfObservations } = reproductiveData;

    if (!animalId || !eventType || !eventDate) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    const newRecord = {
      id: `REP-${Date.now().toString().slice(-5)}`,
      animalId,
      eventType,
      eventDate,
      details: reproductiveData.details,
      semenId: reproductiveData.semenId,
      semenProvider: reproductiveData.semenProvider,
      machoId: reproductiveData.machoId,
      diagnosisResult: reproductiveData.diagnosisResult,
      expectedCalvingDate: reproductiveData.expectedCalvingDate,
      calfId: reproductiveData.calfId,
      calfSex: reproductiveData.calfSex,
      calfWeight: reproductiveData.calfWeight,
      calfObservations: reproductiveData.calfObservations,
    };

    onRegisterReproductiveEvent(newRecord);
    alert(`Evento reproductivo de ${eventType} registrado para ${animalId}.`);

    // Lógica específica para cada tipo de evento
    if (eventType === 'diagnostico_prenez' && diagnosisResult === 'preñada') {
      // Actualizar estado reproductivo del animal a 'preñada'
      // Calcular días restantes para determinar si entra en seca
      const today = new Date();
      const calvingDate = new Date(expectedCalvingDate);
      const daysRemaining = Math.ceil((calvingDate - today) / (1000 * 60 * 60 * 24));

      let newReproductiveState = 'preñada';
      if (daysRemaining <= 100) { // Si quedan 100 días o menos, entra en seca
        newReproductiveState = 'seca';
      }
      
      onUpdateAnimalProduction(animalId, { estadoReproductivo: newReproductiveState, fechaUltimaGestacion: eventDate });
      
      // Añadir al calendario de partos
      // Asegurarse de que no se dupliquen entradas para el mismo animal si ya está preñada
      setCalvingSchedule(prev => {
        const existingIndex = prev.findIndex(item => item.animalId === animalId);
        if (existingIndex > -1) {
          // Si ya existe, actualizar la entrada
          const updatedSchedule = [...prev];
          updatedSchedule[existingIndex] = {
            animalId,
            diagnosisDate: eventDate,
            expectedCalvingDate,
            id: newRecord.id,
          };
          return updatedSchedule;
        } else {
          // Si no existe, añadir nueva entrada
          return [...prev, {
            animalId,
            diagnosisDate: eventDate,
            expectedCalvingDate,
            id: newRecord.id,
          }];
        }
      });
      alert(`Animal ${animalId} marcado como ${newReproductiveState}. Fecha probable de parto: ${expectedCalvingDate}`);
    } else if (eventType === 'parto') {
      // Actualizar estado reproductivo del animal a 'en_produccion'
      onUpdateAnimalProduction(animalId, { estadoReproductivo: 'en_produccion', fechaUltimaGestacion: eventDate });
      // Eliminar del calendario de partos
      setCalvingSchedule(prev => prev.filter(item => item.animalId !== animalId));
      alert(`Parto registrado para ${animalId}. Animal ahora en producción.`);

      // Registrar ternero si se proporciona ID
      if (calfId && calfSex && calfWeight) {
        const newCalf = {
          id: calfId,
          name: `Ternero de ${animalId}`,
          raza: animals.find(a => a.id === animalId)?.raza || 'Desconocida',
          peso: calfWeight,
          sexo: calfSex,
          fechaNacimiento: eventDate,
          fechaCompra: eventDate, // Se considera fecha de "compra" como nacimiento
          tipoProduccion: 'carne', // Por defecto para terneros
          dailyMilk: 0,
          idpadre: animals.find(a => a.id === animalId)?.idpadre || '', // Asumiendo que la madre es la que parió
          idmadre: animalId,
          estadoReproductivo: 'desarrollo',
        };
        onRegisterAnimal(newCalf);
        alert(`Ternero ${calfId} registrado.`);
      }
    } else if (eventType === 'inseminacion') {
      onUpdateAnimalProduction(animalId, { estadoReproductivo: 'inseminada', fechaUltimaInseminacion: eventDate });
    } else if (eventType === 'monta_natural') {
      // Al registrar monta natural, la vaca pasa a estado 'celo' por 48 horas, luego a 'desarrollo'
      onUpdateAnimalProduction(animalId, { estadoReproductivo: 'en_celo', fechaUltimaMonta: eventDate });
      setNaturalMatingHistory(prev => [...prev, {
        id: newRecord.id,
        animalId: newRecord.animalId,
        machoId: newRecord.machoId,
        eventDate: newRecord.eventDate,
        details: newRecord.details,
      }]);

      // Programar el cambio de estado a 'desarrollo' después de 48 horas
      setTimeout(() => {
        onUpdateAnimalProduction(animalId, { estadoReproductivo: 'desarrollo' });
        alert(`Animal ${getAnimalName(animalId)} (${animalId}) ha cambiado de estado 'en_celo' a 'desarrollo' después de 48 horas.`);
      }, 48 * 60 * 60 * 1000); // 48 horas en milisegundos

    } else if (eventType === 'celo') {
      onUpdateAnimalProduction(animalId, { estadoReproductivo: 'en_celo', fechaUltimoCelo: eventDate });
    }

    // Limpiar formulario
    setReproductiveData({
      animalId: '', eventType: '', eventDate: '', details: '', semenId: '', semenProvider: '', machoId: '',
      calfId: '', calfSex: '', calfWeight: '', calfObservations: '', diagnosisResult: '', expectedCalvingDate: '',
    });
  };

  // Manejador para abrir el modal de registro de ternero
  const handleMarkCalving = (animalId) => {
    setCurrentCalvingAnimal(animalId);
    setShowCalfModal(true);
    // Limpiar datos del ternero para el nuevo registro
    setCalfData({
      calfId: '',
      calfSex: '',
      calfWeight: '',
      calfObservations: '',
    });
  };

  // Manejador para el cambio de datos del ternero en el modal
  const handleCalfDataChange = (e) => {
    const { name, value } = e.target;
    setCalfData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para el envío del formulario del ternero
  const handleCalfSubmit = () => {
    const { calfId, calfSex, calfWeight, calfObservations } = calfData;
    const animalId = currentCalvingAnimal;
    const eventDate = new Date().toISOString().split('T')[0]; // Fecha actual del parto

    if (!animalId || !calfId || !calfSex || !calfWeight) {
      alert('Por favor, completa todos los campos del ternero.');
      return;
    }

    // Registrar el evento de parto en el historial reproductivo
    const newPartoRecord = {
      id: `REP-${Date.now().toString().slice(-5)}`,
      animalId,
      eventType: 'parto',
      eventDate,
      details: `Parto registrado. Ternero ID: ${calfId}, Sexo: ${calfSex}, Peso: ${calfWeight} kg.`,
      calfId,
      calfSex,
      calfWeight,
      calfObservations,
    };
    onRegisterReproductiveEvent(newPartoRecord);

    // Actualizar estado reproductivo del animal a 'en_produccion'
    onUpdateAnimalProduction(animalId, { estadoReproductivo: 'en_produccion', fechaUltimaGestacion: eventDate });
    // Eliminar del calendario de partos
    setCalvingSchedule(prev => prev.filter(item => item.animalId !== animalId));
    alert(`Parto registrado para ${animalId}. Animal ahora en producción.`);

    // Registrar ternero
    const newCalf = {
      id: calfId,
      name: `Ternero de ${getAnimalName(animalId)}`,
      raza: animals.find(a => a.id === animalId)?.raza || 'Desconocida',
      peso: calfWeight,
      sexo: calfSex,
      fechaNacimiento: eventDate,
      fechaCompra: eventDate, // Se considera fecha de "compra" como nacimiento
      tipoProduccion: 'carne', // Por defecto para terneros
      dailyMilk: 0,
      idpadre: animals.find(a => a.id === animalId)?.idpadre || '', // Asumiendo que la madre es la que parió
      idmadre: animalId,
      estadoReproductivo: 'desarrollo',
    };
    onRegisterAnimal(newCalf);
    alert(`Ternero ${calfId} registrado.`);

    setShowCalfModal(false);
    setCurrentCalvingAnimal(null);
  };

  // Filtrar registros reproductivos
  const filteredRecords = reproductiveRecords.filter(record => {
    const matchesAnimal = filterAnimalId === '' || record.animalId === filterAnimalId;
    const matchesEventType = filterEventType === '' || record.eventType === filterEventType;
    return matchesAnimal && matchesEventType;
  });

  // Funciones auxiliares para obtener nombres
  const getAnimalName = (animalId) => {
    const animal = animals.find(a => a.id === animalId);
    return animal ? animal.name : 'Desconocido';
  };

  // Función para generar PDF del calendario de partos
  const handleGenerateCalvingSchedulePDF = useCallback(() => {
    if (calvingSchedule.length === 0) {
      alert('No hay partos programados para generar el PDF.');
      return;
    }

    const farmName = currentUser?.farmName || 'Mi Finca Ganadera';
    const adminName = currentUser?.fullName || 'Administrador';
    const defaultLogo = 'https://via.placeholder.com/60x60?text=LOGO';

    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '15mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '10pt';
    tempDiv.style.backgroundColor = '#f8f8f8';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';

    let tableRows = calvingSchedule.map(item => {
      const daysRemaining = Math.ceil((new Date(item.expectedCalvingDate) - new Date()) / (1000 * 60 * 60 * 24));
      const isOverdue = daysRemaining < 0;
      const daysText = isOverdue ? `VENCIDO (${Math.abs(daysRemaining)} días)` : `${daysRemaining} días`;
      const daysColor = isOverdue ? 'red' : 'black'; // Color para los días restantes

      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 12px;">${getAnimalName(item.animalId)} (${item.animalId})</td>
          <td style="padding: 8px 12px;">${item.diagnosisDate}</td>
          <td style="padding: 8px 12px;">${item.expectedCalvingDate}</td>
          <td style="padding: 8px 12px;"><span style="font-weight: bold; color: ${daysColor};">${daysText}</span></td>
        </tr>
      `;
    }).join('');

    tempDiv.innerHTML = `
      <div style="border: 1px solid #ddd; border-radius: 12px; overflow: hidden; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #2c3e50; color: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <img src="${logoUrl || defaultLogo}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" alt="Logo Finca">
          <div style="text-align: right;">
            <h1 style="margin: 0; font-size: 20pt; font-weight: bold;">${farmName}</h1>
            <p style="margin: 0; font-size: 10pt; opacity: 0.8;">Calendario de Partos</p>
          </div>
        </div>

        <div style="padding: 25px;">
          <h3 style="font-size: 16pt; margin-bottom: 20px; text-align: center; color: #333;">Próximos Partos Programados</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead style="background-color: #f0f0f0;">
              <tr>
                <th style="padding: 10px 12px; text-align: left; border: 1px solid #eee;">Animal</th>
                <th style="padding: 10px 12px; text-align: left; border: 1px solid #eee;">Fecha Diagnóstico Preñez</th>
                <th style="padding: 10px 12px; text-align: left; border: 1px solid #eee;">Fecha Probable de Parto</th>
                <th style="padding: 10px 12px; text-align: left; border: 1px solid #eee;">Días Restantes</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
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

      while (heightLeft > 0) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`calendario_partos_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.removeChild(tempDiv);
    });
  }, [calvingSchedule, currentUser, logoUrl, animals]); // Dependencias para useCallback

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Control Reproductivo</h3>

      {/* Sección de Notificaciones de Partos Próximos */}
      {upcomingCalvingNotifications.length > 0 && (
        <div className="mb-8 p-4 border rounded-lg bg-yellow-100 border-yellow-400 text-yellow-800">
          <h4 className="text-lg font-semibold mb-3">Notificaciones de Partos Próximos</h4>
          {upcomingCalvingNotifications.map(notification => (
            <div key={notification.id} className={`p-3 mb-2 rounded-lg ${notification.type === 'warning' ? 'bg-yellow-200' : 'bg-red-200'} text-sm`}>
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Sección de Registro de Eventos Reproductivos */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-lg font-semibold mb-3">Registrar Evento Reproductivo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="animalId"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={reproductiveData.animalId}
            onChange={handleInputChange}
          >
            <option value="">Selecciona Animal</option>
            {animals.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
            ))}
          </select>
          <select
            name="eventType"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={reproductiveData.eventType}
            onChange={handleInputChange}
          >
            <option value="">Selecciona Tipo de Evento</option>
            <option value="diagnostico_prenez">Diagnóstico de Preñez</option>
            <option value="parto">Parto</option>
            <option value="inseminacion">Inseminación</option>
            <option value="celo">Celo</option>
            <option value="monta_natural">Monta Natural</option> {/* Nueva opción */}
          </select>
          <input
            type="date"
            name="eventDate"
            placeholder="Fecha del Evento"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={reproductiveData.eventDate}
            onChange={handleInputChange}
          />
          {reproductiveData.eventType === 'diagnostico_prenez' && (
            <select
              name="diagnosisResult"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={reproductiveData.diagnosisResult}
              onChange={handleInputChange}
            >
              <option value="">Resultado del Diagnóstico</option>
              <option value="preñada">Preñada</option>
              <option value="vacia">Vacía</option>
            </select>
          )}
          {/* Campo para la fecha probable de parto (editable si es diagnóstico de preñez) */}
          {(reproductiveData.eventType === 'diagnostico_prenez' && reproductiveData.diagnosisResult === 'preñada') && (
            <input
              type="date"
              name="expectedCalvingDate"
              placeholder="Fecha Probable de Parto (Confirmada)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={reproductiveData.expectedCalvingDate}
              onChange={handleInputChange}
              required // Hacerlo requerido si se confirma preñez
            />
          )}
          {/* Campo para ID de Macho en Monta Natural */}
          {reproductiveData.eventType === 'monta_natural' && (
            <input
              type="text"
              name="machoId"
              placeholder="ID del Macho (Monta Natural)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={reproductiveData.machoId}
              onChange={handleInputChange}
            />
          )}
          {reproductiveData.eventType === 'inseminacion' && (
            <>
              <input
                type="text"
                name="semenId"
                placeholder="ID de Semen"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={reproductiveData.semenId}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="semenProvider"
                placeholder="Proveedor de Semen"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={reproductiveData.semenProvider}
                onChange={handleInputChange}
              />
            </>
          )}
          {reproductiveData.eventType === 'parto' && (
            <>
              <input
                type="text"
                name="calfId"
                placeholder="ID del Ternero (si aplica)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={reproductiveData.calfId}
                onChange={handleInputChange}
              />
              <select
                name="calfSex"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={reproductiveData.calfSex}
                onChange={handleInputChange}
              >
                <option value="">Sexo del Ternero</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
              <input
                type="number"
                name="calfWeight"
                placeholder="Peso del Ternero (kg)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={reproductiveData.calfWeight}
                onChange={handleInputChange}
              />
              <textarea
                name="calfObservations"
                placeholder="Observaciones del Ternero"
                rows="2"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                value={reproductiveData.calfObservations}
                onChange={handleInputChange}
              ></textarea>
            </>
          )}
          <textarea
            name="details"
            placeholder="Detalles adicionales del evento"
            rows="2"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none col-span-full"
            value={reproductiveData.details}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Registrar Evento
        </button>
      </div>

      {/* Sección de Historial de Eventos Reproductivos */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-lg font-semibold mb-3">Historial de Eventos Reproductivos</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Filtrar por ID Animal"
            className="w-full px-4 py-2 border rounded-lg"
            value={filterAnimalId}
            onChange={(e) => setFilterAnimalId(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value)}
          >
            <option value="">Todos los Eventos</option>
            <option value="diagnostico_prenez">Diagnóstico de Preñez</option>
            <option value="parto">Parto</option>
            <option value="inseminacion">Inseminación</option>
            <option value="celo">Celo</option>
            <option value="monta_natural">Monta Natural</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">ID Animal</th>
                <th className="py-2 px-4 border">Tipo de Evento</th>
                <th className="py-2 px-4 border">Fecha</th>
                <th className="py-2 px-4 border">Detalles</th>
                <th className="py-2 px-4 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{getAnimalName(record.animalId)} ({record.animalId})</td>
                  <td className="py-2 px-4 border">{record.eventType ? record.eventType.replace(/_/g, ' ') : 'N/A'}</td> {/* Manejo de undefined */}
                  <td className="py-2 px-4 border">{record.eventDate}</td>
                  <td className="py-2 px-4 border">{record.details || record.diagnosisResult || record.calfId || record.semenId || record.machoId || 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => setReproductiveRecords(reproductiveRecords.filter(r => r.id !== record.id))}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Historial de Montas Naturales */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-lg font-semibold mb-3">Historial de Montas Naturales</h4>
        {naturalMatingHistory.length === 0 ? (
          <p className="text-gray-500 text-center">No hay montas naturales registradas aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">ID Hembra</th>
                  <th className="py-2 px-4 border">ID Macho</th>
                  <th className="py-2 px-4 border">Fecha de Monta</th>
                  <th className="py-2 px-4 border">Detalles</th>
                  <th className="py-2 px-4 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {naturalMatingHistory.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{getAnimalName(record.animalId)} ({record.animalId})</td>
                    <td className="py-2 px-4 border">{getAnimalName(record.machoId)} ({record.machoId})</td>
                    <td className="py-2 px-4 border">{record.eventDate}</td>
                    <td className="py-2 px-4 border">{record.details || 'N/A'}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => setNaturalMatingHistory(naturalMatingHistory.filter(r => r.id !== record.id))}
                        className="text-red-600 hover:underline"
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
      </div>

      {/* Sección de Calendario de Partos */}
      <div className="mb-8 p-4 border rounded-lg bg-blue-50">
        <h4 className="text-lg font-semibold mb-3">Calendario de Partos</h4>
        <button
          onClick={handleGenerateCalvingSchedulePDF}
          className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Descargar Calendario PDF
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Animal</th>
                <th className="py-2 px-4 border">Fecha Diagnóstico Preñez</th>
                <th className="py-2 px-4 border">Fecha Probable de Parto</th>
                <th className="py-2 px-4 border">Días Restantes</th>
                <th className="py-2 px-4 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calvingSchedule.map(item => {
                const daysRemaining = Math.ceil((new Date(item.expectedCalvingDate) - new Date()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysRemaining < 0;
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-100' : ''}`}>
                    <td className="py-2 px-4 border">{getAnimalName(item.animalId)} ({item.animalId})</td>
                    <td className="py-2 px-4 border">{item.diagnosisDate}</td>
                    <td className="py-2 px-4 border">{item.expectedCalvingDate}</td>
                    <td className="py-2 px-4 border">
                      {isOverdue ? <span className="font-bold text-red-600">VENCIDO ({Math.abs(daysRemaining)} días)</span> : `${daysRemaining} días`}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleMarkCalving(item.animalId)}
                        className="text-orange-600 hover:underline"
                      >
                        Marcar Parto
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para registrar ternero */}
      {showCalfModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Registrar Ternero para {getAnimalName(currentCalvingAnimal)}</h4>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="calfId"
                placeholder="ID del Ternero"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={calfData.calfId}
                onChange={handleCalfDataChange}
                required
              />
              <select
                name="calfSex"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={calfData.calfSex}
                onChange={handleCalfDataChange}
                required
              >
                <option value="">Sexo del Ternero</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
              <input
                type="number"
                name="calfWeight"
                placeholder="Peso del Ternero (kg)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={calfData.calfWeight}
                onChange={handleCalfDataChange}
                required
              />
              <textarea
                name="calfObservations"
                placeholder="Observaciones del Ternero"
                rows="2"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                value={calfData.calfObservations}
                onChange={handleCalfDataChange}
              ></textarea>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCalfModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCalfSubmit}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Registrar Ternero
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReproductiveControlPage;