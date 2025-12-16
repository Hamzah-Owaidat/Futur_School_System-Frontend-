"use client";

import React, { useState } from "react";
import ReusableTable, { Column, ActionHandlers } from "@/components/tables/ReusableTable";
import { ToggleSwitch } from "@/components/ui/toggle/ToggleSwitch";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

// Class interface based on the provided data structure
interface Class {
  id: number;
  class_name: string;
  class_code: string;
  grade_level: number;
  section: string;
  capacity: number;
  room_number: string;
  academic_year: string;
  teacher_id: number;
  is_active: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  teacher_first_name: string;
  teacher_last_name: string;
  teacher_code: string;
  student_count: number;
}

// Mock data - Replace this with actual API call
const mockClasses: Class[] = [
  {
    id: 1,
    class_name: "gradee 1-A",
    class_code: "G1A",
    grade_level: 1,
    section: "A",
    capacity: 30,
    room_number: "101",
    academic_year: "2024-2025",
    teacher_id: 2,
    is_active: 0,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T13:40:06.000Z",
    teacher_first_name: "Sarah",
    teacher_last_name: "Johnson",
    teacher_code: "EMP002",
    student_count: 2,
  },
  {
    id: 2,
    class_name: "gradee 2-B",
    class_code: "G2B",
    grade_level: 2,
    section: "B",
    capacity: 25,
    room_number: "102",
    academic_year: "2024-2025",
    teacher_id: 1,
    is_active: 1,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T13:40:06.000Z",
    teacher_first_name: "John",
    teacher_last_name: "Doe",
    teacher_code: "EMP001",
    student_count: 15,
  },
  {
    id: 3,
    class_name: "gradee 3-C",
    class_code: "G3C",
    grade_level: 3,
    section: "C",
    capacity: 28,
    room_number: "103",
    academic_year: "2024-2025",
    teacher_id: 2,
    is_active: 1,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T12:03:36.000Z",
    updated_at: "2025-12-03T13:40:06.000Z",
    teacher_first_name: "Sarah",
    teacher_last_name: "Johnson",
    teacher_code: "EMP002",
    student_count: 20,
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

export default function ClassesPage() {
  // TODO: Replace with actual data fetching
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const addModal = useModal();
  const editModal = useModal();

  // Handle toggle active status
  const handleToggleActive = (classId: number, newStatus: boolean) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? { ...cls, is_active: newStatus ? 1 : 0 }
          : cls
      )
    );
    // TODO: Call API to update class status
    // updateClassStatus(classId, newStatus ? 1 : 0);
  };

  // Handle add class
  const handleAddClass = () => {
    setSelectedClass(null);
    setIsEditMode(false);
    addModal.openModal();
  };

  // Handle edit class
  const handleEditClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsEditMode(true);
    editModal.openModal();
  };

  // Handle save class (both add and edit)
  const handleSaveClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // TODO: Call API to save class
    console.log("Saving class:", Object.fromEntries(formData));
    
    // Close modal
    if (isEditMode) {
      editModal.closeModal();
    } else {
      addModal.closeModal();
    }
  };

  // Column definitions
  const columns: Column<Class>[] = [
    {
      key: "class_code",
      label: "Class Code",
      sortable: true,
      width: "100px",
      minWidth: "100px",
    },
    {
      key: "class_name",
      label: "Class Name",
      sortable: true,
      width: "150px",
      minWidth: "150px",
    },
    {
      key: "grade_level",
      label: "Grade Level",
      sortable: true,
      width: "110px",
      minWidth: "110px",
    },
    {
      key: "section",
      label: "Section",
      sortable: true,
      width: "100px",
      minWidth: "100px",
    },
    {
      key: "capacity",
      label: "Capacity",
      sortable: true,
      width: "100px",
      minWidth: "100px",
    },
    {
      key: "student_count",
      label: "Students",
      sortable: true,
      width: "100px",
      minWidth: "100px",
      render: (value, row) => (
        <span>
          {value} / {row.capacity}
        </span>
      ),
    },
    {
      key: "room_number",
      label: "Room",
      sortable: true,
      width: "100px",
      minWidth: "100px",
    },
    {
      key: "academic_year",
      label: "Academic Year",
      sortable: true,
      width: "140px",
      minWidth: "140px",
    },
    {
      key: "teacher_first_name",
      label: "Teacher",
      sortable: true,
      width: "180px",
      minWidth: "150px",
      maxWidth: "200px",
      render: (value, row) => (
        <span>
          {row.teacher_first_name} {row.teacher_last_name}
        </span>
      ),
    },
    {
      key: "teacher_code",
      label: "Teacher Code",
      sortable: true,
      width: "120px",
      minWidth: "120px",
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
  const actions: ActionHandlers<Class> = {
    onView: (classItem) => {
      console.log("View class:", classItem);
      // TODO: Navigate to class detail page or open view modal
      alert(`Viewing: ${classItem.class_name}`);
    },
    onEdit: (classItem) => {
      handleEditClass(classItem);
    },
    onDelete: (classItem) => {
      console.log("Delete class:", classItem);
      // TODO: Show confirmation dialog and delete
      if (
        confirm(
          `Are you sure you want to delete ${classItem.class_name}?`
        )
      ) {
        // TODO: Perform delete operation
        alert(`Deleted: ${classItem.class_code}`);
      }
    },
    onCopyId: (classItem) => {
      // Copy class code to clipboard
      navigator.clipboard.writeText(classItem.class_code);
      alert(`Copied: ${classItem.class_code}`);
    },
    // Example of custom actions - each page can add their own
    customActions: [
      {
        label: "View Students",
        onClick: (classItem) => {
          alert(`Viewing students in: ${classItem.class_name}`);
        },
      },
      {
        label: "Assign Teacher",
        onClick: (classItem) => {
          alert(`Assigning teacher to: ${classItem.class_name}`);
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
            Classes
          </h1>
          <p className="text-theme-sm mt-1" style={{ color: "var(--theme-text-secondary)" }}>
            Manage and view all classes in the system
          </p>
        </div>
        <Button onClick={handleAddClass} size="md" variant="primary">
          Add Class
        </Button>
      </div>

      {/* Classes Table */}
      <ReusableTable
        data={classes}
        columns={columns}
        actions={actions}
      />

      {/* Add Class Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        className="max-w-[700px] m-4 p-6 lg:p-10"
      >
        <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)] pr-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--theme-text-primary)" }}>
              Add Class
            </h2>
            <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Fill in the details to add a new class to the system.
            </p>
          </div>
          <form onSubmit={handleSaveClass} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>Class Name</Label>
                <Input type="text" name="class_name" placeholder="Enter class name" required />
              </div>
              <div>
                <Label>Class Code</Label>
                <Input type="text" name="class_code" placeholder="Enter class code" required />
              </div>
              <div>
                <Label>Grade Level</Label>
                <Input type="number" name="grade_level" placeholder="Enter grade level" min="1" required />
              </div>
              <div>
                <Label>Section</Label>
                <Input type="text" name="section" placeholder="Enter section" required />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input type="number" name="capacity" placeholder="Enter capacity" min="1" required />
              </div>
              <div>
                <Label>Room Number</Label>
                <Input type="text" name="room_number" placeholder="Enter room number" required />
              </div>
              <div>
                <Label>Academic Year</Label>
                <Input type="text" name="academic_year" placeholder="e.g., 2024-2025" required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={addModal.closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Class
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Class Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-w-[700px] m-4 p-6 lg:p-10"
      >
        <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)] pr-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--theme-text-primary)" }}>
              Edit Class
            </h2>
            <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Update the class information below.
            </p>
          </div>
          <form onSubmit={handleSaveClass} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>Class Name</Label>
                <Input 
                  type="text" 
                  name="class_name" 
                  defaultValue={selectedClass?.class_name || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Class Code</Label>
                <Input 
                  type="text" 
                  name="class_code" 
                  defaultValue={selectedClass?.class_code || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Grade Level</Label>
                <Input 
                  type="number" 
                  name="grade_level" 
                  defaultValue={selectedClass?.grade_level || ""} 
                  min="1" 
                  required 
                />
              </div>
              <div>
                <Label>Section</Label>
                <Input 
                  type="text" 
                  name="section" 
                  defaultValue={selectedClass?.section || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input 
                  type="number" 
                  name="capacity" 
                  defaultValue={selectedClass?.capacity || ""} 
                  min="1" 
                  required 
                />
              </div>
              <div>
                <Label>Room Number</Label>
                <Input 
                  type="text" 
                  name="room_number" 
                  defaultValue={selectedClass?.room_number || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Academic Year</Label>
                <Input 
                  type="text" 
                  name="academic_year" 
                  defaultValue={selectedClass?.academic_year || ""} 
                  required 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={editModal.closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Class
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}


