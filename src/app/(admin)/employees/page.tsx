"use client";

import React, { useEffect, useState } from "react";
import ReusableTable, { Column, ActionHandlers } from "@/components/tables/ReusableTable";
import { ToggleSwitch } from "@/components/ui/toggle/ToggleSwitch";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { employeeApi, Employee } from "@/lib/api/employees";

// Format date helper
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format currency helper
const formatCurrency = (amount: string): string => {
  const num = parseFloat(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(num);
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const addModal = useModal();
  const editModal = useModal();

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await employeeApi.getAll();
        setEmployees(data);
      } catch (err: any) {
        console.error("Failed to fetch employees:", err);
        setError(err?.message || "Failed to load employees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle toggle active status
  const handleToggleActive = (employeeCode: string, newStatus: boolean) => {
    // Optimistic UI update
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employee_code === employeeCode
          ? { ...emp, is_active: newStatus ? 1 : 0 }
          : emp
      )
    );

    // Persist change to API
    employeeApi
      .updateStatus(employeeCode, newStatus)
      .catch((err) => {
        console.error("Failed to update employee status:", err);
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employee_code === employeeCode
              ? { ...emp, is_active: newStatus ? 0 : 1 }
              : emp
          )
        );
        alert(err?.message || "Failed to update employee status");
      });
  };

  // Handle add employee
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEditMode(false);
    addModal.openModal();
  };

  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditMode(true);
    editModal.openModal();
  };

  // Handle save employee (both add and edit)
  const handleSaveEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const saveEmployee = async () => {
      try {
        setIsSaving(true);
        setError(null);

        if (isEditMode && selectedEmployee) {
          // Update existing employee
          const updated = await employeeApi.update(
            selectedEmployee.employee_code,
            payload as any
          );
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.employee_code === updated.employee_code ? updated : emp
            )
          );
          editModal.closeModal();
        } else {
          // Create new employee
          const created = await employeeApi.create(payload as any);
          setEmployees((prev) => [created, ...prev]);
          addModal.closeModal();
          form.reset();
        }
      } catch (err: any) {
        console.error("Failed to save employee:", err);
        setError(err?.message || "Failed to save employee");
        alert(err?.message || "Failed to save employee");
      } finally {
        setIsSaving(false);
      }
    };

    void saveEmployee();
  };

  // Column definitions
  const columns: Column<Employee>[] = [
  {
    key: "employee_code",
    label: "Employee Code",
    sortable: true,
    width: "120px",
    minWidth: "120px",
  },
  {
    key: "first_name",
    label: "First Name",
    sortable: true,
    width: "130px",
    minWidth: "130px",
  },
  {
    key: "last_name",
    label: "Last Name",
    sortable: true,
    width: "130px",
    minWidth: "130px",
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    width: "200px",
    minWidth: "180px",
    maxWidth: "250px",
  },
  {
    key: "phone",
    label: "Phone",
    sortable: true,
    width: "140px",
    minWidth: "140px",
  },
  {
    key: "date_of_birth",
    label: "Date of Birth",
    sortable: true,
    width: "130px",
    minWidth: "130px",
    render: (value) => formatDate(value),
  },
  {
    key: "gender",
    label: "Gender",
    sortable: true,
    width: "100px",
    minWidth: "100px",
    render: (value) => (
      <span className="capitalize">{value}</span>
    ),
  },
  {
    key: "address",
    label: "Address",
    sortable: true,
    width: "180px",
    minWidth: "150px",
    maxWidth: "250px",
  },
  {
    key: "hire_date",
    label: "Hire Date",
    sortable: true,
    width: "130px",
    minWidth: "130px",
    render: (value) => formatDate(value),
  },
  {
    key: "salary",
    label: "Salary",
    sortable: true,
    width: "120px",
    minWidth: "120px",
    render: (value) => formatCurrency(value),
  },
  {
    key: "role_name",
    label: "Role",
    sortable: true,
    width: "120px",
    minWidth: "120px",
    render: (value) => (
      <span 
        className="capitalize px-3 py-1.5 rounded-lg text-xs font-medium inline-block whitespace-nowrap"
        style={{
          backgroundColor: value.toLowerCase() === "admin" 
            ? "rgba(70, 95, 255, 0.15)" 
            : "rgba(11, 165, 236, 0.15)",
          color: value.toLowerCase() === "admin" 
            ? "#465fff" 
            : "#0ba5ec",
        }}
      >
        {value}
      </span>
    ),
  },
  {
    key: "is_active",
    label: "Active",
    sortable: true,
    width: "100px",
    minWidth: "100px",
    render: (value, row) => (
      <div className="flex justify-center">
        <ToggleSwitch
          checked={value === 1}
          onChange={(checked) => {
            handleToggleActive(row.employee_code, checked);
          }}
        />
      </div>
    ),
  },
  ];

  // Action handlers
  const actions: ActionHandlers<Employee> = {
    onView: (employee) => {
      console.log("View employee:", employee);
      // TODO: Navigate to employee detail page or open view modal
      alert(`Viewing: ${employee.first_name} ${employee.last_name}`);
    },
    onEdit: (employee) => {
      handleEditEmployee(employee);
    },
    onDelete: (employee) => {
      if (
        confirm(
          `Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`
        )
      ) {
        const deleteEmployee = async () => {
          try {
            await employeeApi.delete(employee.employee_code);
            setEmployees((prev) =>
              prev.filter(
                (emp) => emp.employee_code !== employee.employee_code
              )
            );
          } catch (err: any) {
            console.error("Failed to delete employee:", err);
            alert(err?.message || "Failed to delete employee");
          }
        };

        void deleteEmployee();
      }
    },
    onCopyId: (employee) => {
      // Copy employee code to clipboard
      navigator.clipboard.writeText(employee.employee_code);
      alert(`Copied: ${employee.employee_code}`);
    },
    // Example of custom actions - each page can add their own
    customActions: [
      {
        label: "Send Email",
        onClick: (employee) => {
          alert(`Sending email to: ${employee.email}`);
        },
      },
      {
        label: "View Profile",
        onClick: (employee) => {
          alert(`Opening profile for: ${employee.first_name} ${employee.last_name}`);
        },
      },
    ],
  };

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--theme-text-primary)" }}>
            Employees
          </h1>
          <p className="text-theme-sm mt-1" style={{ color: "var(--theme-text-secondary)" }}>
            Manage and view all employees in the system
          </p>
        </div>
        <Button onClick={handleAddEmployee} size="md" variant="primary">
          Add Employee
        </Button>
      </div>

      {/* Employees Table */}
      {error && (
        <p className="text-sm" style={{ color: "var(--theme-text-error, #f04438)" }}>
          {error}
        </p>
      )}
      <ReusableTable
        data={employees}
        columns={columns}
        actions={actions}
      />

      {/* Add Employee Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        className="max-w-[700px] m-4 p-6 lg:p-10"
      >
        <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)] pr-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--theme-text-primary)" }}>
              Add Employee
            </h2>
            <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Fill in the details to add a new employee to the system.
            </p>
          </div>
          <form onSubmit={handleSaveEmployee} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input type="text" name="first_name" placeholder="Enter first name" required />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input type="text" name="last_name" placeholder="Enter last name" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="Enter email address" required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="text" name="phone" placeholder="Enter phone number" required />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" name="date_of_birth" required />
              </div>
              <div>
                <Label>Gender</Label>
                <Input type="text" name="gender" placeholder="Enter gender" required />
              </div>
              <div className="sm:col-span-2">
                <Label>Address</Label>
                <Input type="text" name="address" placeholder="Enter address" required />
              </div>
              <div>
                <Label>Hire Date</Label>
                <Input type="date" name="hire_date" required />
              </div>
              <div>
                <Label>Salary</Label>
                <Input type="number" name="salary" placeholder="Enter salary" step="0.01" required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={addModal.closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                Add Employee
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-w-[700px] m-4 p-6 lg:p-10"
      >
        <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)] pr-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--theme-text-primary)" }}>
              Edit Employee
            </h2>
            <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Update the employee information below.
            </p>
          </div>
          <form onSubmit={handleSaveEmployee} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input 
                  type="text" 
                  name="first_name" 
                  defaultValue={selectedEmployee?.first_name || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input 
                  type="text" 
                  name="last_name" 
                  defaultValue={selectedEmployee?.last_name || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  name="email" 
                  defaultValue={selectedEmployee?.email || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  type="text" 
                  name="phone" 
                  defaultValue={selectedEmployee?.phone || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input 
                  type="date" 
                  name="date_of_birth" 
                  defaultValue={selectedEmployee?.date_of_birth ? new Date(selectedEmployee.date_of_birth).toISOString().split('T')[0] : ""} 
                  required 
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Input 
                  type="text" 
                  name="gender" 
                  defaultValue={selectedEmployee?.gender || ""} 
                  required 
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Address</Label>
                <Input 
                  type="text" 
                  name="address" 
                  defaultValue={selectedEmployee?.address || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Hire Date</Label>
                <Input 
                  type="date" 
                  name="hire_date" 
                  defaultValue={selectedEmployee?.hire_date ? new Date(selectedEmployee.hire_date).toISOString().split('T')[0] : ""} 
                  required 
                />
              </div>
              <div>
                <Label>Salary</Label>
                <Input 
                  type="number" 
                  name="salary" 
                  defaultValue={selectedEmployee?.salary || ""} 
                  step="0.01" 
                  required 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={editModal.closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                Update Employee
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

