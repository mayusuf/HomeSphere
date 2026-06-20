package com.homesphere.homespherebackend.domain.property;

import com.homesphere.homespherebackend.domain.favourite.Favourite;
import com.homesphere.homespherebackend.domain.inquiry.Inquiry;
import com.homesphere.homespherebackend.domain.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID propertyId;

    private LocalDate listedDate;

    @Column(columnDefinition = "TEXT")
    private String descriptionHtml;

    private Double price;

    private Integer bedrooms;

    private Integer bathrooms;

    @Enumerated(EnumType.STRING)
    private PropertyType houseType;

    @Enumerated(EnumType.STRING)
    private PropertyStatus status;

    private LocalDate approvalDate;

    private Integer viewCount = 0;

    // poster information
    
    private String listingAgentName;
    private String listingAgentPhone;

    // square footage
    private Double squareFootage;

    @Enumerated(EnumType.STRING)
    private ListingType listingFor;

    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availabilityStatus;

    @OneToMany(
        mappedBy = "property",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER
    )
    private List<PropertyImage> images;
    

    @Embedded
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favourite> favourites = new ArrayList<>();

    @OneToMany(mappedBy = "property")
    private List<Inquiry> inquiries = new ArrayList<>();
}
