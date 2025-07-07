import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";

interface EvaluationCriteria {
  id: string;
  title: string;
  description: string;
  type: string;
  score: number | string;
  weight: number;
  comments?: string;
  group: string;
}

interface EvaluatorDetails {
  id: string;
  name: string;
  email: string;
  submissionDate: string;
  status: string;
  evaluationScore: number;
}

interface EvaluationScorecardData {
  evaluator: EvaluatorDetails;
  criteria: EvaluationCriteria[];
  totalScore: number;
  maxScore: number;
}

interface EvaluationScorecardResponse {
  message: string;
  data: EvaluationScorecardData;
}

export const useEvaluationScorecard = (
  solicitationId: string,
  evaluatorId: string,
  enabled: boolean = true
) => {
  return useQuery<EvaluationScorecardResponse>({
    queryKey: ["evaluation-scorecard", solicitationId, evaluatorId],
    queryFn: async () => {
      const response = await getRequest({
        url: `/procurement/solicitations/${solicitationId}/evaluator-score-card/${evaluatorId}`,
      });
      // Extract the data from the axios response
      return response.data as EvaluationScorecardResponse;
    },
    enabled: enabled && !!solicitationId && !!evaluatorId,
  });
};

export type { EvaluationCriteria, EvaluatorDetails, EvaluationScorecardData };