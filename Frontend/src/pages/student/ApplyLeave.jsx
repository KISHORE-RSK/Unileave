import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { submitLeaveRequest } from "../../api/student.api";
import { useAuth } from "../../context/AuthContext";

const ApplyLeave = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    attachmentUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await submitLeaveRequest(form);
      navigate("/student");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit leave request."
      );
    } finally {
      setLoading(false);
    }
  };


return (
  <div className="dashboard-shell">
    {/* Sidebar */}
    <aside className="sidebar">
      <div className="sidebar-logo">UniLeave</div>

      <nav>
        <a onClick={() => navigate("/student")}>Dashboard</a>
        <a className="active">Apply Leave</a>
        <a onClick={() => navigate("/student/requests")}>My Requests</a>
      </nav>
    </aside>

    {/* Main Area */}
    <main className="dashboard-main">
      {/* Top Navbar */}
      <header className="topbar">
        <h2>Apply for Leave</h2>

        <div className="topbar-actions">
            <div className="topbar-user">
            <span>{user?.name}</span>
            <div className="avatar">{user?.name?.[0]}</div>
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

      {/* Centered Form */}
      <div className="apply-wrapper">
        <form
          ref={formRef}
          className="apply-card"
          onSubmit={handleSubmit}
        >
          {error && <p className="error-text">{error}</p>}

          <div className="apply-section">
            <h3>Leave Details</h3>

            <div className="form-row">
              <label>Leave Type</label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Medical">Medical</option>
                <option value="Personal">Personal</option>
                <option value="Academic">Academic</option>
              </select>
            </div>

            <div className="form-grid">
              <div className="form-row">
                <label>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="apply-section">
            <h3>Reason</h3>

            <div className="form-row">
              <textarea
                name="reason"
                rows="5"
                placeholder="Explain briefly"
                value={form.reason}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="apply-section">
            <h3>Attachment</h3>

            <div className="form-row">
              <input
                type="url"
                name="attachmentUrl"
                value={form.attachmentUrl}
                onChange={handleChange}
                placeholder="https://example.com/file.pdf"
              />
              <small className="hint-text">
                Optional. Upload the file elsewhere and paste the link.
              </small>
            </div>
          </div>

          <div className="form-actions separated">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/student")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Leave"}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
);

};

export default ApplyLeave;
