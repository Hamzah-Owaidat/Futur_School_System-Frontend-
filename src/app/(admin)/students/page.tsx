"use client";

import React, { useState } from "react";
import ReusableTable, { Column, ActionHandlers } from "@/components/tables/ReusableTable";
import { ToggleSwitch } from "@/components/ui/toggle/ToggleSwitch";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

// Student interface based on the provided data structure
interface Student {
  id: number;
  student_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  enrollment_date: string;
  class_id: number;
  is_active: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  class_name: string;
  class_code: string;
  grade_level: number;
}

// Mock data - Replace this with actual API call
const mockStudents: Student[] = [
  {
    id: 1,
    student_code: "STU001",
    first_name: "Alice",
    last_name: "Williams",
    email: "alice.williams@student.futurschool.com",
    phone: "111-222-3333",
    date_of_birth: "2015-05-14T21:00:00.000Z",
    gender: "female",
    address: "456 Student St",
    parent_name: "John Williams",
    parent_phone: "111-222-3334",
    parent_email: "john.williams@email.com",
    enrollment_date: "2024-08-31T21:00:00.000Z",
    class_id: 1,
    is_active: 1,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T13:56:00.000Z",
    updated_at: "2025-12-03T13:56:00.000Z",
    class_name: "gradee 1-A",
    class_code: "G1A",
    grade_level: 1,
  },
  {
    id: 2,
    student_code: "STU002",
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob.johnson@student.futurschool.com",
    phone: "222-333-4444",
    date_of_birth: "2014-08-20T21:00:00.000Z",
    gender: "male",
    address: "789 Student Ave",
    parent_name: "Mary Johnson",
    parent_phone: "222-333-4445",
    parent_email: "mary.johnson@email.com",
    enrollment_date: "2024-08-31T21:00:00.000Z",
    class_id: 1,
    is_active: 1,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T13:56:00.000Z",
    updated_at: "2025-12-03T13:56:00.000Z",
    class_name: "gradee 1-A",
    class_code: "G1A",
    grade_level: 1,
  },
  {
    id: 6,
    student_code: "STU006",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@student.futurschool.com",
    phone: "111-222-3333",
    date_of_birth: "2015-05-14T21:00:00.000Z",
    gender: "female",
    address: "456 Student St",
    parent_name: "John Smith",
    parent_phone: "111-222-3334",
    parent_email: "john.smith@email.com",
    enrollment_date: "2024-08-31T21:00:00.000Z",
    class_id: 1,
    is_active: 1,
    created_by: 1,
    updated_by: 1,
    created_at: "2025-12-03T13:56:00.000Z",
    updated_at: "2025-12-03T13:56:00.000Z",
    class_name: "gradee 1-A",
    class_code: "G1A",
    grade_level: 1,
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

export default function StudentsPage() {
  // TODO: Replace with actual data fetching
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const addModal = useModal();
  const editModal = useModal();

  // Handle toggle active status
  const handleToggleActive = (studentId: number, newStatus: boolean) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, is_active: newStatus ? 1 : 0 }
          : student
      )
    );
    // TODO: Call API to update student status
    // updateStudentStatus(studentId, newStatus ? 1 : 0);
  };

  // Handle add student
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsEditMode(false);
    addModal.openModal();
  };

  // Handle edit student
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditMode(true);
    editModal.openModal();
  };

  // Handle save student (both add and edit)
  const handleSaveStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // TODO: Call API to save student
    console.log("Saving student:", Object.fromEntries(formData));
    
    // Close modal
    if (isEditMode) {
      editModal.closeModal();
    } else {
      addModal.closeModal();
    }
  };

  // Column definitions
  const columns: Column<Student>[] = [
    {
      key: "student_code",
      label: "Student Code",
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
      width: "220px",
      minWidth: "200px",
      maxWidth: "280px",
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
      key: "parent_name",
      label: "Parent Name",
      sortable: true,
      width: "150px",
      minWidth: "150px",
    },
    {
      key: "parent_phone",
      label: "Parent Phone",
      sortable: true,
      width: "140px",
      minWidth: "140px",
    },
    {
      key: "parent_email",
      label: "Parent Email",
      sortable: true,
      width: "200px",
      minWidth: "180px",
      maxWidth: "250px",
    },
    {
      key: "enrollment_date",
      label: "Enrollment Date",
      sortable: true,
      width: "150px",
      minWidth: "150px",
      render: (value) => formatDate(value),
    },
    {
      key: "class_name",
      label: "Class",
      sortable: true,
      width: "150px",
      minWidth: "150px",
      render: (value, row) => (
        <span>
          {value} ({row.class_code})
        </span>
      ),
    },
    {
      key: "grade_level",
      label: "Grade",
      sortable: true,
      width: "100px",
      minWidth: "100px",
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
  const actions: ActionHandlers<Student> = {
    onView: (student) => {
      console.log("View student:", student);
      // TODO: Navigate to student detail page or open view modal
      alert(`Viewing: ${student.first_name} ${student.last_name}`);
    },
    onEdit: (student) => {
      handleEditStudent(student);
    },
    onDelete: (student) => {
      console.log("Delete student:", student);
      // TODO: Show confirmation dialog and delete
      if (
        confirm(
          `Are you sure you want to delete ${student.first_name} ${student.last_name}?`
        )
      ) {
        // TODO: Perform delete operation
        alert(`Deleted: ${student.student_code}`);
      }
    },
    onCopyId: (student) => {
      // Copy student code to clipboard
      navigator.clipboard.writeText(student.student_code);
      alert(`Copied: ${student.student_code}`);
    },
    // Example of custom actions - each page can add their own
    customActions: [
      {
        label: "View Parent Info",
        onClick: (student) => {
          alert(`Parent: ${student.parent_name}\nPhone: ${student.parent_phone}\nEmail: ${student.parent_email}`);
        },
      },
      {
        label: "Change Class",
        onClick: (student) => {
          alert(`Changing class for: ${student.first_name} ${student.last_name}`);
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
            Students
          </h1>
          <p className="text-theme-sm mt-1" style={{ color: "var(--theme-text-secondary)" }}>
            Manage and view all students in the system
          </p>
        </div>
        <Button onClick={handleAddStudent} size="md" variant="primary">
          Add Student
        </Button>
      </div>

      {/* Students Table */}
      <ReusableTable
        data={students}
        columns={columns}
        actions={actions}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        className="max-w-[700px] m-4 p-6 lg:p-10"
      >
        <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)] pr-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--theme-text-primary)" }}>
              Add Student
            </h2>
            <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Fill in the details to add a new student to the system.
            </p>
          </div>
          <form onSubmit={handleSaveStudent} className="space-y-5">
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
                <Label>Parent Name</Label>
                <Input type="text" name="parent_name" placeholder="Enter parent name" required />
              </div>
              <div>
                <Label>Parent Phone</Label>
                <Input type="text" name="parent_phone" placeholder="Enter parent phone" required />
              </div>
              <div>
                <Label>Parent Email</Label>
                <Input type="email" name="parent_email" placeholder="Enter parent email" required />
              </div>
              <div>
                <Label>Enrollment Date</Label>
                <Input type="date" name="enrollment_date" required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={addModal.closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Student
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-w-[700px] m-4 p-6 lg:p-10"
      >
        <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)] pr-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--theme-text-primary)" }}>
              Edit Student
            </h2>
            <p className="text-sm" style={{ color: "var(--theme-text-secondary)" }}>
              Update the student information below.
            </p>
          </div>
          <form onSubmit={handleSaveStudent} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input 
                  type="text" 
                  name="first_name" 
                  defaultValue={selectedStudent?.first_name || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input 
                  type="text" 
                  name="last_name" 
                  defaultValue={selectedStudent?.last_name || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  name="email" 
                  defaultValue={selectedStudent?.email || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  type="text" 
                  name="phone" 
                  defaultValue={selectedStudent?.phone || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input 
                  type="date" 
                  name="date_of_birth" 
                  defaultValue={selectedStudent?.date_of_birth ? new Date(selectedStudent.date_of_birth).toISOString().split('T')[0] : ""} 
                  required 
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Input 
                  type="text" 
                  name="gender" 
                  defaultValue={selectedStudent?.gender || ""} 
                  required 
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Address</Label>
                <Input 
                  type="text" 
                  name="address" 
                  defaultValue={selectedStudent?.address || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Parent Name</Label>
                <Input 
                  type="text" 
                  name="parent_name" 
                  defaultValue={selectedStudent?.parent_name || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Parent Phone</Label>
                <Input 
                  type="text" 
                  name="parent_phone" 
                  defaultValue={selectedStudent?.parent_phone || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Parent Email</Label>
                <Input 
                  type="email" 
                  name="parent_email" 
                  defaultValue={selectedStudent?.parent_email || ""} 
                  required 
                />
              </div>
              <div>
                <Label>Enrollment Date</Label>
                <Input 
                  type="date" 
                  name="enrollment_date" 
                  defaultValue={selectedStudent?.enrollment_date ? new Date(selectedStudent.enrollment_date).toISOString().split('T')[0] : ""} 
                  required 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={editModal.closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Student
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}


