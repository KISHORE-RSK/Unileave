import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminDashboard } from "../../api/admin.api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    totalRequests: 0,
    approvalRate: 0,
    peakLeavePeriod: ""
  });

  const [facultyStats, setFacultyStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const { data } = await fetchAdminDashboard();

      setStats(data.stats);
      setFacultyStats(data.facultyStats);
    } catch {
      setError("Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const formatPeakPeriod = (value) => {
    if (!value) return "—";

    const [month, year] = value.split("-");

    const date = new Date(year, Number(month) - 1);

    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">UniLeave</div>

        <nav>
          <a className="active">Dashboard</a>
          <a onClick={() => navigate("/admin/reports")}>Reports</a>
          <a onClick={() => navigate("/admin/faculty")}>Faculty Stats</a>
          <a>Student Trends</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="topbar">
          <h2>Admin / HoD Dashboard</h2>

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
          <>
            {/* Stats */}
            <section className="stats-row">
              <div className="stat-card">
                <p>Total Requests</p>
                <h3>{stats.totalRequests}</h3>
              </div>

              <div className="stat-card">
                <p>Approval Rate</p>
                <h3>{stats.approvalRate}%</h3>
              </div>

              <div className="stat-card">
                <p>Peak Leave Period</p>
                <h3>{formatPeakPeriod(stats.peakLeavePeriod)}</h3>
              </div>
            </section>

            {/* Faculty Summary */}
            <section className="recent-requests">
              <div className="section-header">
                <h3>Faculty-wise Decisions</h3>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Approved</th>
                    <th>Rejected</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {facultyStats.map((f) => (
                    <tr key={f.facultyName}>
                      <td>{f.facultyName}</td>
                      <td>{f.approved}</td>
                      <td>{f.rejected}</td>
                      <td>{f.total}</td>
                    </tr>
                  ))}

                  {facultyStats.length === 0 && (
                    <tr>
                      <td colSpan="4">
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
