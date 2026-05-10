import api from "./axios";

export const loginUser = (payload) => {
  return api.post("/auth/login", payload);
};
