"use client";

import React, { useState } from "react";
import ReusableTable, { Column, ActionHandlers } from "@/components/tables/ReusableTable";
import { ToggleSwitch } from "@/components/ui/toggle/ToggleSwitch";

// Role interface based on the provided data structure
interface Role {
  id: number;
  name: string;
  description: string;
  is_active: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  employee_count: number;
  permission_count: number;
}

// Mock data - Replace this with actual API call
const mockRoles: Role[] = [
  {
    id: 1,
    name: "admin",
    description: "System Administrator with full access",
    is_active: 1,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T12:03:36.000Z",
    employee_count: 1,
    permission_count: 18,
  },
  {
    id: 2,
    name: "teacher",
    description: "Teacher with classroom management access",
    is_active: 1,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T12:03:36.000Z",
    employee_count: 5,
    permission_count: 12,
  },
  {
    id: 3,
    name: "staff",
    description: "Staff member with limited access",
    is_active: 0,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T12:03:36.000Z",
    employee_count: 3,
    permission_count: 6,
  },
];

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

export default function RolesPage() {
  // TODO: Replace with actual data fetching
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  // Handle toggle active status
  const handleToggleActive = (roleId: number, newStatus: boolean) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? { ...role, is_active: newStatus ? 1 : 0 }
          : role
      )
    );
    // TODO: Call API to update role status
    // updateRoleStatus(roleId, newStatus ? 1 : 0);
  };

  // Column definitions
  const columns: Column<Role>[] = [
    {
      key: "name",
      label: "Role Name",
      sortable: true,
      width: "150px",
      minWidth: "150px",
      render: (value) => (
        <span className="capitalize font-medium">{value}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      width: "300px",
      minWidth: "250px",
      maxWidth: "400px",
    },
    {
      key: "employee_count",
      label: "Employees",
      sortable: true,
      width: "120px",
      minWidth: "120px",
      render: (value) => (
        <span className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: "rgba(70, 95, 255, 0.1)",
            color: "#465fff",
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "permission_count",
      label: "Permissions",
      sortable: true,
      width: "120px",
      minWidth: "120px",
      render: (value) => (
        <span className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: "rgba(11, 165, 236, 0.1)",
            color: "#0ba5ec",
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
              handleToggleActive(row.id, checked);
            }}
          />
        </div>
      ),
    },
  ];

  // Action handlers
  const actions: ActionHandlers<Role> = {
    onView: (role) => {
      console.log("View role:", role);
      // TODO: Navigate to role detail page or open view modal
      alert(`Viewing: ${role.name}`);
    },
    onEdit: (role) => {
      console.log("Edit role:", role);
      // TODO: Navigate to edit page or open edit modal
      alert(`Editing: ${role.name}`);
    },
    onDelete: (role) => {
      console.log("Delete role:", role);
      // TODO: Show confirmation dialog and delete
      if (
        confirm(
          `Are you sure you want to delete ${role.name}? This will affect ${role.employee_count} employee(s).`
        )
      ) {
        // TODO: Perform delete operation
        alert(`Deleted: ${role.name}`);
      }
    },
    onCopyId: (role) => {
      // Copy role ID to clipboard
      navigator.clipboard.writeText(role.id.toString());
      alert(`Copied ID: ${role.id}`);
    },
    // Example of custom actions - each page can add their own
    customActions: [
      {
        label: "Manage Permissions",
        onClick: (role) => {
          alert(`Managing permissions for: ${role.name}`);
        },
      },
      {
        label: "View Employees",
        onClick: (role) => {
          alert(`Viewing ${role.employee_count} employee(s) with role: ${role.name}`);
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
            Roles
          </h1>
          <p className="text-theme-sm mt-1" style={{ color: "var(--theme-text-secondary)" }}>
            Manage and view all roles in the system
          </p>
        </div>
        {/* Add button can be added here */}
      </div>

      {/* Roles Table */}
      <ReusableTable
        data={roles}
        columns={columns}
        actions={actions}
      />
    </div>
  );
}


