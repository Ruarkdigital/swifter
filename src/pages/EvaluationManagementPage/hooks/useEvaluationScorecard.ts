import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";

interface EvaluationCriteria {
  comment: string | null;
  criteria: any | null;
  score: string;
}

interface EvaluatorDetails {
  name: string;
  email: string;
  submission: string | null;
  status: string;
  score: number;
}

interface EvaluationScorecardData {
  evaluator: EvaluatorDetails;
  criteria: EvaluationCriteria[];
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