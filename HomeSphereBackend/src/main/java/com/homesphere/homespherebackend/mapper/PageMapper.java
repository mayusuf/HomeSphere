package com.homesphere.homespherebackend.mapper;

import com.homesphere.homespherebackend.dto.common.PageResponse;
import org.springframework.data.domain.Page;

import java.util.function.Function;

public class PageMapper {

    private PageMapper() {
    }

    public static <T, R> PageResponse<R> toPageResponse(
            Page<T> page,
            Function<T, R> mapper
    ) {

        return new PageResponse<>(
                page.getContent()
                        .stream()
                        .map(mapper)
                        .toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}