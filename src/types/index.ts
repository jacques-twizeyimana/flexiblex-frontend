export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  startDate: string;
  salary: number;
  status: "active" | "inactive";
  employmentType: "full-time" | "part-time" | "seasonal";
}

export interface PayrollConfig {
  payPeriod: "weekly" | "biweekly" | "monthly";
  taxRate: number;
  overtimeRate: number;
}

export interface TimeRecord {
  employeeId: string;
  date: string;
  hoursWorked: number;
  overtime: number;
  leave: string | null;
}

export interface Benefit {
  id: string;
  name: string;
  type: "health" | "retirement" | "insurance";
  amount: number;
  deductionType: "percentage" | "fixed";
}

export interface CompanyConfig {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logo: string;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  currency: string;
  timezone: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "manager" | "user";
  companyId: string;
  createdAt: string;
}
