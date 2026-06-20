package com.homesphere.homespherebackend.dto.property;

import com.homesphere.homespherebackend.domain.property.PropertyStatus;
import com.homesphere.homespherebackend.domain.property.PropertyType;
import lombok.Data;

@Data
public class PropertyFilter {

    private String listingFor;

    private PropertyType houseType;

    private PropertyStatus status;

    private Integer bedrooms;

    private Integer bathrooms;

    private String city;

    private String search;
}