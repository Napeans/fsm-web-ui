import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserPlus, 
  ListOrdered,
  BriefcaseBusiness,
  Users, 
  LogOut, 
  Menu, 
  UserCircle 
} from "lucide-react";
import "./DashboardLayout.css";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  // One state to rule them all: 
  // Desktop: toggles width | Mobile: toggles visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.innerWidth >= 768;
  });
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      {/* Mobile Overlay (Backdrop) */}
      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="profile-wrapper">
             <UserCircle size={isSidebarOpen ? 48 : 32} strokeWidth={1.5} />
             {isSidebarOpen && <span className="profile-name">Admin User</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""} onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}>
            <LayoutDashboard size={22} />
            {isSidebarOpen && <span>Dashboard</span>}
          </NavLink> */}
          
          <NavLink to="/lead-create" className={({ isActive }) => isActive ? "active" : ""} onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}>
            <UserPlus size={22} />
            {isSidebarOpen && <span>Create Lead</span>}
          </NavLink>

          <NavLink to="/leads" className={({ isActive }) => isActive ? "active" : ""} onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}>
            <ListOrdered size={22} />
            {isSidebarOpen && <span>List of Leads</span>}
          </NavLink>

          <NavLink to="/jobs" className={({ isActive }) => isActive ? "active" : ""} onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}>
            <BriefcaseBusiness size={22} />
            {isSidebarOpen && <span>My Jobs</span>}
          </NavLink>
          
          {/* <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""} onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}>
            <Users size={22} />
            {isSidebarOpen && <span>User Manager</span>}
          </NavLink> */}
        </nav>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        
<header className="admin-topbar">
  <button className="icon-btn menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
    {/* Always show Menu (the lines) instead of X */}
    <Menu size={24} />
  </button>

  <div className="topbar-right">
    <button className="logout-link" onClick={logout}>
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  </div>
</header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
