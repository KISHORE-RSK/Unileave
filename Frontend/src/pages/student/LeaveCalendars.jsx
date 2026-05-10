import { useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  eachDayOfInterval,
  parseISO,
  isSameDay
} from "date-fns";

const statusClass = {
  Pending: "cal-pending",
  Approved: "cal-approved",
  Rejected: "cal-rejected"
};

const LeaveCalendars = ({ leaves }) => {
  const [selectedLeave, setSelectedLeave] =
    useState(null);

  // flatten dates with metadata
  const appliedDays = [];
  const leaveDays = [];

  leaves.forEach((leave) => {
    const applied = parseISO(leave.createdAt);

    appliedDays.push({
      date: applied,
      leave
    });

    const range = eachDayOfInterval({
      start: parseISO(leave.fromDate),
      end: parseISO(leave.toDate)
    });

    range.forEach((d) =>
      leaveDays.push({
        date: d,
        leave
      })
    );
  });

  const getLeaveForDay = (date, source) =>
    source.find((d) =>
      isSameDay(d.date, date)
    )?.leave;

  return (
    <>
      <div className="calendar-grid">
        {/* Applied Dates Calendar */}
        <div className="calendar-card">
          <h3>Applied Dates</h3>

          <DayPicker
            modifiers={{
              pending: (d) =>
                appliedDays.some(
                  (x) =>
                    isSameDay(x.date, d) &&
                    x.leave.status ===
                      "Pending"
                ),
              approved: (d) =>
                appliedDays.some(
                  (x) =>
                    isSameDay(x.date, d) &&
                    x.leave.status ===
                      "Approved"
                ),
              rejected: (d) =>
                appliedDays.some(
                  (x) =>
                    isSameDay(x.date, d) &&
                    x.leave.status ===
                      "Rejected"
                )
            }}
            modifiersClassNames={{
              pending: "cal-pending",
              approved: "cal-approved",
              rejected: "cal-rejected"
            }}
            onDayClick={(day) => {
              const leave = getLeaveForDay(
                day,
                appliedDays
              );
              if (leave)
                setSelectedLeave(leave);
            }}
            components={{
              DayContent: (props) => {
                const leave = getLeaveForDay(
                  props.date,
                  appliedDays
                );

                return (
                  <div
                    className="day-wrapper"
                    title={
                      leave
                        ? `${leave.leaveType} (${leave.status})`
                        : ""
                    }
                  >
                    {props.date.getDate()}
                  </div>
                );
              }
            }}
          />
        </div>

        {/* Leave Period Calendar */}
        <div className="calendar-card">
          <h3>Leave Period</h3>

          <DayPicker
            modifiers={{
              pending: (d) =>
                leaveDays.some(
                  (x) =>
                    isSameDay(x.date, d) &&
                    x.leave.status ===
                      "Pending"
                ),
              approved: (d) =>
                leaveDays.some(
                  (x) =>
                    isSameDay(x.date, d) &&
                    x.leave.status ===
                      "Approved"
                ),
              rejected: (d) =>
                leaveDays.some(
                  (x) =>
                    isSameDay(x.date, d) &&
                    x.leave.status ===
                      "Rejected"
                )
            }}
            modifiersClassNames={{
              pending: "cal-pending",
              approved: "cal-approved",
              rejected: "cal-rejected"
            }}
            onDayClick={(day) => {
              const leave = getLeaveForDay(
                day,
                leaveDays
              );
              if (leave)
                setSelectedLeave(leave);
            }}
            components={{
              DayContent: (props) => {
                const leave = getLeaveForDay(
                  props.date,
                  leaveDays
                );

                return (
                  <div
                    className="day-wrapper"
                    title={
                      leave
                        ? `${leave.leaveType} (${leave.status})`
                        : ""
                    }
                  >
                    {props.date.getDate()}
                  </div>
                );
              }
            }}
          />
        </div>
      </div>

      {/* Modal */}
      {selectedLeave && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setSelectedLeave(null)
          }
        >
          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h3>Leave Details</h3>

            <p>
              <strong>Type:</strong>{" "}
              {selectedLeave.leaveType}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedLeave.status}
            </p>

            <p>
              <strong>From:</strong>{" "}
              {new Date(
                selectedLeave.fromDate
              ).toDateString()}
            </p>

            <p>
              <strong>To:</strong>{" "}
              {new Date(
                selectedLeave.toDate
              ).toDateString()}
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                setSelectedLeave(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveCalendars;
