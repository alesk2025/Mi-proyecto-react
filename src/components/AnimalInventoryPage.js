import React, { useState, useEffect } from 'react';
import { animals } from '../mock/animals';

const AnimalInventoryPage = () => {
  const [animalList, setAnimalList] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    // Simular carga de datos
    setAnimalList(animals);
  }, []);

  const filteredAnimals = animalList.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(filter.toLowerCase()) || 
                         animal.id.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || animal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Inventario Animal</h3>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o ID..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="en_produccion">En Producción</option>
          <option value="seca">Seca</option>
          <option value="preñada">Preñada</option>
          <option value="desarrollo">En Desarrollo</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Raza</th>
              <th className="py-2 px-4 border">Tipo</th>
              <th className="py-2 px-4 border">Estado</th>
              <th className="py-2 px-4 border">Producción</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(animal => (
              <tr key={animal.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{animal.id}</td>
                <td className="py-2 px-4 border">{animal.name}</td>
                <td className="py-2 px-4 border">{animal.breed}</td>
                <td className="py-2 px-4 border">{animal.productionType}</td>
                <td className="py-2 px-4 border">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    animal.status === 'en_produccion' ? 'bg-green-100 text-green-800' :
                    animal.status === 'preñada' ? 'bg-blue-100 text-blue-800' :
                    animal.status === 'seca' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {animal.status === 'en_produccion' ? 'En Producción' :
                     animal.status === 'preñada' ? 'Preñada' :
                     animal.status === 'seca' ? 'Seca' : 'Otro'}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  {animal.productionType === 'leche' && animal.status === 'en_produccion' 
                    ? `${animal.dailyMilk} L/día` : '-'}
                </td>
                <td className="py-2 px-4 border">
                  <button className="text-blue-600 hover:underline mr-2">Ver</button>
                  <button className="text-green-600 hover:underline">PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800">Vacas en Producción</h4>
          <p className="text-2xl font-bold text-green-600">
            {animalList.filter(a => a.status === 'en_produccion').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800">Vacas Preñadas</h4>
          <p className="text-2xl font-bold text-blue-600">
            {animalList.filter(a => a.status === 'preñada').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800">Vacas Secas</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {animalList.filter(a => a.status === 'seca').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimalInventoryPage;