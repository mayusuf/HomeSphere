package com.homesphere.homespherebackend.specification;

import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.dto.property.PropertyFilter;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> withFilters(
            PropertyFilter filter
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (filter.getListingFor() != null) {
                predicates.add(
                        cb.equal(
                                root.get("listingFor"),
                                filter.getListingFor()
                        )
                );
            }

            if (filter.getHouseType() != null) {
                predicates.add(
                        cb.equal(
                                root.get("houseType"),
                                filter.getHouseType()
                        )
                );
            }

            if (filter.getStatus() != null) {
                predicates.add(
                        cb.equal(
                                root.get("status"),
                                filter.getStatus()
                        )
                );
            }

            if (filter.getBedrooms() != null) {
                predicates.add(
                        cb.equal(
                                root.get("bedrooms"),
                                filter.getBedrooms()
                        )
                );
            }

            if (filter.getBathrooms() != null) {
                predicates.add(
                        cb.equal(
                                root.get("bathrooms"),
                                filter.getBathrooms()
                        )
                );
            }

            if (filter.getCity() != null) {
                predicates.add(
                        cb.equal(
                                cb.lower(
                                        root.get("address")
                                                .get("city")
                                ),
                                filter.getCity().toLowerCase()
                        )
                );
            }

            if (filter.getSearch() != null &&
                    !filter.getSearch().isBlank()) {

                String search =
                        "%" + filter.getSearch().toLowerCase() + "%";

                predicates.add(
                        cb.or(
                                cb.like(
                                        cb.lower(
                                                root.get("address")
                                                        .get("city")
                                        ),
                                        search
                                ),
                                cb.like(
                                        cb.lower(
                                                root.get("address")
                                                        .get("street")
                                        ),
                                        search
                                )
                        )
                );
            }

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}