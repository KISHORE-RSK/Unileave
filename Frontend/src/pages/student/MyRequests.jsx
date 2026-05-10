import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchStudentLeaves } from "../../api/student.api";

const StudentRequests = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaves = async () => {
    try {
      const { data } = await fetchStudentLeaves();
      setLeaves(data.leaves || []);
    } catch {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">UniLeave</div>

        <nav>
          <a onClick={() => navigate("/student")}>
            Dashboard
          </a>
          <a onClick={() => navigate("/student/apply")}>
            Apply Leave
          </a>
          <a className="active">My Requests</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="topbar">
          <h2>My Leave Requests</h2>

          <div className="topbar-actions">
            <div className="topbar-user">
              <span>{user?.name}</span>
              <div className="avatar">
                {user?.name?.[0]}
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <section className="recent-requests">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Remark</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.leaveType}</td>
                    <td>{formatDate(leave.fromDate)}</td>
                    <td>{formatDate(leave.toDate)}</td>
                    <td>
                      <span
                        className={`badge ${leave.status.toLowerCase()}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.facultyRemark || "—"}
                    </td>
                  </tr>
                ))}

                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      No leave requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentRequests;
