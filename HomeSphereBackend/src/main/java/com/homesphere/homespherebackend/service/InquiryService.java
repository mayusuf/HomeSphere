package com.homesphere.homespherebackend.service;

import com.homesphere.homespherebackend.domain.inquiry.Inquiry;
import com.homesphere.homespherebackend.domain.inquiry.InquiryStatus;

import java.util.List;
import java.util.UUID;
public interface InquiryService {

    Inquiry createInquiry(Inquiry inquiry);

    Inquiry respondToInquiry(
            UUID inquiryId,
            String response
    );

    Inquiry updateStatus(
            UUID inquiryId,
            InquiryStatus status
    );

    Inquiry getInquiryById(UUID inquiryId);

    List<Inquiry> getSentInquiries(UUID senderId);

    List<Inquiry> getReceivedInquiries(UUID ownerId);

    List<Inquiry> getPropertyInquiries(UUID propertyId);
}