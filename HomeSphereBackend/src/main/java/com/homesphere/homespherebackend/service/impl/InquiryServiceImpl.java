package com.homesphere.homespherebackend.service.impl;

import com.homesphere.homespherebackend.domain.inquiry.Inquiry;
import com.homesphere.homespherebackend.domain.inquiry.InquiryStatus;
import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.user.User;
import com.homesphere.homespherebackend.exception.InvalidOperationException;
import com.homesphere.homespherebackend.exception.ResourceNotFoundException;
import com.homesphere.homespherebackend.repository.InquiryRepository;
import com.homesphere.homespherebackend.repository.PropertyRepository;
import com.homesphere.homespherebackend.repository.UserRepository;
import com.homesphere.homespherebackend.service.InquiryService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class InquiryServiceImpl
        implements InquiryService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    @Override
    public Inquiry createInquiry(
            Inquiry inquiry) {


        User customer =
                getUserById(
                        inquiry.getSender().getUserId());

        Property property =
                getPropertyById(
                        inquiry.getProperty().getPropertyId());


        inquiry.setSender(customer);
        inquiry.setProperty(property);

        if (inquiry.getInquiryDate() == null) {
            inquiry.setInquiryDate(
                    LocalDateTime.now());
        }

        if (inquiry.getStatus() == null) {
            inquiry.setStatus(
                    InquiryStatus.PENDING);
        }

        return inquiryRepository.save(inquiry);
    }

    @Override
    public Inquiry respondToInquiry(
            UUID inquiryId,
            String response) {

        if (response == null ||
                response.isBlank()) {

            throw new InvalidOperationException(
                    "Inquiry response is required");
        }

        Inquiry inquiry =
                getInquiryById(inquiryId);

        inquiry.setOwnerResponse(response);
        inquiry.setStatus(
                InquiryStatus.RESPONDED);

        return inquiryRepository.save(inquiry);
    }

    @Override
    public Inquiry updateStatus(
            UUID inquiryId,
            InquiryStatus status) {

        if (status == null) {
            throw new InvalidOperationException(
                    "Inquiry status is required");
        }

        Inquiry inquiry =
                getInquiryById(inquiryId);

        inquiry.setStatus(status);

        return inquiryRepository.save(inquiry);
    }

    @Override
    @Transactional(readOnly = true)
    public Inquiry getInquiryById(
            UUID inquiryId) {

        return inquiryRepository.findById(inquiryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inquiry not found: "
                                        + inquiryId));
    }





    private User getUserById(
            UUID customerId) {

        return userRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found: "
                                        + customerId));
    }



    private Property getPropertyById(
            UUID propertyId) {

        return propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found: "
                                        + propertyId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Inquiry> getSentInquiries(
            UUID senderId) {

        User sender = userRepository.findById(senderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."));

        return inquiryRepository.findBySender(sender);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Inquiry> getReceivedInquiries(
            UUID ownerId) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found."));

        return inquiryRepository.findByOwner(owner);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Inquiry> getPropertyInquiries(
            UUID propertyId) {

        return inquiryRepository.findByPropertyPropertyId(
                propertyId
        );
    }


}
