package SAE501.JLTT.TrainU.Controller;

import SAE501.JLTT.TrainU.Controller.dto.ErrorResponse;
import SAE501.JLTT.TrainU.Controller.dto.LoginRequest;
import SAE501.JLTT.TrainU.Controller.dto.LoginResponse;
import SAE501.JLTT.TrainU.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"https://trainu.alwaysdata.net", "http://localhost:5173"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            LoginResponse response = authService.login(req);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ErrorResponse error = new ErrorResponse(
                    401,
                    "Unauthorized",
                    e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

}