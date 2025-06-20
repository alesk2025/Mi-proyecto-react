import React, { useState } from 'react';

const PersonnelThirdPartyPaymentForm = ({ thirdPartyPaymentData, handleThirdPartyPaymentChange, handleAddThirdPartyPaymentAction, animals }) => {
  const [appliesTo, setAppliesTo] = useState('general'); // 'general' or 'specific'
  const [targetAnimalId, setTargetAnimalId] = useState('');

  const handleAppliesToChange = (e) => {
    setAppliesTo(e.target.value);
    if (e.target.value === 'general') {
      setTargetAnimalId(''); // Clear specific animal if general is selected
    }
  };

  const handleTargetAnimalChange = (e) => {
    setTargetAnimalId(e.target.value);
  };

  const handleSubmit = () => {
    if (appliesTo === 'specific' && !targetAnimalId) {
      alert('Por favor, selecciona un animal específico para este pago.');
      return;
    }
    handleAddThirdPartyPaymentAction({ ...thirdPartyPaymentData, appliesTo, targetAnimalId });
    setAppliesTo('general');
    setTargetAnimalId('');
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">Registrar Pago a Terceros / Mano de Obra</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="personName"
          placeholder="Nombre de la Persona/Empresa"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={thirdPartyPaymentData.personName}
          onChange={handleThirdPartyPaymentChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Monto del Pago"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={thirdPartyPaymentData.amount}
          onChange={handleThirdPartyPaymentChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción del Trabajo/Servicio"
          className="w-full px-4 py-2 border rounded-lg"
          value={thirdPartyPaymentData.description}
          onChange={handleThirdPartyPaymentChange}
        />
        <input
          type="date"
          name="date"
          placeholder="Fecha del Pago"
          className="w-full px-4 py-2 border rounded-lg"
          value={thirdPartyPaymentData.date}
          onChange={handleThirdPartyPaymentChange}
        />
        <div className="col-span-full">
          <label className="block text-gray-700 text-sm font-bold mb-1">Aplicar a:</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="appliesTo"
                value="general"
                checked={appliesTo === 'general'}
                onChange={handleAppliesToChange}
              />
              <span className="ml-2 text-gray-700">Todos los animales (General)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="appliesTo"
                value="specific"
                checked={appliesTo === 'specific'}
                onChange={handleAppliesToChange}
              />
              <span className="ml-2 text-gray-700">Animal Específico</span>
            </label>
          </div>
        </div>
        {appliesTo === 'specific' && (
          <div className="col-span-full">
            <label className="block text-gray-700 text-sm font-bold mb-1">Selecciona Animal:</label>
            <select
              name="targetAnimalId"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={targetAnimalId}
              onChange={handleTargetAnimalChange}
            >
              <option value="">Selecciona un animal</option>
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
      >
        Registrar Pago a Tercero
      </button>
    </div>
  );
};

export default PersonnelThirdPartyPaymentForm;