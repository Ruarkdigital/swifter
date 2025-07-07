import React from "react";
import { TextInput, TextSelect } from "@/components/layouts/FormInputs";
import { Forger } from "@/lib/forge";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface VendorStep1FormProps {}

// Category options
const categoryOptions = [
  { label: "IT Operations", value: "it_operations" },
  { label: "Software Development", value: "software_development" },
  { label: "Consulting Services", value: "consulting_services" },
  { label: "Marketing & Advertising", value: "marketing_advertising" },
  { label: "Financial Services", value: "financial_services" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Retail", value: "retail" },
  { label: "Other", value: "other" },
];

const VendorStep1Form: React.FC<VendorStep1FormProps> = ({}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <div className="space-y-8">
      <Forger
        name="name"
        component={TextInput}
        label="Name"
        placeholder="Zenith Solutions"
        containerClass="w-full"
      />

      <Forger
        name="emailAddress"
        component={TextInput}
        label="Email Address"
        placeholder="hello@zenith.com"
        type="email"
        containerClass="w-full"
      />

      <Forger
        name="category"
        component={TextSelect}
        label="Category"
        placeholder="Select category"
        options={categoryOptions}
        containerClass="w-full"
      />

      <Forger
        name="password"
        component={TextInput}
        label="Password"
        placeholder="Enter Password"
        type={showPassword ? "text" : "password"}
        containerClass="w-full"
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        }
      />

      <Forger
        name="confirmPassword"
        component={TextInput}
        label="Confirm Password"
        placeholder="Enter Password"
        type={showConfirmPassword ? "text" : "password"}
        containerClass="w-full"
        endAdornment={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        }
      />
    </div>
  );
};

export default VendorStep1Form;
