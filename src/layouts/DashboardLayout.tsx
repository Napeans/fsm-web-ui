import {  useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          FSM Pro
        </div>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/lead-create">Lead Manager</NavLink>
          <NavLink to="/users">User Manager</NavLink>
        </nav>
      </aside>

      {/* Main Section */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button onClick={() => setCollapsed(!collapsed)}>☰</button>

          <div className="topbar-right">
            <span>Admin User</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;