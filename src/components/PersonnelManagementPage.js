import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PersonnelEmployeeRegistrationForm from './PersonnelManagement/PersonnelEmployeeRegistrationForm';
import PersonnelPayslipManagementForm from './PersonnelManagement/PersonnelPayslipManagementForm';
import PersonnelThirdPartyPaymentForm from './PersonnelManagement/PersonnelThirdPartyPaymentForm';
import PersonnelTaskAssignmentForm from './PersonnelManagement/PersonnelTaskAssignmentForm';
import PersonnelTaskHistoryTable from './PersonnelManagement/PersonnelTaskHistoryTable';
import PersonnelPayslipHistoryTable from './PersonnelManagement/PersonnelPayslipHistoryTable';
import PersonnelThirdPartyPaymentHistoryTable from './PersonnelManagement/PersonnelThirdPartyPaymentHistoryTable';

const PersonnelManagementPage = ({ employees, tasks, onAddEmployee, onSendPayslip, onDeletePayslip, onAssignTask, onDeleteTask, thirdPartyPayments, onAddThirdPartyPayment, onDeleteThirdPartyPayment, payslips, currentUser, animals, logoUrl }) => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    position: '',
    schedule: '',
    salary: '',
  });
  const [payrollData, setPayrollData] = useState({
    employeeId: '',
    grossAmount: '',
    bonuses: '',
    deductions: '',
    observations: '',
    paymentDate: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
  });
  const [thirdPartyPaymentData, setThirdPartyPaymentData] = useState({
    personName: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    appliesTo: 'general', // Default
    targetAnimalId: '', // Default
  });
  const [taskData, setTaskData] = useState({
    employeeId: '',
    taskType: '',
    description: '',
    toolsUsed: '',
    reason: '',
    status: 'pendiente',
  });

  const [showPayslipHistory, setShowPayslipHistory] = useState(false);

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handlePayrollChange = (e) => {
    const { name, value } = e.target;
    setPayrollData({ ...payrollData, [name]: value });
  };

  const handleThirdPartyPaymentChange = (e) => {
    const { name, value } = e.target;
    setThirdPartyPaymentData({ ...thirdPartyPaymentData, [name]: value });
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleAddEmployeeAction = () => {
    const newId = `EMP-${Date.now().toString().slice(-5)}`;
    onAddEmployee({ ...employeeData, id: newId });
    alert(`Empleado ${employeeData.name} registrado.`);
    setEmployeeData({ name: '', email: '', position: '', schedule: '', salary: '' });
  };

  const calculateNetSalary = () => {
    const gross = parseFloat(payrollData.grossAmount) || 0;
    const bonuses = parseFloat(payrollData.bonuses) || 0;
    const deductions = parseFloat(payrollData.deductions) || 0;
    return (gross + bonuses - deductions).toFixed(2);
  };

  const handleSendPayslipAction = () => {
    if (!payrollData.employeeId || !payrollData.grossAmount || !payrollData.paymentDate || !payrollData.startDate || !payrollData.endDate) {
      alert('Por favor, completa todos los campos obligatorios de la ficha de pago.');
      return;
    }
    const netSalary = calculateNetSalary();
    onSendPayslip(payrollData.employeeId, { ...payrollData, netSalary });
    alert(`Ficha de pago para ${payrollData.employeeId} enviada. Salario Neto: $${netSalary}`);
    setPayrollData({ 
      employeeId: '', grossAmount: '', bonuses: '', deductions: '', observations: '',
      paymentDate: new Date().toISOString().split('T')[0],
      startDate: '', endDate: '',
    });
  };

  const handleAddThirdPartyPaymentAction = (data) => { // Recibe data completa
    if (!data.personName || !data.amount || !data.date) {
      alert('Por favor, completa todos los campos obligatorios del pago a tercero.');
      return;
    }
    onAddThirdPartyPayment(data); // Pasa la data completa
    alert(`Pago a ${data.personName} registrado.`);
    setThirdPartyPaymentData({ personName: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], appliesTo: 'general', targetAnimalId: '' });
  };

  const handleAssignTaskAction = () => {
    onAssignTask(taskData.employeeId, taskData);
    alert(`Tarea asignada a ${taskData.employeeId}.`);
    setTaskData({ employeeId: '', taskType: '', description: '', toolsUsed: '', reason: '', status: 'pendiente' });
  };

  // --- Función para generar PDF de Ficha de Pago o Asignación de Tarea ---
   const handlegeneratePdf = (type, data) => {
    const farmName = currentUser?.farmName || 'Mi Finca Ganadera';
    const adminName = currentUser?.fullName || 'Administrador';
    const defaultLogo = 'https://via.placeholder.com/70x70?text=LOGO'; // Default logo if none uploaded

    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '15mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '10pt';
    tempDiv.style.color = '#333';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.backgroundColor = '#fff';

    let contentHTML = '';

    if (type === 'Ficha de Pago') {
      const employee = employees.find(emp => emp.id === data.employeeId);

      contentHTML = `
        <div style="border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background-color: #2c3e50; color: #ffffff; padding: 25px 30px; display: flex; justify-content: space-between; align-items: center;">
            <img src="${logoUrl || defaultLogo}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #fff;" alt="Logo Finca">
            <div style="text-align: right;">
              <h1 style="margin: 0; font-size: 28pt; font-weight: bold; letter-spacing: 1px;">${farmName}</h1>
              <p style="margin: 5px 0 0 0; font-size: 14pt; opacity: 0.9;">Ficha de Pago Oficial</p>
            </div>
          </div>

          <!-- Employee and Payslip Details -->
          <div style="padding: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
              <div>
                <h2 style="font-size: 16pt; margin: 0 0 10px 0; color: #333;">Detalles del Empleado</h2>
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${employee?.name || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Correo:</strong> ${employee?.email || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Cargo:</strong> ${employee?.position || 'N/A'}</p>
              </div>
              <div style="text-align: right;">
                <h2 style="font-size: 16pt; margin: 0 0 10px 0; color: #333;">Información de la Ficha</h2>
                <p style="margin: 5px 0;"><strong>ID Ficha:</strong> <span style="font-weight: bold; color: #007bff;">${data.id || 'N/A'}</span></p>
                <p style="margin: 5px 0;"><strong>Fecha de Emisión:</strong> ${data.paymentDate}</p>
                <p style="margin: 5px 0;"><strong>Período:</strong> ${data.startDate} al ${data.endDate}</p>
              </div>
            </div>

            <!-- Payment Breakdown Table -->
            <h3 style="font-size: 18pt; margin: 0 0 15px 0; color: #333; text-align: center;">Desglose de Pago</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 12px 15px; border: 1px solid #e0e0e0; text-align: left; font-weight: bold; color: #555;">Concepto</th>
                  <th style="padding: 12px 15px; border: 1px solid #e0e0e0; text-align: right; font-weight: bold; color: #555;">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px 15px; border: 1px solid #e0e0e0;">Monto Bruto</td>
                  <td style="padding: 10px 15px; border: 1px solid #e0e0e0; text-align: right;">$${parseFloat(data.grossAmount || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; border: 1px solid #e0e0e0;">Bonificaciones</td>
                  <td style="padding: 10px 15px; border: 1px solid #e0e0e0; text-align: right;">$${parseFloat(data.bonuses || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 15px; border: 1px solid #e0e0e0;">Deducciones</td>
                  <td style="padding: 10px 15px; border: 1px solid #e0e0e0; text-align: right;">-$${parseFloat(data.deductions || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <!-- Net Amount Box -->
            <div style="background-color: #e6f7ff; border: 1px solid #91d5ff; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
              <p style="font-size: 16pt; margin: 0 0 10px 0; color: #0056b3;">Total Neto a Pagar</p>
              <p style="font-size: 32pt; font-weight: bold; color: #007bff; margin: 0;">$${parseFloat(data.netSalary || 0).toFixed(2)}</p>
            </div>

            <p style="margin: 0 0 20px 0; color: #555;"><strong>Observaciones:</strong> ${data.observations || 'N/A'}</p>

            <!-- Signature/Approval Area -->
            <div style="display: flex; justify-content: space-around; margin-top: 50px; text-align: center;">
              <div>
                <p style="border-top: 1px solid #ccc; padding-top: 10px; margin: 0;">Firma del Empleado</p>
              </div>
              <div>
                <p style="border-top: 1px solid #ccc; padding-top: 10px; margin: 0;">Firma del Administrador</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; color: #777; padding: 15px 30px; font-size: 9pt; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="margin: 0;">Generado por Campo Inteligente | Administrador: ${adminName}</p>
            <p style="margin: 5px 0 0 0;">Fecha de Generación: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0 0 0;">Contacto: info@campointeligente.com</p>
          </div>
        </div>
      `;
    } else if (type === 'Asignación de Tarea') {
      const employee = employees.find(emp => emp.id === data.employeeId);

      contentHTML = `
        <div style="border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background-color: #2c3e50; color: #ffffff; padding: 25px 30px; display: flex; justify-content: space-between; align-items: center;">
            <img src="${logoUrl || defaultLogo}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #fff;" alt="Logo Finca">
            <div style="text-align: right;">
              <h1 style="margin: 0; font-size: 28pt; font-weight: bold; letter-spacing: 1px;">${farmName}</h1>
              <p style="margin: 5px 0 0 0; font-size: 14pt; opacity: 0.9;">Asignación de Tarea</p>
            </div>
          </div>

          <!-- Task Details -->
          <div style="padding: 30px;">
            <h2 style="font-size: 18pt; margin: 0 0 20px 0; color: #333; text-align: center;">Detalles de la Tarea Asignada</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tbody>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Empleado:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${employee?.name || 'N/A'}</td></tr>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Tipo de Tarea:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${data.taskType}</td></tr>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Descripción:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${data.description}</td></tr>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Herramientas:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${data.toolsUsed || 'N/A'}</td></tr>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Motivo:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${data.reason || 'No especificado'}</td></tr>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Estado:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;"><span style="font-weight: bold; color: ${data.status === 'completada' ? '#28a745' : data.status === 'en_progreso' ? '#ffc107' : '#6c757d'};">${data.status}</span></td></tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; color: #777; padding: 15px 30px; font-size: 9pt; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="margin: 0;">Generado por Campo Inteligente | Administrador: ${adminName}</p>
            <p style="margin: 5px 0 0 0;">Fecha de Generación: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0 0 0;">Contacto: info@campointeligente.com</p>
          </div>
        </div>
      `;
    } else if (type === 'Pago a Tercero') {
      const targetAnimal = data.appliesTo === 'specific' ? animals.find(a => a.id === data.targetAnimalId) : null;
      const appliesToText = data.appliesTo === 'general' ? 'Todos los animales (General)' : (targetAnimal ? `${targetAnimal.name} (${targetAnimal.id})` : 'Animal Específico (No encontrado)');

      contentHTML = `
        <div style="border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background-color: #2c3e50; color: #ffffff; padding: 25px 30px; display: flex; justify-content: space-between; align-items: center;">
            <img src="${logoUrl || defaultLogo}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #fff;" alt="Logo Finca">
            <div style="text-align: right;">
              <h1 style="margin: 0; font-size: 28pt; font-weight: bold; letter-spacing: 1px;">${farmName}</h1>
              <p style="margin: 5px 0 0 0; font-size: 14pt; opacity: 0.9;">Comprobante de Pago a Tercero</p>
            </div>
          </div>

          <!-- Payment Details -->
          <div style="padding: 30px;">
            <h2 style="font-size: 18pt; margin: 0 0 20px 0; color: #333; text-align: center;">Detalles del Pago</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tbody>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Pagado a:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${data.personName}</td></tr>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Descripción:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${data.description || 'No especificado'}</td></tr>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Fecha de Pago:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${data.date}</td></tr>
                <tr><td style="padding: 10px 15px; border: 1px solid #e0e0e0; font-weight: bold;">Aplicado a:</td><td style="padding: 10px 15px; border: 1px solid #e0e0e0;">${appliesToText}</td></tr>
              </tbody>
            </table>

            <div style="background-color: #e6f7ff; border: 1px solid #91d5ff; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
              <p style="font-size: 16pt; margin: 0 0 10px 0; color: #0056b3;">Monto Total Pagado</p>
              <p style="font-size: 32pt; font-weight: bold; color: #007bff; margin: 0;">$${parseFloat(data.amount || 0).toFixed(2)}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; color: #777; padding: 15px 30px; font-size: 9pt; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="margin: 0;">Generado por Campo Inteligente | Administrador: ${adminName}</p>
            <p style="margin: 5px 0 0 0;">Fecha de Generación: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0 0 0;">Contacto: info@campointeligente.com</p>
          </div>
        </div>
      `;
    }

    tempDiv.innerHTML = contentHTML;
    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ficha_pago_${data.id || data.employeeId || 'sin_id'}.pdf`);
      document.body.removeChild(tempDiv);
    });
  };

  // --- Agrupar fichas de pago por mes ---
  const groupedPayslips = payslips.reduce((acc, ps) => {
    const date = new Date(ps.paymentDate);
    const monthYear = `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(ps);
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Gestión de Personal Integrada</h3>

      <PersonnelEmployeeRegistrationForm
        employeeData={employeeData}
        handleEmployeeChange={handleEmployeeChange}
        handleAddEmployee={handleAddEmployeeAction}
      />

      <PersonnelPayslipManagementForm
        payrollData={payrollData}
        handlePayrollChange={handlePayrollChange}
        handleSendPayslipAction={handleSendPayslipAction}
        employees={employees}
        calculateNetSalary={calculateNetSalary}
      />

      <PersonnelThirdPartyPaymentForm
        thirdPartyPaymentData={thirdPartyPaymentData}
        handleThirdPartyPaymentChange={handleThirdPartyPaymentChange}
        handleAddThirdPartyPaymentAction={handleAddThirdPartyPaymentAction}
        animals={animals} // Pasar la lista de animales
      />

      <PersonnelTaskAssignmentForm
        taskData={taskData}
        handleTaskChange={handleTaskChange}
        handleAssignTaskAction={handleAssignTaskAction}
        employees={employees}
      />

      <PersonnelTaskHistoryTable
        tasks={tasks}
        employees={employees}
        onDeleteTask={onDeleteTask}
        handlegeneratePdf={handlegeneratePdf}
      />

      <PersonnelPayslipHistoryTable
        groupedPayslips={groupedPayslips}
        employees={employees}
        onDeletePayslip={onDeletePayslip}
        handlegeneratePdf={handlegeneratePdf}
        showPayslipHistory={showPayslipHistory}
        setShowPayslipHistory={setShowPayslipHistory}
      />

      <PersonnelThirdPartyPaymentHistoryTable
        thirdPartyPayments={thirdPartyPayments}
        onDeleteThirdPartyPayment={onDeleteThirdPartyPayment}
        handlegeneratePdf={handlegeneratePdf}
        animals={animals} // Pasar la lista de animales
      />
    </div>
  );
};

export default PersonnelManagementPage;