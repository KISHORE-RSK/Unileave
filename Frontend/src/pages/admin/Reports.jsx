import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import api from "../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const COLORS = {
  indigo: "#4f46e5",
  green: "#22c55e",
  red: "#ef4444"
};

const AdminReports = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [year, setYear] = useState("2026");

  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        `/admin/analytics/monthly?year=${year}`
      );

      setMonthly(data.months || []);
    } catch {
      setError("Failed to load monthly analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // ----- Chart Data -----

  const labels = monthly.map((m) => m.month);

  const lineData = {
    labels,
    datasets: [
      {
        label: "Total Leaves",
        data: monthly.map((m) => m.total),
        borderColor: COLORS.indigo,
        backgroundColor: "rgba(79,70,229,0.15)",
        tension: 0.35,
        fill: true
      }
    ]
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Approved",
        data: monthly.map((m) => m.approved),
        backgroundColor: COLORS.green
      },
      {
        label: "Rejected",
        data: monthly.map((m) => m.rejected),
        backgroundColor: COLORS.red
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      }
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
          <a className="active">Reports</a>
          <a onClick={() => navigate("/admin/faculty")}>
            Faculty Stats
          </a>
          <a onClick={() => navigate("/admin/students")}>
            Student Trends
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="topbar">
          <h2>Reports</h2>

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
            <label>Year</label>
            <select
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <button
            className="primary-btn"
            onClick={loadReports}
          >
            Apply
          </button>
        </section>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <section className="reports-grid">
            <div className="report-card">
              <h3>Leaves Per Month</h3>
              <Line
                data={lineData}
                options={chartOptions}
              />
            </div>

            <div className="report-card">
              <h3>Approved vs Rejected</h3>
              <Bar
                data={barData}
                options={chartOptions}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminReports;
