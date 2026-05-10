import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const FacultyReports = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">UniLeave</div>

        <nav>
          <a onClick={() => navigate("/faculty")}>
            Dashboard
          </a>
          <a onClick={() => navigate("/faculty/pending")}>
            Pending Requests
          </a>
          <a className="active">Reports</a>
        </nav>
      </aside>

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

        <section className="stats-row">
          <div className="stat-card">
            <p>Total Requests</p>
            <h3>—</h3>
          </div>

          <div className="stat-card">
            <p>Approval Rate</p>
            <h3>—</h3>
          </div>

          <div className="stat-card">
            <p>Peak Period</p>
            <h3>—</h3>
          </div>
        </section>

        <section className="recent-requests">
          <h3>Monthly Summary</h3>
          <p>
            Reporting endpoints will populate this
            section.
          </p>
        </section>
      </main>
    </div>
  );
};

export default FacultyReports;
