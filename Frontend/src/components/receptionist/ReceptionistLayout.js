import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Topbar from "../shared/Topbar";
import "../../../styles/Layout.css";

const titles = {
  "/receptionist": "Patients",
  "/receptionist/appointments": "Appointments",
};

export default function ReceptionistLayout() {
  const { pathname } = useLocation();
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title={titles[pathname] || "Receptionist"} />
        <div className="page-body"><Outlet /></div>
      </main>
    </div>
  );
}