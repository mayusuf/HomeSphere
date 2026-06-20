package com.homesphere.homespherebackend.exception;

public class BusinessRuleViolationException
        extends RuntimeException {

    public BusinessRuleViolationException(String message) {
        super(message);
    }
}