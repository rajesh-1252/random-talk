import { useMutation } from "@tanstack/react-query";
import { findMatch } from "./api";

type MatchResponse = {
  message: string;
  matchId?: string;
  status: "success" | "timeout";
};

export const useFindMatch = () => {
  return useMutation<MatchResponse, Error, { userId: string; rating: number }>({
    mutationKey: ["find-match"],
    mutationFn: findMatch,
  });
};
