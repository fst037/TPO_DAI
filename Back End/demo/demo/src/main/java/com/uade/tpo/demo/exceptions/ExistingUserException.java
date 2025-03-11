package com.uade.tpo.demo.exceptions;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Existe un usuario con este mail")
public class ExistingUserException extends BadRequestException {

}
