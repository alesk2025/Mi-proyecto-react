import React from 'react';

const SubscriptionPlansPage = ({ currentPlan, onUpdateSubscription, plans }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Planes de Suscripción</h3>
      <p className="text-gray-700 mb-6">Tu plan actual es: <span className="font-bold text-blue-600">{currentPlan}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(plans).map((planName) => {
          const plan = plans[planName];
          const isCurrent = planName === currentPlan;
          return (
            <div
              key={planName}
              className={`border rounded-lg p-6 flex flex-col ${isCurrent ? 'border-blue-600 shadow-lg' : 'border-gray-300'}`}
            >
              <h4 className={`text-2xl font-bold mb-2 ${isCurrent ? 'text-blue-600' : 'text-gray-800'}`}>{planName}</h4>
              <p className="text-4xl font-extrabold mb-4">
                ${plan.price.toFixed(2)}
                <span className="text-base font-normal text-gray-500">/mes</span>
              </p>
              <ul className="text-gray-700 mb-6 flex-grow">
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {benefit}
                  </li>
                ))}
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Animales: {plan.maxAnimals === Infinity ? 'Ilimitados' : plan.maxAnimals}
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Empleados: {plan.maxEmployees === Infinity ? 'Ilimitados' : plan.maxEmployees}
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Productos: {plan.maxInventoryItems === Infinity ? 'Ilimitados' : plan.maxInventoryItems}
                </li>
              </ul>
              <button
                onClick={() => onUpdateSubscription(planName)}
                disabled={isCurrent}
                className={`w-full py-2 rounded-lg transition-colors ${isCurrent ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isCurrent ? 'Plan Actual' : 'Seleccionar Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;