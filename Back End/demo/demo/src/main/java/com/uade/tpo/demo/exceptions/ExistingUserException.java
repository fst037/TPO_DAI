package com.uade.tpo.demo.exceptions;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Existe un usuario con este mail")
public class ExistingUserException extends ResponseStatusException {

  public ExistingUserException(String string) {
    super(HttpStatus.BAD_REQUEST, string);
  }

}
