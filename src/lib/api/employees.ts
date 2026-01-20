/**
 * Example API service file for Employees
 * This demonstrates how to use the axios setup
 */

import { api } from "./axios";

// Employee interface
export interface Employee {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  hire_date: string;
  salary: string;
  role_id: number;
  is_active: number;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
  role_name?: string;
}

// Create Employee DTO (Data Transfer Object)
export interface CreateEmployeeDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  date_of_birth: string;
  gender: "male" | "female";
  address: string;
  hire_date: string;
  salary: number;
  role_id: number;
}

// Update Employee DTO
export interface UpdateEmployeeDTO extends Partial<CreateEmployeeDTO> {
  is_active?: number;
}

// Employee API Service
export const employeeApi = {
  // Get all employees
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get("/employees");
    const payload: any = response.data;

    // Expected shape:
    // { success: true, message: string, data: { employees: Employee[], pagination: {...} } }
    if (Array.isArray(payload?.data?.employees)) {
      return payload.data.employees as Employee[];
    }

    console.warn("Unexpected employees response shape:", payload);
    return [];
  },

  // Get employee by ID
  getById: async (employeeId: string): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${employeeId}`);
    const payload: any = response.data;
    return (payload?.data ?? payload) as Employee;
  },

  // Create new employee
  create: async (data: CreateEmployeeDTO): Promise<Employee> => {
    const response = await api.post<Employee>("/employees", data);
    const payload: any = response.data;
    
    // Handle different response structures:
    // { data: { employee: {...} } }
    // { data: {...} }
    // { employee: {...} }
    // {...}
    if (payload?.data?.employee) {
      return payload.data.employee as Employee;
    }
    if (payload?.data) {
      return payload.data as Employee;
    }
    if (payload?.employee) {
      return payload.employee as Employee;
    }
    return payload as Employee;
  },

  // Update employee
  update: async (employeeId: string, data: UpdateEmployeeDTO): Promise<Employee> => {
    const response = await api.put<Employee>(`/employees/${employeeId}`, data);
    const payload: any = response.data;
    return (payload?.data ?? payload) as Employee;
  },

  // Delete employee
  delete: async (employeeId: string): Promise<void> => {
    await api.delete(`/employees/${employeeId}`);
  },

  // Update employee status
  updateStatus: async (employeeId: string, isActive: boolean): Promise<Employee> => {
    const response = await api.patch<Employee>(`/employees/${employeeId}/status`, {
      is_active: isActive ? 1 : 0,
    });
    const payload: any = response.data;
    return (payload?.data ?? payload) as Employee;
  },
};

