import { userAxiosInstance } from "./userAxiosInstance";


export const getUser = async (userId: string, rating: number) => {
  const { data } = await userAxiosInstance.get(
    `/find-match?user_id=${userId}&rating=${rating}`,
  );
  return data;
};
