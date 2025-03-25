import { matchingAxiosInstance } from "./matchingAxiosInstance";

type MatchResponse = {
  message: string;
  matchId?: string;
  status: "success" | "timeout";
};

export const findMatch = async (): Promise<MatchResponse> => {
  const { data } =
    await matchingAxiosInstance.get<MatchResponse>(`/find-match`);
  return data;
};
