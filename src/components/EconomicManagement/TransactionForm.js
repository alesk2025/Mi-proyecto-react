import React from 'react';

const TransactionForm = ({ transaction, handleInputChange, handleSubmit, handleGenerateInvoice, animals, calculateTotalSale }) => { // calculateTotalSale is now passed as prop
  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50">
      <h4 className="text-lg font-semibold mb-3">Registrar Nueva Transacción</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="type"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={transaction.type}
          onChange={handleInputChange}
        >
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
          <option value="compra">Compra</option>
          <option value="venta">Venta</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Categoría (Ej: Alimento, Venta de Leche)"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={transaction.category}
          onChange={handleInputChange}
        />
        
        {transaction.type !== 'venta' && (
          <input
            type="number"
            name="amount"
            placeholder="Monto"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={transaction.amount}
            onChange={handleInputChange}
          />
        )}

        <input
          type="text"
          name="description"
          placeholder="Descripción Detallada"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={transaction.description}
          onChange={handleInputChange}
        />
        <select
          name="animalId"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={transaction.animalId}
          onChange={handleInputChange}
        >
          <option value="">Asociar a Animal (Opcional)</option>
          {animals.map(animal => (
            <option key={animal.id} value={animal.id}>{animal.name} ({animal.id})</option>
          ))}
        </select>

        {/* Campos específicos para Venta */}
        {transaction.type === 'venta' && (
          <>
            <input
              type="text"
              name="product"
              placeholder="Producto (Ej: Leche, Carne)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={transaction.product}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Cantidad"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={transaction.quantity}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="unit"
              placeholder="Unidad (Ej: litros, kg)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={transaction.unit}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="pricePerUnit"
              placeholder="Precio por unidad"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={transaction.pricePerUnit}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="client"
              placeholder="Cliente"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={transaction.client}
              onChange={handleInputChange}
            />
            <div className="col-span-full p-2 bg-gray-100 rounded-lg">
              <p className="font-semibold">Total de Venta: ${calculateTotalSale()}</p>
            </div>
          </>
        )}
        {/* Campos de fecha de período para Ingreso */}
        {transaction.type === 'ingreso' && (
          <>
            <input
              type="date"
              name="startDate"
              placeholder="Fecha Inicio Período Ingreso"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={transaction.startDate}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="endDate"
              placeholder="Fecha Fin Período Ingreso"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={transaction.endDate}
              onChange={handleInputChange}
            />
          </>
        )}
        <input
          type="date"
          name="date"
          placeholder="Fecha de Transacción"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={transaction.date}
          onChange={handleInputChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors mr-2"
      >
        Registrar Transacción
      </button>
      {transaction.type === 'venta' && (
        <button
          onClick={() => handleGenerateInvoice(transaction)}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generar Factura
        </button>
      )}
    </div>
  );
};

export default TransactionForm;