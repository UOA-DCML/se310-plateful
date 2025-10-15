package com.plateful.backend.auth.exception;

import java.time.Instant;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
    public ResponseEntity<ApiError> handleValidation(Exception ex) {
        var msg = "Validation failed";
        if (ex instanceof MethodArgumentNotValidException manv && !manv.getBindingResult().getAllErrors().isEmpty()) {
            msg = manv.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        }
        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", msg, 400));
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ApiError> handleDuplicate(DuplicateKeyException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiError.of("DUPLICATE", "Email already registered", 409));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArg(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ApiError.of("BAD_REQUEST", ex.getMessage(), 400));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleOther(Exception ex) {
          ex.printStackTrace(); // TEMP: show root cause in console
        // Avoid leaking internals
        return ResponseEntity.status(500).body(ApiError.of("SERVER_ERROR", "Unexpected server error", 500));
    }
    @ExceptionHandler(BadCredentialsException.class)
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public ApiError handleBadCredentials(BadCredentialsException ex) {
    return new ApiError("BAD_CREDENTIALS", "Invalid email or password", 401, Instant.now());
}

    
}
