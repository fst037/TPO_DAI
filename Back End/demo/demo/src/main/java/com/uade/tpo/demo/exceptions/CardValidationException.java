package com.uade.tpo.demo.exceptions;

public class CardValidationException extends RuntimeException {
    
    public CardValidationException(String message) {
        super(message);
    }
    
    public CardValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
