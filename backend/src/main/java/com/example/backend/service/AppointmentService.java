package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Appointment;
import com.example.backend.model.AppointmentStatus;
import com.example.backend.repository.AppointmentRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientService patientService;
    private final DoctorService doctorService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientService patientService,
            DoctorService doctorService) {
        this.appointmentRepository = appointmentRepository;
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment createAppointment(Appointment appointment) {
        patientService.getPatientById(appointment.getPatientId());
        doctorService.getDoctorById(appointment.getDoctorId());
        appointment.setStatus(AppointmentStatus.PENDING);
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointmentRepository.delete(appointment);
    }
}
