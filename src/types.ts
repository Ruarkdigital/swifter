import { AxiosResponse, AxiosError } from "axios";

export type UserRole =
  | "evaluator"
  | "vendor"
  | "company_admin"
  | "super_admin"
  | "procurement"
  | "contract_manager";

export type Role = {
  _id: string;
  name: UserRole;
  __v: number;
};

export interface Modules {
  contractManagement:          boolean;
  _id:                         string;
  companyId:                   string;
  solicitationManagement:      boolean;
  evaluationsManagement:       boolean;
  vendorManagement:            boolean;
  reportsAnalytics:            boolean;
  vendorsQA:                   boolean;
  generalUpdatesNotifications: boolean;
  addendumManagement:          boolean;
  myActions:                   boolean;
  createdAt:                   Date;
  updatedAt:                   Date;
  __v:                         number;
}


export type User = {
  _id: string;
  companyId: { name: string, _id: string };
  createdAt: string;
  email: string;
  name: string;
  role: Role;
  status: string;
  module: Modules
  updatedAt: string;
  avatar?: string;
  phone?: string;
  department?: string;
  businessType?: string;
  location?: string;
  secondaryEmail?: string[];
  website?: string;
  logo?: string
  vendorId?: string;
  isAi: boolean
  isDeleted: boolean
  contactEmail: string
};

export type ApiError = {
  status: boolean;
  message: string;
};

export type ApiData<T = unknown> = {
  status: boolean;
  message: string;
  data: T;
};

export type ApiList<T = unknown> = {
  total: number;
  page: number;
  limit: number;
  data: T[];
};

export type ApiResponse<T = unknown> = AxiosResponse<ApiData<T>>;
export type ApiResponseError = AxiosError<ApiError>;

export interface SubscriptionPlan {
  _id: string;
  name: string;
  __v: number;
  createdAt: Date;
  features: any[];
  isActive: boolean;
  maxUsers: number;
  price: number;
  updatedAt: Date;
}

export interface Vendor {
  vendorId: string;
  name: string;
  businessType?: string;
  website?: string;
  location?: string;
  phone?: string;
  secondaryEmails?: string[];
  submissions: {
    name: string;
    fileType: string;
    link: string;
    fileSize: string;
    status: string;
    createdAt: string;
  }[];
  documents: {
    id: string;
    name: string;
    type: "DOC" | "PDF" | "XLS";
    size: string;
    createdAt: string;
  }[];
  status: string;
  isSuspended?: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    email: string;
    name: string;
  };
}
