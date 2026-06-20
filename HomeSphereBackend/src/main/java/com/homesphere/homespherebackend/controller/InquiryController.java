package com.homesphere.homespherebackend.controller;

import com.homesphere.homespherebackend.domain.inquiry.Inquiry;
import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.user.User;
import com.homesphere.homespherebackend.dto.inquiry.InquiryRequestDto;
import com.homesphere.homespherebackend.dto.inquiry.InquiryResponseDto;
import com.homesphere.homespherebackend.dto.inquiry.InquiryResponseRequestDto;
import com.homesphere.homespherebackend.dto.inquiry.InquiryStatusUpdateDto;
import com.homesphere.homespherebackend.mapper.InquiryMapper;
import com.homesphere.homespherebackend.service.InquiryService;
import com.homesphere.homespherebackend.service.PropertyService;
import com.homesphere.homespherebackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;
    private final InquiryMapper inquiryMapper;
    private final UserService userService;
    private final PropertyService propertyService;

    @PostMapping("/users/{senderId}/properties/{propertyId}/inquiries")
    @ResponseStatus(HttpStatus.CREATED)
    public InquiryResponseDto createInquiry(
            @PathVariable UUID senderId,
            @PathVariable UUID propertyId,
            @Valid @RequestBody InquiryRequestDto request
    ) {

        User sender = userService.getUserById(senderId);

        Property property = propertyService.getPropertyById(propertyId);

        Inquiry inquiry = inquiryMapper.toEntity(request);

        inquiry.setSender(sender);
        inquiry.setOwner(property.getUser());
        inquiry.setProperty(property);

        return inquiryMapper.toDto(
                inquiryService.createInquiry(inquiry)
        );
    }


    @PatchMapping("/inquiries/{inquiryId}/response")
    public InquiryResponseDto respondToInquiry(
            @PathVariable UUID inquiryId,
            @Valid @RequestBody InquiryResponseRequestDto request
    ) {

        return inquiryMapper.toDto(
                inquiryService.respondToInquiry(
                        inquiryId,
                        request.response()
                )
        );
    }


    @PatchMapping("/inquiries/{inquiryId}/status")
    public InquiryResponseDto updateStatus(
            @PathVariable UUID inquiryId,
            @Valid @RequestBody InquiryStatusUpdateDto request
    ) {

        return inquiryMapper.toDto(
                inquiryService.updateStatus(
                        inquiryId,
                        request.status()
                )
        );
    }


    @GetMapping("/inquiries/{inquiryId}")
    public InquiryResponseDto getInquiry(
            @PathVariable UUID inquiryId
    ) {

        return inquiryMapper.toDto(
                inquiryService.getInquiryById(inquiryId)
        );
    }


    @GetMapping("/users/{userId}/inquiries/sent")
    public List<InquiryResponseDto> getSentInquiries(
            @PathVariable UUID userId
    ) {

        return inquiryService.getSentInquiries(userId)
                .stream()
                .map(inquiryMapper::toDto)
                .toList();
    }


    @GetMapping("/users/{userId}/inquiries/received")
    public List<InquiryResponseDto> getReceivedInquiries(
            @PathVariable UUID userId
    ) {

        return inquiryService.getReceivedInquiries(userId)
                .stream()
                .map(inquiryMapper::toDto)
                .toList();
    }


    @GetMapping("/properties/{propertyId}/inquiries")
    public List<InquiryResponseDto> getPropertyInquiries(
            @PathVariable UUID propertyId
    ) {

        return inquiryService.getPropertyInquiries(propertyId)
                .stream()
                .map(inquiryMapper::toDto)
                .toList();
    }

}