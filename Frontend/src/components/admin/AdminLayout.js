import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Topbar from "../shared/Topbar";
import "../../../styles/Layout.css";

const titles = {
  "/admin": "Dashboard",
  "/admin/staff": "Manage Staff",
  "/admin/patients": "Patients",
  "/admin/appointments": "Appointments",
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title={titles[pathname] || "Admin"} />
        <div className="page-body"><Outlet /></div>
      </main>
    </div>
  );
}