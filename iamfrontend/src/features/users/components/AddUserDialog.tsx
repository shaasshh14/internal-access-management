import { useEffect, useState } from "react";
import Modal from "@/shared/components/Modal/Modal";
import Input from "@/shared/components/Input/Input";
import Select from "@/shared/components/Select/Select";
import Button from "@/shared/components/Button/Button";
import { userService } from "@/shared/services/userService";
import type { User, UserStatus } from "@/types";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (user: User) => void;
}

interface FormState {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: string;
  status: UserStatus;
}

const initialState: FormState = {
  name: "",
  email: "",
  employeeId: "",
  department: "",
  role: "user",
  status: "ACTIVE",
};

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "guest", label: "Guest" },
  { value: "manager", label: "Manager" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddUserDialog({ isOpen, onClose, onCreated }: AddUserDialogProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form whenever the dialog reopens
  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setErrors({});
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!emailRegex.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!form.employeeId.trim()) next.employeeId = "Employee ID is required";
    if (!form.department.trim()) next.department = "Department is required";
    if (!form.role) next.role = "Role is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const newUser = await userService.createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        employeeId: form.employeeId.trim(),
        department: form.department.trim(),
        role: form.role,
        status: form.status,
        lastActive: new Date().toISOString(),
        applicationCount: 0,
      });
      onCreated?.(newUser);
      onClose();
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => undefined : onClose}
      title="Add New User"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="add-user-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </>
      }
    >
      <form id="add-user-form" onSubmit={handleSubmit} className="space-y-1">
        <Input
          label="Full Name"
          placeholder="e.g. Jane Doe"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
          autoFocus
        />
        <Input
          label="Work Email"
          type="email"
          placeholder="jane.doe@company.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <Input
            label="Employee ID"
            placeholder="EMP-0001"
            value={form.employeeId}
            onChange={(e) => update("employeeId", e.target.value)}
            error={errors.employeeId}
          />
          <Input
            label="Department"
            placeholder="e.g. Engineering"
            value={form.department}
            onChange={(e) => update("department", e.target.value)}
            error={errors.department}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <Select
            label="Role"
            options={roleOptions}
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            error={errors.role}
          />
          <Select
            label="Status"
            options={statusOptions}
            value={form.status}
            onChange={(e) => update("status", e.target.value as UserStatus)}
            error={errors.status}
          />
        </div>

        {submitError && (
          <p className="text-sm text-red-600 mt-2">{submitError}</p>
        )}
      </form>
    </Modal>
  );
}
