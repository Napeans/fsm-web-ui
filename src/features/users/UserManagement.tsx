import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import "./UserManagement.css";

type Technician = Record<string, unknown>;
type MessageType = "success" | "error";

interface InlineMessage {
  type: MessageType;
  text: string;
}

const UserManagement = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [resettingIds, setResettingIds] = useState<Record<number, boolean>>({});
  const [messages, setMessages] = useState<Record<number, InlineMessage>>({});
  const hideMessageTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const getTechnicianId = (tech: Technician) => {
    const idValue = tech.technicianId ?? tech.TechnicianId ?? tech.userId ?? tech.UserId ?? tech.id;
    const parsed = Number(idValue);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getTechnicianName = (tech: Technician) => {
    const nameValue = tech.name ?? tech.Name ?? tech.fullName ?? tech.FullName ?? tech.username ?? tech.UserName;
    const name = typeof nameValue === "string" ? nameValue.trim() : "";
    if (name) {
      return name;
    }
    const fallbackId = getTechnicianId(tech);
    return fallbackId ? `Technician ${fallbackId}` : "Technician";
  };

  const getProfileInitial = (name: string) => {
    const first = name.trim().charAt(0);
    return first ? first.toUpperCase() : "T";
  };

  const setInlineMessage = (userId: number, type: MessageType, text: string) => {
    const existingTimer = hideMessageTimers.current[userId];
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    setMessages((prev) => ({ ...prev, [userId]: { type, text } }));
    hideMessageTimers.current[userId] = setTimeout(() => {
      setMessages((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      delete hideMessageTimers.current[userId];
    }, 3500);
  };

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/technicians");
      const list = Array.isArray(res.data) ? res.data : res.data?.items ?? res.data?.data ?? [];
      setTechnicians(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Unable to fetch technicians", error);
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTechnicians();
    return () => {
      Object.values(hideMessageTimers.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const resetPassword = async (technician: Technician) => {
    const userId = getTechnicianId(technician);
    if (!userId) {
      return;
    }
    const confirmed = window.confirm("this will reset to default pin 1234. ok to proceed.");
    if (!confirmed) {
      return;
    }

    setResettingIds((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await api.get("/user/reset-password", { params: { UserId: userId } });
      const result = Number(res.data);
      if (result > 0) {
        setInlineMessage(userId, "success", "Password reset successfully.");
      } else {
        setInlineMessage(userId, "error", "Password reset failed.");
      }
    } catch (error) {
      console.error("Unable to reset password", error);
      setInlineMessage(userId, "error", "Unable to reset password.");
    } finally {
      setResettingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="user-management-page">
      <div className="user-management-header">
        <h2>User Management</h2>
      </div>

      {loading && <div className="user-management-empty">Loading technicians...</div>}
      {!loading && technicians.length === 0 && (
        <div className="user-management-empty">No technicians found.</div>
      )}

      {!loading && technicians.length > 0 && (
        <div className="user-tiles-grid">
          {technicians.map((tech) => {
            const userId = getTechnicianId(tech);
            const name = getTechnicianName(tech);
            const message = messages[userId];
            const isResetting = Boolean(resettingIds[userId]);

            return (
              <article className="user-tile" key={userId || name}>
                <div className="user-profile-icon">{getProfileInitial(name)}</div>
                <h3>{name}</h3>
                <button
                  className="reset-password-btn"
                  onClick={() => void resetPassword(tech)}
                  disabled={isResetting || !userId}
                >
                  {isResetting ? "Resetting..." : "Reset Password"}
                </button>
                {message && (
                  <p className={`inline-message ${message.type === "success" ? "inline-success" : "inline-error"}`}>
                    {message.text}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
