import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Topbar from "../shared/Topbar";
import "../../../styles/Layout.css";

export default function DoctorLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="My Appointments" />
        <div className="page-body"><Outlet /></div>
      </main>
    </div>
  );
}