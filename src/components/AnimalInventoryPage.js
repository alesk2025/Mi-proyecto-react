import React, { useState, useEffect, memo } from 'react';
import { animals } from '../mock/animals';

const AnimalInventoryPageComponent = () => {
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-card shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Inventario Animal</h3>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o ID..."
          className="input-default flex-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="input-default"
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

      <div className="overflow-x-auto shadow-md rounded-card"> {/* Added shadow and rounded-card here */}
        <table className="min-w-full table-row-striped">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Raza</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Producción</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(animal => (
              <tr key={animal.id} className="hover:bg-gray-100 dark:hover:bg-gray-600"> {/* Hover for striped tables */}
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">{animal.id}</td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">{animal.name}</td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">{animal.breed}</td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">{animal.productionType}</td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    animal.status === 'en_produccion' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                    animal.status === 'preñada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100' :
                    animal.status === 'seca' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                  }`}>
                    {animal.status === 'en_produccion' ? 'En Producción' :
                     animal.status === 'preñada' ? 'Preñada' :
                     animal.status === 'seca' ? 'Seca' : 'Otro'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
                  {animal.productionType === 'leche' && animal.status === 'en_produccion' 
                    ? `${animal.dailyMilk} L/día` : '-'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
                  <button className="btn btn-default btn-sm mr-2">Ver</button>
                  <button className="btn btn-default btn-sm">PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-card shadow-lg card-interactive">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">Vacas en Producción</h4>
          <p className="text-3xl font-bold text-green-500 dark:text-green-400">
            {animalList.filter(a => a.status === 'en_produccion').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-card shadow-lg card-interactive">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">Vacas Preñadas</h4>
          <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">
            {animalList.filter(a => a.status === 'preñada').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-card shadow-lg card-interactive">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">Vacas Secas</h4>
          <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
            {animalList.filter(a => a.status === 'seca').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(AnimalInventoryPageComponent);