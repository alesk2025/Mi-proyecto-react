import React, { useState, useEffect } from 'react';

const InventoryStockPage = ({ inventoryItems, onAddItem, onUpdateItemQuantity, onDeleteInventoryItem }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'medicamentos',
    quantity: '',
    unit: 'ml',
    lot: '',
    expiration: ''
  });
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setItems(inventoryItems);
  }, [inventoryItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    const newItemWithId = {
      ...newItem,
      id: `INV-${Date.now()}`,
      quantity: parseFloat(newItem.quantity),
      farmId: 1
    };
    onAddItem(newItemWithId);
    setNewItem({
      name: '',
      category: 'medicamentos',
      quantity: '',
      unit: 'ml',
      lot: '',
      expiration: ''
    });
  };

  const handleUseItem = (id, quantityUsed) => {
    onUpdateItemQuantity(id, quantityUsed);
  };

  const handleDeleteItem = (id) => {
    onDeleteInventoryItem(id);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = categoryFilter === 'todos' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Gestión de Stock</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium mb-2">Añadir Nuevo Producto</h4>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              name="name"
              placeholder="Nombre del Producto"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={newItem.name}
              onChange={handleInputChange}
            />
            <select
              name="category"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={newItem.category}
              onChange={handleInputChange}
            >
              <option value="medicamentos">Medicamentos</option>
              <option value="vacunas">Vacunas</option>
              <option value="desparasitantes">Desparasitantes</option>
              <option value="vitaminas">Vitaminas</option>
              <option value="insumos">Insumos</option>
              <option value="herramientas">Herramientas</option>
              <option value="subproductos">Subproductos</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="quantity"
                placeholder="Cantidad"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={newItem.quantity}
                onChange={handleInputChange}
              />
              <select
                name="unit"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={newItem.unit}
                onChange={handleInputChange}
              >
                <option value="ml">ml</option>
                <option value="unidades">Unidades</option>
                <option value="kg">kg</option>
                <option value="litros">Litros</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="lot"
                placeholder="Número de Lote"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={newItem.lot}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="expiration"
                placeholder="Fecha de Vencimiento"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={newItem.expiration}
                onChange={handleInputChange}
              />
            </div>
            <button
              onClick={handleAddItem}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Añadir al Inventario
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Filtrar Stock</h4>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="todos">Todas las categorías</option>
              <option value="medicamentos">Medicamentos</option>
              <option value="vacunas">Vacunas</option>
              <option value="desparasitantes">Desparasitantes</option>
              <option value="vitaminas">Vitaminas</option>
              <option value="insumos">Insumos</option>
              <option value="herramientas">Herramientas</option>
              <option value="subproductos">Subproductos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Categoría</th>
              <th className="py-2 px-4 border">Cantidad</th>
              <th className="py-2 px-4 border">Lote</th>
              <th className="py-2 px-4 border">Vencimiento</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{item.id}</td>
                <td className="py-2 px-4 border">{item.name}</td>
                <td className="py-2 px-4 border">
                  {item.category === 'medicamentos' ? 'Medicamentos' :
                   item.category === 'insumos' ? 'Insumos' :
                   item.category === 'herramientas' ? 'Herramientas' :
                   item.category === 'vacunas' ? 'Vacunas' :
                   item.category === 'desparasitantes' ? 'Desparasitantes' :
                   item.category === 'vitaminas' ? 'Vitaminas' : 'Subproductos'}
                </td>
                <td className="py-2 px-4 border">{item.quantity} {item.unit}</td>
                <td className="py-2 px-4 border">{item.lot}</td>
                <td className="py-2 px-4 border">{item.expiration}</td>
                <td className="py-2 px-4 border">
                  <button 
                    onClick={() => handleUseItem(item.id, 1)} // Ejemplo: usar 1 unidad
                    className="text-red-600 hover:underline mr-2"
                  >
                    Usar 1 {item.unit}
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
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
  );
};

export default InventoryStockPage;