package com.gelatoflow.gelatoflow_api.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public enum ErrorCode {
    OBJECT_NOT_FOUND("Object {0} with id {1} not found", HttpStatus.NOT_FOUND),
    NULL_VALUE_FORBIDDEN("{0} from {1} can not be null", HttpStatus.BAD_REQUEST),
    TOO_LONG_VALUE("{0} with length {1} is too long. Max length = {2}", HttpStatus.BAD_REQUEST),
    INVALID_VALUE("Value {0} is invalid", HttpStatus.BAD_REQUEST),
    SPECIAL_SIGNS_OR_WHITE_SPACES_FOUND("Special signs or whitespaces were found in table name {0}", HttpStatus.BAD_REQUEST),
    TOO_LONG_STRING_FOUND("String length is too long: {0} has length of {1}", HttpStatus.BAD_REQUEST),
    EMPTY_VALUE_FORBIDDEN("{0} cannot be empty", HttpStatus.BAD_REQUEST),
    DEPRECATED_MODIFICATION("The modification date of the new object cannot be older than modification date of the current object", HttpStatus.BAD_REQUEST),
    NULL_ENTITY_FORBIDDEN("Entities cannot be null to be updated", HttpStatus.BAD_REQUEST);

    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }

}