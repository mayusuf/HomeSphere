package com.homesphere.homespherebackend.domain.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.UUID;

import com.homesphere.homespherebackend.domain.appointment.Appointment;
import com.homesphere.homespherebackend.domain.favourite.Favourite;
import com.homesphere.homespherebackend.domain.inquiry.Inquiry;
import com.homesphere.homespherebackend.domain.property.Property;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String firstName;

    @Column
    private String lastName;

    @Column
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<Property> properties =
            new ArrayList<>();

    @OneToMany(mappedBy = "sender")
    private List<Inquiry> sentInquiries = new ArrayList<>();

    @OneToMany(mappedBy = "owner")
    private List<Inquiry> receivedInquiries = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Appointment> appointments =
            new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Favourite> favourites =
            new ArrayList<>();
}