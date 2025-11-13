// src/main/java/SAE501/JLTT/TrainU/config/ApiErrorHandler.java
package SAE501.JLTT.TrainU.config;

import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class ApiErrorHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String,Object>> notFound(NoSuchElementException ex) {
        return ResponseEntity.status(404).body(Map.of(
                "status", 404,
                "error", "Not Found",
                "message", ex.getMessage()
        ));
    }

    ///

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> badRequest(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> Map.of("field", fe.getField(), "message", fe.getDefaultMessage()))
                .toList();
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Validation failed",
                "details", errors
        ));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String,Object>> conflict(IllegalStateException ex) {
        return ResponseEntity.status(409).body(Map.of(
                "status", 409,
                "error", "Conflict",
                "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(StripeException.class)
    public ResponseEntity<Map<String,Object>> stripeBadRequest(StripeException ex) {
        return ResponseEntity.status(400).body(Map.of(
                "status", 400,
                "error", "Stripe error",
                "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,Object>> generic(RuntimeException ex) {
        return ResponseEntity.status(500).body(Map.of(
                "status", 500,
                "error", "Internal Server Error",
                "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> methodNotAllowed(
            org.springframework.web.HttpRequestMethodNotSupportedException ex) {
        var allowed = ex.getSupportedHttpMethods();
        return ResponseEntity.status(405)
                .headers(h -> { if (allowed != null) h.setAllow(allowed); })
                .body(Map.of(
                        "status", 405,
                        "error", "Method Not Allowed",
                        "message", "Méthode %s non autorisée sur cette ressource".formatted(ex.getMethod()),
                        "allowed", allowed == null ? java.util.Set.of() : allowed
                ));
    }

}
