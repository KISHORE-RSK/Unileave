import api from "./axios";

export const fetchAdminDashboard = () => {
  return api.get("/admin/dashboard");
};
