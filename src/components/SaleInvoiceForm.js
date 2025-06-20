import React, { useState, useEffect } from 'react';

const SaleInvoiceForm = ({ onSave, onGenerateInvoice }) => {
  const [saleData, setSaleData] = useState({
    product: '',
    quantity: '',
    unit: 'litros',
    pricePerUnit: '',
    client: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedTotal = parseFloat(saleData.quantity) * parseFloat(saleData.pricePerUnit);
    setTotal(isNaN(calculatedTotal) ? 0 : calculatedTotal);
  }, [saleData.quantity, saleData.pricePerUnit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleData({ ...saleData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...saleData,
      total: total
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Registro de Venta</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="product"
            className="w-full px-4 py-2 border rounded-lg"
            value={saleData.product}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione producto</option>
            <option value="leche">Leche</option>
            <option value="carne">Carne</option>
            <option value="queso">Queso</option>
            <option value="otros">Otros</option>
          </select>
          
          <input
            type="text"
            name="client"
            placeholder="Cliente"
            className="w-full px-4 py-2 border rounded-lg"
            value={saleData.client}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="number"
            name="quantity"
            placeholder="Cantidad"
            className="w-full px-4 py-2 border rounded-lg"
            value={saleData.quantity}
            onChange={handleInputChange}
            required
          />
          
          <select
            name="unit"
            className="w-full px-4 py-2 border rounded-lg"
            value={saleData.unit}
            onChange={handleInputChange}
          >
            <option value="litros">Litros</option>
            <option value="kg">Kilogramos</option>
            <option value="unidades">Unidades</option>
          </select>
          
          <input
            type="number"
            name="pricePerUnit"
            placeholder="Precio por unidad"
            className="w-full px-4 py-2 border rounded-lg"
            value={saleData.pricePerUnit}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="date"
            name="date"
            className="w-full px-4 py-2 border rounded-lg"
            value={saleData.date}
            onChange={handleInputChange}
            required
          />
          
          <div className="md:col-span-2 bg-gray-100 p-3 rounded-lg">
            <p className="font-semibold">Total: ${total.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="submit"
            className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800"
          >
            Guardar Venta
          </button>
          <button
            type="button"
            onClick={() => onGenerateInvoice({
              ...saleData,
              total: total
            })}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Generar Factura
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleInvoiceForm;