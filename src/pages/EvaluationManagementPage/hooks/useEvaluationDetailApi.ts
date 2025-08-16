import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, putRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Solicitation } from "@/pages/SolicitationManagementPage/SolicitationDetailPage";

// API Types
type EvaluationDetail = {
  _id: string;
  solicitation: {
    _id: string;
    name: string;
    type: string;
  };
  solicitationDetails: Solicitation
  startDate: string;
  endDate: string;
  timezone: string;
  owner: boolean;
  evaluators: {
    groupId: string;
    groupName: string;
    evaluators: {
      name: string;
      email: string;
      _id: string;
      criteriaCount: number;
      status: string | null;
    }[];
  }[];
  evaluatorCount: number;
  groups: number;
  criteriaCount: number;
  documents: number;
  totalEvaluatorsInGroups: number;
  vendorCount: number;
  requiredDocuments: {
    title: string;
    groupName: string;
    vendor: number;
    vendorCount: number;
  }[];
  criterias: {
    _id: string;
    title: string;
    description: string;
    evaluationGroup: string;
    criteria: {
      pass_fail: string;
      weight: number;
      status: string;
    };
    __v: number;
    createdAt: string;
    updatedAt: string;
  }[];
  evaluationGroups: {
    groupId: string;
    groupName: string;
    status: "Release" | "Withhold"
    evaluators: {
      _id: string;
      name: string;
    }[];
    criteriaDetails: {
      title: string;
      criteria: {
        pass_fail: string;
        weight: number;
        status: string;
      };
    }[];
    documentTitles: string[];
    averageProgress: number | null;
  }[];
};

type EvaluatorInGroup = {
  _id: string;
  name: string;
  email: string;
  progress: number | null;
  status: string | null;
};

type EvaluatorGroup = {
  groupId: string;
  groupName: string;
  evaluators: EvaluatorInGroup[];
  criteriaCount: number;
  totalEvaluators: number;
  groupProgress: number | null;
  completedEvaluators: number;
};

type EvaluatorResponse = {
  _id: string | null;
  groups: EvaluatorGroup[];
  averageProgress: number | null;
  totalEvaluatorsInEvaluation: number;
};

type Criteria = {
  _id: string;
  criteria: string;
  description: string;
  passFail: "Pass" | "Fail" | "-";
  weight: number | "-";
  evaluationGroup: string;
};

// Evaluation Groups Types
type EvaluationGroupApi = {
  groupName: string;
  evaluatorNames: string[];
  documentTitles: string[];
  criteriaTitles: string[];
  scoring: any[];
};

// API Hooks
export const useEvaluationDetail = (evaluationId: string) => {
  return useQuery<ApiResponse<EvaluationDetail>, ApiResponseError>({
    queryKey: ["evaluation-detail", evaluationId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/procurement/evaluations/${evaluationId}`,
      });
      return response;
    },
    enabled: !!evaluationId,
  });
};

export const useEvaluationEvaluators = (evaluationId: string) => {
  return useQuery<ApiResponse<EvaluatorResponse>, ApiResponseError>({
    queryKey: ["evaluation-evaluators", evaluationId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/procurement/evaluations/${evaluationId}/evaluators`,
      });
      return response;
    },
    enabled: !!evaluationId,
  });
};

export const useEvaluationCriteria = (evaluationId: string) => {
  return useQuery<Criteria[]>({
    queryKey: ["evaluation-criteria", evaluationId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/procurement/evaluations/${evaluationId}/criteria`,
      });
      return response.data?.data || [];
    },
    enabled: !!evaluationId,
  });
};

export const useEvaluationGroups = (evaluationId: string) => {
  return useQuery<ApiResponse<EvaluationGroupApi[]>, ApiResponseError>({
    queryKey: ["evaluation-groups", evaluationId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/procurement/evaluations/${evaluationId}/groups`,
      });
      return response;
    },
    enabled: !!evaluationId,
  });
};

// Bid Comparison types based on API schema
export type BidComparisonItem = {
  proposalId: string;
  vendorName: string | null;
  vendorEmail: string | null;
  total: number | null;
  score: number | null;
  submission: string | null; // ISO date string
  rank: number | null;
};

export const useEvaluationBidComparison = (evaluationId: string) => {
  return useQuery<ApiResponse<BidComparisonItem[]>, ApiResponseError>({
    queryKey: ["evaluation-bid-comparison", evaluationId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/procurement/evaluations/${evaluationId}/bid-comparison`,
      });
      return response;
    },
    enabled: !!evaluationId,
  });
};

// Release and Withhold API hooks
export const useReleaseEvaluationGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<any>, ApiResponseError, {evaluationGroupId: string, evaluationId: string}>({
    mutationFn: async ({evaluationGroupId, evaluationId}) => {
      const response = await putRequest({
        url: `/procurement/evaluations/${evaluationId}/evaluation-group/${evaluationGroupId}/status/release`,
        payload: {},
      });
      return response;
    },
    onSuccess: (_, {evaluationId}) => {
      // Refetch evaluation details to get updated status
      queryClient.invalidateQueries({
        queryKey: ["evaluation-detail", evaluationId],
      });
    },
  });
};

export const useWithholdEvaluationGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<any>, ApiResponseError, {evaluationGroupId: string, evaluationId: string}>({
    mutationFn: async ({evaluationGroupId, evaluationId}) => {
      const response = await putRequest({
        url: `/procurement/evaluations/${evaluationId}/evaluation-group/${evaluationGroupId}/status/withhold`,
        payload: {},
      });
      return response;
    },
    onSuccess: (_, {evaluationId}) => {
      // Refetch evaluation details to get updated status
      queryClient.invalidateQueries({
        queryKey: ["evaluation-detail", evaluationId],
      });
    },
  });
};

// Export types for use in components
export type {
  EvaluationDetail,
  EvaluatorInGroup,
  EvaluatorGroup,
  EvaluatorResponse,
  Criteria,
  EvaluationGroupApi,
};