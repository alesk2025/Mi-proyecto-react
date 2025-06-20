import React, { useState } from 'react';
import { classifyAnimalAge } from '../utils/helpers'; // Importar la función de utilidad

const InventoryPage = ({ inventoryItems, onAddItem, onUpdateItemQuantity, onExport, animals, onDeleteAnimal, onEditAnimal, onDeleteInventoryItem }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    category: '', // Ahora puede ser 'vacuna', 'desparasitante', 'vitamina' o las categorías generales
    quantity: '',
    unit: '',
    lot: '',
    expiration: '',
  });
  const [useItemData, setUseItemData] = useState({
    id: '',
    amount: '',
  });
  const [editingAnimal, setEditingAnimal] = useState(null); // Estado para el animal que se está editando
  const [editedAnimalData, setEditedAnimalData] = useState({ // Estado para los datos del formulario de edición
    id: '', name: '', raza: '', peso: '', sexo: '', fechaNacimiento: '', fechaCompra: '',
    tipoProduccion: '', dailyMilk: 0, padreId: '', madreId: '', estadoReproductivo: '',
  });
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda de animales
  const [filterRaza, setFilterRaza] = useState('');
  const [filterSexo, setFilterSexo] = useState('');
  const [filterTipoProduccion, setFilterTipoProduccion] = useState('');
  const [filterEstadoReproductivo, setFilterEstadoReproductivo] = useState(''); // Nuevo filtro
  const [isAnimalInventoryMinimized, setIsAnimalInventoryMinimized] = useState(false); // Nuevo estado para minimizar/maximizar

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleUseItemChange = (e) => {
    const { name, value } = e.target;
    setUseItemData({ ...useItemData, [name]: value });
  };

  const handleAddItem = () => {
    const newId = `INV-${Date.now().toString().slice(-5)}`;
    onAddItem({ ...newItem, id: newId, quantity: parseFloat(newItem.quantity) });
    alert(`Producto ${newItem.name} añadido al inventario.`);
    setNewItem({ name: '', category: '', quantity: '', unit: '', lot: '', expiration: '' });
  };

  const handleUseItem = () => {
    onUpdateItemQuantity(useItemData.id, parseFloat(useItemData.amount));
    alert(`Se usaron ${useItemData.amount} de ${useItemData.id}.`);
    setUseItemData({ id: '', amount: '' });
  };

  // --- Lógica de Edición de Animales ---
  const startEditingAnimal = (animal) => {
    setEditingAnimal(animal.id);
    setEditedAnimalData({ ...animal }); // Cargar datos del animal en el formulario de edición
  };

  const handleEditedAnimalChange = (e) => {
    const { name, value } = e.target;
    setEditedAnimalData({ ...editedAnimalData, [name]: value });
  };

  const saveEditedAnimal = () => {
    onEditAnimal(editedAnimalData);
    alert(`Animal ${editedAnimalData.name} (${editedAnimalData.id}) actualizado.`);
    setEditingAnimal(null); // Salir del modo edición
    setEditedAnimalData({ // Limpiar formulario
      id: '', name: '', raza: '', peso: '', sexo: '', fechaNacimiento: '', fechaCompra: '',
      tipoProduccion: '', dailyMilk: 0, padreId: '', madreId: '', estadoReproductivo: '',
    });
  };

  const cancelEditingAnimal = () => {
    setEditingAnimal(null);
    setEditedAnimalData({ // Limpiar formulario
      id: '', name: '', raza: '', peso: '', sexo: '', fechaNacimiento: '', fechaCompra: '',
      tipoProduccion: '', dailyMilk: 0, padreId: '', madreId: '', estadoReproductivo: '',
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterRaza('');
    setFilterSexo('');
    setFilterTipoProduccion('');
    setFilterEstadoReproductivo('');
  };

  // Métricas de inventario animal
  const totalAnimals = animals.length;
  const cowsInProduction = animals.filter(a => a.tipoProduccion === 'leche' && a.estadoReproductivo === 'produccion').length;
  const pregnantCows = animals.filter(a => a.estadoReproductivo === 'preñada').length;
  const dryCows = animals.filter(a => a.estadoReproductivo === 'seca').length;
  
  // Filtrar animales por término de búsqueda y filtros adicionales
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.raza.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRaza = filterRaza === '' || animal.raza === filterRaza;
    const matchesSexo = filterSexo === '' || animal.sexo === filterSexo;
    const matchesTipoProduccion = filterTipoProduccion === '' || animal.tipoProduccion === filterTipoProduccion;
    const matchesEstadoReproductivo = filterEstadoReproductivo === '' || animal.estadoReproductivo === filterEstadoReproductivo;

    return matchesSearch && matchesRaza && matchesSexo && matchesTipoProduccion && matchesEstadoReproductivo;
  });

  // Obtener opciones únicas para los filtros
  const uniqueRazas = [...new Set(animals.map(animal => animal.raza))];
  const uniqueTiposProduccion = [...new Set(animals.map(animal => animal.tipoProduccion))];
  const uniqueEstadosReproductivos = [...new Set(animals.map(animal => animal.estadoReproductivo))];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Inventario General</h3>

      {/* Inventario Animal */}
      <div className="mb-8 p-4 border rounded-lg bg-blue-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Inventario Animal</h4>
          <button
            onClick={() => setIsAnimalInventoryMinimized(!isAnimalInventoryMinimized)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            {isAnimalInventoryMinimized ? (
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
        {!isAnimalInventoryMinimized && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <p className="text-sm font-medium">Total Animales</p>
                <p className="text-2xl font-bold">{totalAnimals}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <p className="text-sm font-medium">Vacas en Producción</p>
                <p className="text-2xl font-bold">{cowsInProduction}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <p className="text-sm font-medium">Vacas Preñadas</p>
                <p className="text-2xl font-bold">{pregnantCows}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <p className="text-sm font-medium">Vacas Secas</p>
                <p className="text-2xl font-bold">{dryCows}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <p className="text-sm font-medium">Terneros</p>
                <p className="text-2xl font-bold">{animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Terner')).length}</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-lg">
                <p className="text-sm font-medium">Mautes</p>
                <p className="text-2xl font-bold">{animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Maut')).length}</p>
              </div>
              <div className="p-3 bg-pink-200 rounded-lg">
                <p className="text-sm font-medium">Novillas</p>
                <p className="text-2xl font-bold">{animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo).includes('Novilla')).length}</p>
              </div>
              <div className="p-3 bg-gray-200 rounded-lg">
                <p className="text-sm font-medium">Toros</p>
                <p className="text-2xl font-bold">{animals.filter(animal => classifyAnimalAge(animal.fechaNacimiento, animal.sexo) === 'Toro').length}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Buscar por nombre, ID o raza..."
                className="w-full px-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={filterRaza}
                onChange={(e) => setFilterRaza(e.target.value)}
              >
                <option value="">Todas las Razas</option>
                {uniqueRazas.map(raza => (
                  <option key={raza} value={raza}>{raza}</option>
                ))}
              </select>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={filterSexo}
                onChange={(e) => setFilterSexo(e.target.value)}
              >
                <option value="">Todos los Sexos</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={filterTipoProduccion}
                onChange={(e) => setFilterTipoProduccion(e.target.value)}
              >
                <option value="">Todos los Tipos de Producción</option>
                {uniqueTiposProduccion.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={filterEstadoReproductivo}
                onChange={(e) => setFilterEstadoReproductivo(e.target.value)}
              >
                <option value="">Todos los Estados Reproductivos</option>
                {uniqueEstadosReproductivos.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
              <button
                onClick={clearAllFilters}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors col-span-full md:col-span-1"
              >
                Limpiar Filtros
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">ID</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Nombre</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Raza</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Peso</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Sexo</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Producción</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Estado</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Leche Diaria</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAnimals.map(animal => (
                    <tr key={animal.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{animal.id}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{animal.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{animal.raza}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{animal.peso}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{animal.sexo}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{animal.tipoProduccion}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{animal.estadoReproductivo || 'N/A'}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{animal.dailyMilk || 'N/A'}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => startEditingAnimal(animal)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-2 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDeleteAnimal(animal.id)}
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

            {/* Formulario de Edición de Animal */}
            {editingAnimal && (
              <div className="mt-8 p-4 border rounded-lg bg-yellow-50">
                <h4 className="text-lg font-semibold mb-3">Editar Animal: {editedAnimalData.name} ({editedAnimalData.id})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre del Animal"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.name}
                    onChange={handleEditedAnimalChange}
                  />
                  <input
                    type="text"
                    name="raza"
                    placeholder="Raza"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.raza}
                    onChange={handleEditedAnimalChange}
                  />
                  <input
                    type="number"
                    name="peso"
                    placeholder="Peso"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.peso}
                    onChange={handleEditedAnimalChange}
                  />

                  <select
                    name="sexo"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.sexo}
                    onChange={handleEditedAnimalChange}
                  >
                    <option value="">Selecciona Sexo</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    placeholder="Fecha de Nacimiento"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.fechaNacimiento}
                    onChange={handleEditedAnimalChange}
                  />
                  <input
                    type="date"
                    name="fechaCompra"
                    placeholder="Fecha de Compra (Opcional)"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.fechaCompra}
                    onChange={handleEditedAnimalChange}
                  />
                  <select
                    name="tipoProduccion"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.tipoProduccion}
                    onChange={handleEditedAnimalChange}
                  >
                    <option value="">Tipo de Producción</option>
                    <option value="carne">Carne</option>
                    <option value="leche">Leche</option>
                  </select>
                  {editedAnimalData.tipoProduccion === 'leche' && editedAnimalData.sexo === 'hembra' && (
                    <input
                      type="number"
                      name="dailyMilk"
                      placeholder="Litros Promedio Diarios"
                      className="w-full px-4 py-2 border rounded-lg"
                      value={editedAnimalData.dailyMilk}
                      onChange={handleEditedAnimalChange}
                    />
                  )}
                  <input
                    type="text"
                    name="padreId"
                    placeholder="ID Padre (Opcional)"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.padreId}
                    onChange={handleEditedAnimalChange}
                  />
                  <input
                    type="text"
                    name="madreId"
                    placeholder="ID Madre (Opcional)"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.madreId}
                    onChange={handleEditedAnimalChange}
                  />
                  <select
                    name="estadoReproductivo"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editedAnimalData.estadoReproductivo}
                    onChange={handleEditedAnimalChange}
                  >
                    <option value="desarrollo">En Desarrollo</option>
                    <option value="en_produccion">En Producción</option>
                    <option value="seca">Seca</option>
                    <option value="preñada">Preñada</option>
                    <option value="vacia">Vacía</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={saveEditedAnimal}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={cancelEditingAnimal}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sección para añadir nuevos productos */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-lg font-semibold mb-3">Añadir Nuevo Producto/Insumo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="w-full px-4 py-2 border rounded-lg"
            value={newItem.name}
            onChange={handleNewItemChange}
          />
          <select
            name="category"
            className="w-full px-4 py-2 border rounded-lg"
            value={newItem.category}
            onChange={handleNewItemChange}
          >
            <option value="">Selecciona Categoría</option>
            <option value="insumos">Insumos</option>
            <option value="herramientas">Herramientas</option>
            <option value="medicamentos">Medicamentos</option>
            <option value="vacunas">Vacunas</option>
            <option value="desparasitantes">Desparasitantes</option>
            <option value="vitaminas">Vitaminas</option>
            <option value="subproductos">Subproductos</option>
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Cantidad"
            className="w-full px-4 py-2 border rounded-lg"
            value={newItem.quantity}
            onChange={handleNewItemChange}
          />
          <input
            type="text"
            name="unit"
            placeholder="Unidad (ej: kg, litros, unidades)"
            className="w-full px-4 py-2 border rounded-lg"
            value={newItem.unit}
            onChange={handleNewItemChange}
          />
          <input
            type="text"
            name="lot"
            placeholder="Lote (Opcional)"
            className="w-full px-4 py-2 border rounded-lg"
            value={newItem.lot}
            onChange={handleNewItemChange}
          />
          <input
            type="date"
            name="expiration"
            placeholder="Fecha de Vencimiento (Opcional)"
            className="w-full px-4 py-2 border rounded-lg"
            value={newItem.expiration}
            onChange={handleNewItemChange}
          />
        </div>
        <button
          onClick={handleAddItem}
          className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Añadir Producto
        </button>
      </div>

      {/* Sección para usar productos del stock */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-lg font-semibold mb-3">Usar Producto del Stock</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="id"
            className="w-full px-4 py-2 border rounded-lg"
            value={useItemData.id}
            onChange={handleUseItemChange}
          >
            <option value="">Selecciona Producto</option>
            {inventoryItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.quantity} {item.unit})
              </option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Cantidad a usar"
            className="w-full px-4 py-2 border rounded-lg"
            value={useItemData.amount}
            onChange={handleUseItemChange}
          />
        </div>
        <button
          onClick={handleUseItem}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Usar Producto
        </button>
      </div>

      {/* Visualización del inventario actual */}
      <h4 className="text-lg font-semibold mb-3">Stock de Productos e Insumos</h4>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Nombre</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Categoría</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Cantidad</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Unidad</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Lote</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Vencimiento</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventoryItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.id}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.category}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.quantity}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.unit}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.lot || 'N/A'}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.expiration || 'N/A'}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onDeleteInventoryItem(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onExport('PDF')}
          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Exportar a PDF
        </button>
        <button
          onClick={() => onExport('Excel')}
          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default InventoryPage;