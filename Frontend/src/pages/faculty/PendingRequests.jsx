import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchFacultyLeaves,
  decideLeave
} from "../../api/faculty.api";
import DecisionModal from "../../components/common/DecisionModal";

const FacultyPending = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState({
    isOpen: false,
    leaveId: null,
    status: ""
  });

  const loadLeaves = async () => {
    try {
    const { data } = await fetchFacultyLeaves();
    setLeaves(data.leaves);
    } catch {
      setError("Failed to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleDecision = (id, status) => {
    setModal({
      isOpen: true,
      leaveId: id,
      status: status
    });
  };

  const confirmDecision = async (remark) => {
    try {
      await decideLeave(modal.leaveId, { status: modal.status, remark });
      loadLeaves();
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
          <a onClick={() => navigate("/faculty")}>
            Dashboard
          </a>
          <a className="active">All Requests</a>
          <a onClick={() => navigate("/faculty/reports")}>
            Reports
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="topbar">
          <h2>All Requests</h2>

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
                    <td>{leave.studentId.name}</td>
                    <td>{leave.studentId.class}</td>
                    <td>{leave.leaveType}</td>
                    <td>{formatDate(leave.fromDate)}</td>
                    <td>{formatDate(leave.toDate)}</td>
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
                    <td colSpan="6">
                      No pending requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
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

export default FacultyPending;
