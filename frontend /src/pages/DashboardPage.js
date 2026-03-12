import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
  appointmentService,
  doctorService,
  getErrorMessage,
  getStoredUser,
  patientService
} from "../services/api";

function DashboardPage() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    billing: 0
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      const user = getStoredUser();

      try {
        setError("");
        const [patients, doctors, appointments] = await Promise.all([
          patientService.getAll(),
          doctorService.getAll(),
          appointmentService.getAll()
        ]);

        const patientAppointments = user?.role === "PATIENT"
          ? appointments.filter((appointment) => appointment.patientId === user.referenceId)
          : appointments;
        const doctorAppointments = user?.role === "DOCTOR"
          ? appointments.filter((appointment) => appointment.doctorId === user.referenceId)
          : appointments;
        const visibleAppointments =
          user?.role === "PATIENT"
            ? patientAppointments
            : user?.role === "DOCTOR"
              ? doctorAppointments
              : appointments;

        setStats({
          patients: user?.role === "ADMIN" ? patients.length : 1,
          doctors: user?.role === "ADMIN" ? doctors.length : 1,
          appointments: visibleAppointments.length,
          billing: visibleAppointments.filter((appointment) => appointment.status === "APPROVED").length * 750
        });
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    };

    loadStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Monitor hospital activity and key counts from one place.</p>
        </div>
      </div>

      {error && <div className="status-message error">{error}</div>}

      <div className="card-grid">
        <StatCard
          title={getStoredUser()?.role === "ADMIN" ? "Total Patients" : "My Profile"}
          value={stats.patients}
          subtitle=""
        />
        <StatCard
          title={getStoredUser()?.role === "ADMIN" ? "Total Doctors" : "Assigned Access"}
          value={stats.doctors}
          subtitle=""
        />
        <StatCard
          title={getStoredUser()?.role === "DOCTOR" ? "My Requests" : "Appointments"}
          value={stats.appointments}
          subtitle=""
        />
        <StatCard
          title="Billing"
          value={`Rs. ${stats.billing}`}
          subtitle=""
        />
      </div>

      <div className="panel">
        <h3>Quick Overview</h3>
        <p>
          This frontend now uses real backend APIs only. Configure
          <code> REACT_APP_API_BASE_URL</code> if your server is not running at
          <code> http://localhost:8080</code>.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
