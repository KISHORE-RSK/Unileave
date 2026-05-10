import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/student/Dashboard";
import FacultyDashboard from "./pages/faculty/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ApplyLeave from "./pages/student/ApplyLeave";
import FacultyPending from "./pages/faculty/PendingRequests";
import FacultyReports from "./pages/faculty/Reports";
import StudentRequests from "./pages/student/MyRequests";
import AdminReports from "./pages/admin/Reports";
import FacultyStats from "./pages/admin/FacultyStats";



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

         <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/apply"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ApplyLeave />
                </ProtectedRoute>
              }
            />
          <Route
              path="/student/requests"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentRequests />
                </ProtectedRoute>
              }
          />


          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/pending"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyPending />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/reports"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyReports />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/faculty"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod"]}>
                <FacultyStats />
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
