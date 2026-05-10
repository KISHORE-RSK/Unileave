import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const COLORS = {
  approved: "#22c55e",
  rejected: "#ef4444",
  pending: "#eab308"
};

const FacultyStats = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [classFilter, setClassFilter] = useState("");
  const [summary, setSummary] = useState(null);
  const [facultyStats, setFacultyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const query = classFilter
        ? `?class=${classFilter}`
        : "";

      const { data } = await api.get(
        `/admin/analytics/faculty${query}`
      );

      setSummary(data.summary);
      setFacultyStats(data.facultyStats);
    } catch {
      setError("Failed to load faculty analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const chartData = {
    labels: facultyStats.map((f) => f.facultyName),
    datasets: [
      {
        label: "Approved",
        data: facultyStats.map((f) => f.approved),
        backgroundColor: COLORS.approved
      },
      {
        label: "Rejected",
        data: facultyStats.map((f) => f.rejected),
        backgroundColor: COLORS.rejected
      },
      {
        label: "Pending",
        data: facultyStats.map((f) => f.pending),
        backgroundColor: COLORS.pending
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">UniLeave</div>
        <nav>
          <a onClick={() => navigate("/admin")}>
            Dashboard
          </a>
          <a onClick={() => navigate("/admin/reports")}>
            Reports
          </a>
          <a className="active">Faculty Stats</a>
          <a onClick={() => navigate("/admin/students")}>
            Student Trends
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="topbar">
          <h2>Faculty Statistics</h2>

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

        {/* Filters */}
        <section className="report-filters">
          <div className="filter-group">
            <label>Class</label>
            <select
              value={classFilter}
              onChange={(e) =>
                setClassFilter(e.target.value)
              }
            >
              <option value="">All Classes</option>
              <option value="CSE-6A">CSE-6A</option>
              <option value="CSE-6B">CSE-6B</option>
            </select>
          </div>

          <button
            className="primary-btn"
            onClick={loadStats}
          >
            Apply
          </button>
        </section>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <section className="stats-row">
              <div className="stat-card">
                <p>Total Faculty</p>
                <h3>{summary.totalFaculty}</h3>
              </div>

              <div className="stat-card">
                <p>Total Decisions</p>
                <h3>{summary.totalDecisions}</h3>
              </div>

              <div className="stat-card">
                <p>Approval Rate</p>
                <h3>{summary.approvalRate}%</h3>
              </div>
            </section>

            {/* Table */}
            <section className="recent-requests">
              <div className="section-header">
                <h3>Faculty Decision Breakdown</h3>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Approved</th>
                    <th>Rejected</th>
                    <th>Pending</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyStats.map((f) => (
                    <tr key={f.facultyId}>
                      <td>{f.facultyName}</td>
                      <td>{f.approved}</td>
                      <td>{f.rejected}</td>
                      <td>{f.pending}</td>
                      <td>{f.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Chart */}
            <section className="report-card">
              <h3>Faculty Decision Overview</h3>
              <Bar
                data={chartData}
                options={chartOptions}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default FacultyStats;