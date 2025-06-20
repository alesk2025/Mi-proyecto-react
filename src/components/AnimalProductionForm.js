import React, { useState } from 'react';

const AnimalProductionForm = ({ animalId, onSave }) => {
  const [productionData, setProductionData] = useState({
    status: 'en_produccion',
    dailyMilk: '',
    lastMilkingDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductionData({ ...productionData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(animalId, productionData);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h4 className="font-semibold mb-3">Registro de Producción</h4>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="status"
            className="w-full px-4 py-2 border rounded-lg"
            value={productionData.status}
            onChange={handleInputChange}
            required
          >
            <option value="en_produccion">En Producción</option>
            <option value="seca">Seca</option>
            <option value="preñada">Preñada</option>
          </select>
          
          {productionData.status === 'en_produccion' && (
            <>
              <input
                type="number"
                name="dailyMilk"
                placeholder="Litros diarios de leche"
                className="w-full px-4 py-2 border rounded-lg"
                value={productionData.dailyMilk}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="lastMilkingDate"
                className="w-full px-4 py-2 border rounded-lg"
                value={productionData.lastMilkingDate}
                onChange={handleInputChange}
                required
              />
            </>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Guardar Producción
        </button>
      </form>
    </div>
  );
};

export default AnimalProductionForm;