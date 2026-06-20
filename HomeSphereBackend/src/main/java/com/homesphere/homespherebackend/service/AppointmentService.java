package com.homesphere.homespherebackend.service;

import com.homesphere.homespherebackend.domain.appointment.Appointment;
import com.homesphere.homespherebackend.domain.appointment.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {

    Appointment scheduleAppointment(
            Appointment appointment
    );

    Appointment cancelAppointment(
            String appointmentId
    );

    Appointment updateStatus(
            String appointmentId,
            AppointmentStatus status
    );

    Appointment getAppointmentById(
            String appointmentId
    );

    List<Appointment> getAppointmentsByUser(
            String userId
    );

    List<Appointment> getAppointmentsByOwner(
            String ownerId
    );

    List<Appointment> getAppointmentsByDate(
            LocalDate date
    );
}