"use client";

import React, { useState } from "react";
import ReusableTable, { Column, ActionHandlers } from "@/components/tables/ReusableTable";

// Permission interface based on the provided data structure
interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  role_count: number;
}

// Mock data - Replace this with actual API call
const mockPermissions: Permission[] = [
  {
    id: 1,
    name: "create_class",
    resource: "class",
    action: "create",
    description: "Create new class",
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T13:36:54.000Z",
    role_count: 4,
  },
  {
    id: 2,
    name: "edit_class",
    resource: "class",
    action: "edit",
    description: "Edit existing class",
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T13:36:54.000Z",
    role_count: 3,
  },
  {
    id: 3,
    name: "delete_class",
    resource: "class",
    action: "delete",
    description: "Delete class",
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T13:36:54.000Z",
    role_count: 2,
  },
  {
    id: 4,
    name: "view_student",
    resource: "student",
    action: "view",
    description: "View student information",
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T13:36:54.000Z",
    role_count: 5,
  },
  {
    id: 13,
    name: "create_class",
    resource: "class",
    action: "create",
    description: "Create new class",
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T13:36:54.000Z",
    role_count: 4,
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

export default function PermissionsPage() {
  // TODO: Replace with actual data fetching
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);

  // Column definitions
  const columns: Column<Permission>[] = [
    {
      key: "name",
      label: "Permission Name",
      sortable: true,
      width: "180px",
      minWidth: "180px",
      render: (value) => (
        <span className="font-medium" style={{ color: "var(--theme-text-primary)" }}>
          {value.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "resource",
      label: "Resource",
      sortable: true,
      width: "120px",
      minWidth: "120px",
      render: (value) => (
        <span className="capitalize px-2 py-1 rounded text-xs font-medium"
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
      key: "action",
      label: "Action",
      sortable: true,
      width: "100px",
      minWidth: "100px",
      render: (value) => (
        <span className="capitalize px-2 py-1 rounded text-xs font-medium"
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
      key: "description",
      label: "Description",
      sortable: true,
      width: "250px",
      minWidth: "200px",
      maxWidth: "350px",
    },
    {
      key: "role_count",
      label: "Roles",
      sortable: true,
      width: "100px",
      minWidth: "100px",
      render: (value) => (
        <span className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: "rgba(18, 183, 106, 0.1)",
            color: "#12b76a",
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  // Action handlers
  const actions: ActionHandlers<Permission> = {
    onView: (permission) => {
      console.log("View permission:", permission);
      // TODO: Navigate to permission detail page or open view modal
      alert(`Viewing: ${permission.name}`);
    },
    onEdit: (permission) => {
      console.log("Edit permission:", permission);
      // TODO: Navigate to edit page or open edit modal
      alert(`Editing: ${permission.name}`);
    },
    onDelete: (permission) => {
      console.log("Delete permission:", permission);
      // TODO: Show confirmation dialog and delete
      if (
        confirm(
          `Are you sure you want to delete ${permission.name}? This will affect ${permission.role_count} role(s).`
        )
      ) {
        // TODO: Perform delete operation
        alert(`Deleted: ${permission.name}`);
      }
    },
    onCopyId: (permission) => {
      // Copy permission ID to clipboard
      navigator.clipboard.writeText(permission.id.toString());
      alert(`Copied ID: ${permission.id}`);
    },
    // Example of custom actions - each page can add their own
    customActions: [
      {
        label: "View Roles",
        onClick: (permission) => {
          alert(`Viewing ${permission.role_count} role(s) with permission: ${permission.name}`);
        },
      },
      {
        label: "Manage Access",
        onClick: (permission) => {
          alert(`Managing access for: ${permission.name}`);
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
            Permissions
          </h1>
          <p className="text-theme-sm mt-1" style={{ color: "var(--theme-text-secondary)" }}>
            Manage and view all permissions in the system
          </p>
        </div>
        {/* Add button can be added here */}
      </div>

      {/* Permissions Table */}
      <ReusableTable
        data={permissions}
        columns={columns}
        actions={actions}
      />
    </div>
  );
}


