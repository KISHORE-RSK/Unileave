import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchFacultyLeaves,
  decideLeave
} from "../../api/faculty.api";
import DecisionModal from "../../components/common/DecisionModal";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const cardsRef = useRef([]);

  const [stats, setStats] = useState({
    pending: 0,
    approvedToday: 0,
    rejectedToday: 0
  });

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState({
    isOpen: false,
    leaveId: null,
    status: ""
  });

  const loadDashboard = async () => {
    try {
      const { data } = await fetchFacultyLeaves();

      setStats(data.stats);
      setLeaves(data.leaves);
    } catch (err) {
      setError("Failed to load faculty data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleDecision = (id, status) => {
    setModal({
      isOpen: true,
      leaveId: id,
      status: status
    });
  };

  const confirmDecision = async (remark) => {
    try {
      await decideLeave(modal.leaveId, {
        status: modal.status,
        remark
      });

      loadDashboard();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Action failed."
      );
    }
  };

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
          <a
            className="active"
            href="/faculty"
            onClick={(e) => {
              e.preventDefault();
              navigate("/faculty");
            }}
          >
            Dashboard
          </a>

          <a
            href="/faculty/pending"
            onClick={(e) => {
              e.preventDefault();
              navigate("/faculty/pending");
            }}
          >
            All Requests
          </a>

          <a
            href="/faculty/reports"
            onClick={(e) => {
              e.preventDefault();
              navigate("/faculty/reports");
            }}
          >
            Reports
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {/* Navbar */}
        <header className="topbar">
          <h2>Faculty Dashboard</h2>

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

        {error && (
          <p className="error-text">{error}</p>
        )}

        {/* Stats */}
        <section className="stats-row">
          {[
            {
              label: "Pending",
              value: stats.pending
            },
            {
              label: "Approved Today",
              value: stats.approvedToday
            },
            {
              label: "Rejected Today",
              value: stats.rejectedToday
            }
          ].map((item, idx) => (
            <div
              key={item.label}
              className="stat-card"
              ref={(el) =>
                (cardsRef.current[idx] = el)
              }
            >
              <p>{item.label}</p>
              <h3>{item.value}</h3>
            </div>
          ))}
        </section>

        {/* Requests */}
        <section className="recent-requests">
          <div className="section-header">
            <h3>Leave Requests</h3>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Action</th>
                  <th>Remark</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      {leave.studentId.name}
                    </td>
                    <td>
                      {leave.studentId.class}
                    </td>
                    <td>{leave.leaveType}</td>
                    <td>
                      {formatDate(
                        leave.fromDate
                      )}
                    </td>
                    <td>
                      {formatDate(
                        leave.toDate
                      )}
                    </td>
                    <td>
                      {leave.status === "Pending" ? (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleDecision(
                                leave._id,
                                "Approved"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleDecision(
                                leave._id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`badge ${leave.status.toLowerCase()}`}
                        >
                          {leave.status}
                        </span>
                      )}
                    </td>
                    <td className="remark-cell">
                      {leave.facultyRemark ||"—"}
                    </td>
                  </tr>
                ))}

                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      No pending requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <DecisionModal
        isOpen={modal.isOpen}
        status={modal.status}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={confirmDecision}
      />
    </div>
  );
};

export default FacultyDashboard;
