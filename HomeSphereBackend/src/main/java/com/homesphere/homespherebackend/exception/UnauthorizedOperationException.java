package com.homesphere.homespherebackend.exception;

public class UnauthorizedOperationException
        extends RuntimeException {

    public UnauthorizedOperationException(String message) {
        super(message);
    }
}