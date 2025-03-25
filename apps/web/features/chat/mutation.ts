import { useMutation } from "@tanstack/react-query";
import { getUser } from "./api";

export const useGetUserData = () => {
  return useMutation({
    mutationKey: ["user-data"],
    mutationFn: ({ userId, rating }: { userId: string; rating: number }) =>
      getUser(userId, rating),
  });
};
