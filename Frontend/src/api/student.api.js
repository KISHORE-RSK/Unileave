import api from "./axios";

export const fetchStudentLeaves = () => {
  return api.get("/student/leaves");
};
export const submitLeaveRequest = (payload) => {
  return api.post("/student/leaves", payload);
};