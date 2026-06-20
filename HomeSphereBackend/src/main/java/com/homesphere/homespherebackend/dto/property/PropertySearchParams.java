package com.homesphere.homespherebackend.dto.property;

import com.homesphere.homespherebackend.domain.property.PropertyStatus;
import com.homesphere.homespherebackend.domain.property.PropertyType;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
public class PropertySearchParams {

    private String listingFor;
    private PropertyType houseType;
    private PropertyStatus status;
    private Integer bedrooms;
    private Integer bathrooms;
    private String city;
    private String search;

    private int page = 0;
    private int size = 20;
    private String sortBy = "listedDate";
    private String sortDirection = "desc";

    public PropertyFilter toFilter() {
        PropertyFilter filter = new PropertyFilter();
        filter.setListingFor(listingFor);
        filter.setHouseType(houseType);
        filter.setStatus(status);
        filter.setBedrooms(bedrooms);
        filter.setBathrooms(bathrooms);
        filter.setCity(city);
        filter.setSearch(search);
        return filter;
    }

    public Pageable toPageable() {
        return PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.fromString(sortDirection), sortBy)
        );
    }
}
