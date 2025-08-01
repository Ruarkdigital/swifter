import { useQuery, useMutation } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

// API Types
export type EvaluationDashboardStats = {
  total: number;
  Active: number;
  Inactive: number;
  Suspended: number;
  Pending: number;
  Completed: number;
  Draft: number;
};

export type EvaluationApiResponse = {
  _id: string;
  status: string;
  startDate: string;
  endDate: string;
  solicitationName: string;
  solicitationType: string;
  owner: boolean;
  timezone: string;
};

export type AssignedEvaluationApiResponse = {
  solicitationTitle: string;
  solicitationName: string;
  solicitationId: string;
  solicitationType: string;
  averageProgress: number;
  startDate: string;
  endDate: string;
  evaluationGroups: {
    name: string;
    progress: number;
    assignedOn: string;
    _id: string;
  }[];
  _id: string;
};

export type EvaluationsListResponse = ApiResponse<{
  evaluations: EvaluationApiResponse[];
  total: Record<string, number>[];
}>["data"];

export type AssignedEvaluationsListResponse = ApiResponse<{
  evaluations: AssignedEvaluationApiResponse[];
  total: Record<string, number>[];
}>["data"];

// API Hooks
export const useEvaluationDashboard = () => {
  return useQuery<EvaluationDashboardStats>({
    queryKey: ["evaluation-dashboard"],
    queryFn: async () => {
      const response = await getRequest({
        url: "/procurement/evaluations/dashboard",
      });
      return response.data?.data;
    },
  });
};

// Additional Evaluator-specific hooks
export const useEvaluatorRecentActions = () => {
  return useQuery({
    queryKey: ["evaluator-recent-actions"],
    queryFn: async () => {
      const response = await getRequest({
        url: "/evaluator/dashboard/my-actions",
      });
      return response.data;
    },
  });
};

export const useEvaluatorRecentEvaluations = () => {
  return useQuery({
    queryKey: ["evaluator-recent-evaluations"],
    queryFn: async () => {
      const response = await getRequest({
        url: "/evaluator/dashboard/evaluations",
      });
      return response.data;
    },
  });
};

export const useEvaluationsList = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  name?: string;
  category?: string;
  date?: string;
}) => {
  return useQuery<EvaluationsListResponse>({
    queryKey: ["evaluations-list", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.status) searchParams.append("status", params.status);
      if (params?.name) searchParams.append("name", params.name);
      if (params?.category) searchParams.append("category", params.category);
      if (params?.date) searchParams.append("date", params.date);

      const response = await getRequest({
        url: `/procurement/evaluations?${searchParams.toString()}`,
      });
      return response.data;
    },
  });
};

export const useAssignedEvaluationsList = (params?: {
  status?: string;
  category?: string;
  date?: string;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append("status", params.status);
  if (params?.category) searchParams.append("category", params.category);
  if (params?.date) searchParams.append("date", params.date);
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  return useQuery<{ data: { data: AssignedEvaluationApiResponse[] } }>({
    queryKey: ["assigned-evaluations-list", params],
    queryFn: async () => {
      const response = await getRequest({
        url: `/evaluator/my-evaluations?${searchParams.toString()}`,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMyEvaluationsList = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  date?: string;
}) => {
  return useQuery<EvaluationsListResponse>({
    queryKey: ["my-evaluations-list", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.status) searchParams.append("status", params.status);
      if (params?.category) searchParams.append("category", params.category);
      if (params?.date) searchParams.append("date", params.date);

      const response = await getRequest({
        url: `/procurement/evaluations/me?${searchParams.toString()}`,
      });
      return response.data;
    },
  });
};

// Manage Evaluation Hook
export const useManageEvaluation = () => {
  return useMutation<ApiResponse<any>, ApiResponseError, string>({
    mutationFn: async (evaluationId: string) => {
      const response = await postRequest({
        url: `/procurement/evaluations/${evaluationId}/manage`,
        payload: {},
      });
      return response;
    },
  });
};

// Note: useEvaluatorMyEvaluations was removed as it's redundant with useAssignedEvaluationsList
// Both hooks use the same /evaluator/my-evaluations endpoint
