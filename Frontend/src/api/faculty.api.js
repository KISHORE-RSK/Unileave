import api from "./axios";

export const fetchFacultyLeaves = () => {
  return api.get("/faculty/leaves");
};

export const decideLeave = (id, payload) => {
  return api.patch(`/faculty/leaves/${id}`, payload);
};
