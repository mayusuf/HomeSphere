package com.homesphere.homespherebackend.repository;


import com.homesphere.homespherebackend.domain.appointment.Appointment;
import com.homesphere.homespherebackend.domain.appointment.AppointmentStatus;
import com.homesphere.homespherebackend.domain.user.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository
        extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByUser(User user);

    List<Appointment> findByAppointmentDate(LocalDate date);

    List<Appointment> findByStatus(AppointmentStatus status);
}