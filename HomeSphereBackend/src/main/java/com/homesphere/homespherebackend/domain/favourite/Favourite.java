package com.homesphere.homespherebackend.domain.favourite;

import com.homesphere.homespherebackend.domain.property.Property;
import com.homesphere.homespherebackend.domain.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(
        name = "favourites",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "property_id"}
                )
        }
)
public class Favourite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID favouriteId;

    private LocalDateTime dateSaved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
}
