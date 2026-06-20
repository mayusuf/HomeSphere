package com.homesphere.homespherebackend.exception;

public class InvalidOperationException
        extends RuntimeException {

    public InvalidOperationException(String message) {
        super(message);
    }
}