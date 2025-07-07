import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { putRequest, getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { TextSelect } from "@/components/layouts/FormInputs/TextSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForge, Forge, Forger, FormPropsRef } from "@/lib/forge";
import * as yup from "yup";
import { PageLoader } from "@/components/ui/PageLoader";

// Validation schema for editing user
const editUserSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup.string(),
  department: yup.string(),
  role: yup.string().required("Role is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

type EditUserFormValues = yup.InferType<typeof editUserSchema>;

type User = {
  _id: string;
  name: string;
  email: string;
  role: { _id: string; name: string };
  phone?: string;
  department?: string;
};

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const EditUserDialog = ({ open, onOpenChange, userId }: EditUserDialogProps) => {
  const formRef = useRef<FormPropsRef | null>(null);
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: userData, isLoading } = useQuery<ApiResponse<User>, ApiResponseError>({
    queryKey: ["user", userId],
    queryFn: async () => await getRequest({ url: `/users/${userId}` }),
    enabled: open && !!userId,
  });

  const user = userData?.data?.data;

  // Form setup
  const { control, reset } = useForge<EditUserFormValues>({
    resolver: yupResolver(editUserSchema),
    defaultValues: {
      name: "",
      phone: "",
      department: "",
      role: "",
      email: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
        department: user.department || "",
        role: user.role?._id || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const { mutateAsync: updateUser, isPending } = useMutation<
    ApiResponse<User>,
    ApiResponseError,
    EditUserFormValues
  >({
    mutationKey: ["updateUser", userId],
    mutationFn: async (userData) =>
      await putRequest({ url: `/users/${userId}`, payload: userData }),
    onSuccess: () => {
      toast.success("Success", "User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      handleCancel();
    },
    onError: (error) => {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error(
        "Error",
        err?.response?.data?.message ?? "Failed to update user"
      );
    },
  });

  const handleSubmit = async (data: EditUserFormValues) => {
    try {
      await updateUser(data);
    } catch (error) {
      // Error is handled by onError
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  const roleOptions = [
    { value: "company_admin", label: "Company Admin" },
    { value: "procurement", label: "Procurement Lead" },
    { value: "evaluator", label: "Evaluator" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 sm:max-w-lg">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Edit User</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {isLoading ? (
            <PageLoader 
              showHeader={false}
              message="Loading user data..."
              className="py-8"
            />
          ) : (
            <Forge
              control={control}
              onSubmit={handleSubmit}
              className="space-y-5"
              ref={formRef}
            >
              <Forger
                name="name"
                component={TextInput}
                label="Full Name *"
                placeholder="Enter full name"
                containerClass="space-y-1"
              />

              <Forger
                name="phone"
                component={TextInput}
                label="Phone Number"
                placeholder="Enter phone number"
                containerClass="space-y-1"
              />

              <Forger
                name="department"
                component={TextInput}
                label="Department"
                placeholder="Enter department"
                containerClass="space-y-1"
              />

              <Forger
                name="role"
                component={TextSelect}
                label="Role *"
                placeholder="Select role"
                options={roleOptions}
                containerClass="space-y-1"
              />

              {/* Display email as read-only */}
              <Forger
                name="email"
                component={TextInput}
                label="Email Address *"
                disabled
                containerClass="space-y-1"
              />
              
            </Forge>
          )}
        </div>

        <div className="p-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
            className="px-6 py-2 rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={() => formRef.current?.onSubmit()}
            disabled={isPending || isLoading}
            className="px-6 py-2 bg-[#2A4467] hover:bg-[#1e3147] text-white rounded-md"
          >
            {isPending ? "Updating..." : "Update User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;