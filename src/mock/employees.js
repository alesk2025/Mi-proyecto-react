export const employees = [
  {
    id: 'EMP-001',
    fullName: 'Juan Pérez',
    position: 'Mayordomo',
    startDate: '2020-01-01',
    salary: 1200,
    phone: '555-1234',
    email: 'juan.perez@example.com',
  },
  {
    id: 'EMP-002',
    fullName: 'María García',
    position: 'Veterinaria',
    startDate: '2021-03-10',
    salary: 1800,
    phone: '555-5678',
    email: 'maria.garcia@example.com',
  },
  {
    id: 'EMP-003',
    fullName: 'Pedro López',
    position: 'Obrero',
    startDate: '2022-06-15',
    salary: 900,
    phone: '555-9012',
    email: 'pedro.lopez@example.com',
  },
];

export const mockPayslips = [
  {
    id: 'PS-001',
    employeeId: 'EMP-001',
    period: '2023-01',
    grossSalary: 1200,
    deductions: 150,
    netSalary: 1050,
    dateIssued: '2023-01-31',
  },
  {
    id: 'PS-002',
    employeeId: 'EMP-002',
    period: '2023-01',
    grossSalary: 1800,
    deductions: 200,
    netSalary: 1600,
    dateIssued: '2023-01-31',
  },
];