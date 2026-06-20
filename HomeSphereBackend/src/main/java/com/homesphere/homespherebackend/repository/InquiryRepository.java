package com.homesphere.homespherebackend.repository;

import com.homesphere.homespherebackend.domain.inquiry.Inquiry;
import com.homesphere.homespherebackend.domain.inquiry.InquiryStatus;
import com.homesphere.homespherebackend.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InquiryRepository
        extends JpaRepository<Inquiry, UUID> {

    List<Inquiry> findBySender(User sender);

    List<Inquiry> findByOwner(User owner);

    List<Inquiry> findByPropertyPropertyId(UUID propertyId);

    List<Inquiry> findByStatus(InquiryStatus status);
}