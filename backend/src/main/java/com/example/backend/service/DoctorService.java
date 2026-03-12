package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Doctor;
import com.example.backend.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existingDoctor = getDoctorById(id);
        existingDoctor.setName(doctor.getName());
        existingDoctor.setSpecialization(doctor.getSpecialization());
        existingDoctor.setPhone(doctor.getPhone());
        existingDoctor.setEmail(doctor.getEmail());
        return doctorRepository.save(existingDoctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
    }
}
