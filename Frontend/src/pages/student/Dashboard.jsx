import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { fetchStudentLeaves } from "../../api/student.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LeaveCalendars from "../../pages/student/LeaveCalendars";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cardsRef = useRef([]);

  const [stats, setStats] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0
  });

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await fetchStudentLeaves();

        setStats(data.stats);
        setLeaves(data.leaves);
      } catch (err) {
        setError("Unable to load leave data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [loading]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">UniLeave</div>

        <nav>
          <a className="active">Dashboard</a>
          <a onClick={() => navigate("/student/apply")}>Apply Leave</a>
          <a onClick={() => navigate("/student/requests")}>My Requests</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <h2>Student Dashboard</h2>

          <div className="topbar-user">
            <span>{user?.name}</span>
            <div className="avatar">{user?.name?.[0]}</div>
          </div>
        </header>

        {error && <p className="error-text">{error}</p>}

        <section className="stats-row">
          {["Pending", "Approved", "Rejected"].map((label, idx) => (
            <div
              key={label}
              className="stat-card"
              ref={(el) => (cardsRef.current[idx] = el)}
            >
              <p>{label}</p>
              <h3>{stats[label]}</h3>
            </div>
          ))}
        </section>

        <section className="recent-requests">
          <div className="section-header">
            <h3>Recent Leave Requests</h3>

            <button
              className="primary-btn"
              onClick={() => navigate("/student/apply")}
            >
              Apply Leave
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
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
                    <td className="remark-cell">
                      {leave.facultyRemark || "—"}
                    </td>
                  </tr>
                ))}

                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="4">No leave requests yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <LeaveCalendars leaves={leaves} />
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
