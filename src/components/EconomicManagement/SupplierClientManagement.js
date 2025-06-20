import React, { useState } from 'react';

const SupplierClientManagement = ({ suppliers, clients, debts, credits, addSupplier, addClient, addDebt, payDebt, addCredit, collectCredit }) => {
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' or 'clients'
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', phone: '', email: '' });
  const [newClient, setNewClient] = useState({ name: '', contact: '', phone: '', email: '' });
  const [newDebt, setNewDebt] = useState({ supplierId: '', amount: '', description: '', dueDate: '', paid: false });
  const [newCredit, setNewCredit] = useState({ clientId: '', amount: '', description: '', dueDate: '', collected: false });

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact) {
      addSupplier({ ...newSupplier, id: `SUP-${Date.now().toString().slice(-5)}` });
      setNewSupplier({ name: '', contact: '', phone: '', email: '' });
      setShowAddSupplierModal(false);
    } else {
      alert('Por favor, completa el nombre y contacto del proveedor.');
    }
  };

  const handleAddClient = () => {
    if (newClient.name && newClient.contact) {
      addClient({ ...newClient, id: `CLI-${Date.now().toString().slice(-5)}` });
      setNewClient({ name: '', contact: '', phone: '', email: '' });
      setShowAddClientModal(false);
    } else {
      alert('Por favor, completa el nombre y contacto del cliente.');
    }
  };

  const handleAddDebt = () => {
    if (newDebt.supplierId && newDebt.amount && newDebt.dueDate) {
      addDebt({ ...newDebt, id: `DEBT-${Date.now().toString().slice(-5)}`, amount: parseFloat(newDebt.amount) });
      setNewDebt({ supplierId: '', amount: '', description: '', dueDate: '', paid: false });
      setShowAddDebtModal(false);
    } else {
      alert('Por favor, completa todos los campos de la deuda.');
    }
  };

  const handleAddCredit = () => {
    if (newCredit.clientId && newCredit.amount && newCredit.dueDate) {
      addCredit({ ...newCredit, id: `CRED-${Date.now().toString().slice(-5)}`, amount: parseFloat(newCredit.amount) });
      setNewCredit({ clientId: '', amount: '', description: '', dueDate: '', collected: false });
      setShowAddCreditModal(false);
    } else {
      alert('Por favor, completa todos los campos del crédito.');
    }
  };

  const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || 'Desconocido';
  const getClientName = (id) => clients.find(c => c.id === id)?.name || 'Desconocido';

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Gestión de Clientes y Proveedores</h3>

      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'suppliers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('suppliers')}
        >
          Proveedores
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'clients' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('clients')}
        >
          Clientes
        </button>
      </div>

      {activeTab === 'suppliers' && (
        <div>
          <button onClick={() => setShowAddSupplierModal(true)} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Agregar Proveedor
          </button>
          <button onClick={() => setShowAddDebtModal(true)} className="mb-4 ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Registrar Deuda
          </button>
          <h4 className="text-lg font-semibold mb-2">Lista de Proveedores</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Nombre</th>
                  <th className="py-2 px-4 border-b text-left">Contacto</th>
                  <th className="py-2 px-4 border-b text-left">Teléfono</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{supplier.name}</td>
                    <td className="py-2 px-4 border-b">{supplier.contact}</td>
                    <td className="py-2 px-4 border-b">{supplier.phone}</td>
                    <td className="py-2 px-4 border-b">{supplier.email}</td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                      <button className="text-red-600 hover:text-red-800">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-semibold mt-6 mb-2">Deudas por Pagar</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Proveedor</th>
                  <th className="py-2 px-4 border-b text-left">Monto</th>
                  <th className="py-2 px-4 border-b text-left">Descripción</th>
                  <th className="py-2 px-4 border-b text-left">Fecha Límite</th>
                  <th className="py-2 px-4 border-b text-left">Estado</th>
                  <th className="py-2 px-4 border-b text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {debts.map(debt => (
                  <tr key={debt.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{getSupplierName(debt.supplierId)}</td>
                    <td className="py-2 px-4 border-b">${debt.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{debt.description}</td>
                    <td className="py-2 px-4 border-b">{debt.dueDate}</td>
                    <td className={`py-2 px-4 border-b ${debt.paid ? 'text-green-600' : 'text-red-600'}`}>
                      {debt.paid ? 'Pagada' : 'Pendiente'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {!debt.paid && (
                        <button onClick={() => payDebt(debt.id)} className="text-green-600 hover:text-green-800 mr-2">Marcar como Pagada</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div>
          <button onClick={() => setShowAddClientModal(true)} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Agregar Cliente
          </button>
          <button onClick={() => setShowAddCreditModal(true)} className="mb-4 ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Registrar Crédito
          </button>
          <h4 className="text-lg font-semibold mb-2">Lista de Clientes</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Nombre</th>
                  <th className="py-2 px-4 border-b text-left">Contacto</th>
                  <th className="py-2 px-4 border-b text-left">Teléfono</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{client.name}</td>
                    <td className="py-2 px-4 border-b">{client.contact}</td>
                    <td className="py-2 px-4 border-b">{client.phone}</td>
                    <td className="py-2 px-4 border-b">{client.email}</td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                      <button className="text-red-600 hover:text-red-800">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-semibold mt-6 mb-2">Créditos por Cobrar</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Cliente</th>
                  <th className="py-2 px-4 border-b text-left">Monto</th>
                  <th className="py-2 px-4 border-b text-left">Descripción</th>
                  <th className="py-2 px-4 border-b text-left">Fecha Límite</th>
                  <th className="py-2 px-4 border-b text-left">Estado</th>
                  <th className="py-2 px-4 border-b text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {credits.map(credit => (
                  <tr key={credit.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{getClientName(credit.clientId)}</td>
                    <td className="py-2 px-4 border-b">${credit.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{credit.description}</td>
                    <td className="py-2 px-4 border-b">{credit.dueDate}</td>
                    <td className={`py-2 px-4 border-b ${credit.collected ? 'text-green-600' : 'text-red-600'}`}>
                      {credit.collected ? 'Cobrado' : 'Pendiente'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {!credit.collected && (
                        <button onClick={() => collectCredit(credit.id)} className="text-green-600 hover:text-green-800 mr-2">Marcar como Cobrado</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modales */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h4 className="text-lg font-semibold mb-4">Agregar Nuevo Proveedor</h4>
            <input
              type="text"
              placeholder="Nombre"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Contacto"
              value={newSupplier.contact}
              onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowAddSupplierModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">Cancelar</button>
              <button onClick={handleAddSupplier} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {showAddClientModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h4 className="text-lg font-semibold mb-4">Agregar Nuevo Cliente</h4>
            <input
              type="text"
              placeholder="Nombre"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Contacto"
              value={newClient.contact}
              onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowAddClientModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">Cancelar</button>
              <button onClick={handleAddClient} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {showAddDebtModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h4 className="text-lg font-semibold mb-4">Registrar Nueva Deuda</h4>
            <select
              value={newDebt.supplierId}
              onChange={(e) => setNewDebt({ ...newDebt, supplierId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            >
              <option value="">Selecciona un Proveedor</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monto"
              value={newDebt.amount}
              onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newDebt.description}
              onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="date"
              placeholder="Fecha Límite"
              value={newDebt.dueDate}
              onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowAddDebtModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">Cancelar</button>
              <button onClick={handleAddDebt} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Registrar Deuda</button>
            </div>
          </div>
        </div>
      )}

      {showAddCreditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h4 className="text-lg font-semibold mb-4">Registrar Nuevo Crédito</h4>
            <select
              value={newCredit.clientId}
              onChange={(e) => setNewCredit({ ...newCredit, clientId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            >
              <option value="">Selecciona un Cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monto"
              value={newCredit.amount}
              onChange={(e) => setNewCredit({ ...newCredit, amount: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newCredit.description}
              onChange={(e) => setNewCredit({ ...newCredit, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            />
            <input
              type="date"
              placeholder="Fecha Límite"
              value={newCredit.dueDate}
              onChange={(e) => setNewCredit({ ...newCredit, dueDate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowAddCreditModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">Cancelar</button>
              <button onClick={handleAddCredit} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Registrar Crédito</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierClientManagement;