
import { useQuery } from "@tanstack/react-query";
import { getConversation } from "./api";

export const useGetConversation = () => {
  return useQuery({
    queryKey: ["get-conversation"],
    queryFn: getConversation,
  });
};
