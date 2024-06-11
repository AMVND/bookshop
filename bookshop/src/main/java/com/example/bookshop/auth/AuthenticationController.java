package com.example.bookshop.auth;

import com.example.bookshop.domain.User;
import com.example.bookshop.repository.UserRepository;
import com.example.bookshop.service.ImageProductService;
import com.example.bookshop.service.ImageUserSevice;
import com.example.bookshop.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;
    private final ImageUserSevice imageUserSevice;
    private final ImageProductService imageProductService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody UserDto request
    ) throws IOException {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    // todo: Check gmail
    @GetMapping("/check-email")
    public String checkEmail(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            return "Email đã tồn tại";
        } else {
            return null;
        }
    }
    // todo: check mobile
    @GetMapping("/check-mobile")
    public String checkMobile(@RequestParam String mobile) {
        User user = userRepository.findByMobile(mobile).orElse(null);
        if (user != null) {
            return "Mobile đã tồn tại";
        } else {
            return null;
        }
    }
    // todo: forgot password - quên mật khẩu
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(service.forgotPassword(request));
    }

    // todo: đổi mật khẩu
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam String passOld, @RequestParam String passNew
    ){
        return ResponseEntity.ok(service.changePassword(passOld, passNew));
    }


    @GetMapping("/image/user/{fileName}")
    public ResponseEntity<?> downloadImage(@PathVariable String fileName) {
        byte[] imageData = imageUserSevice.downloadImage(fileName);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(imageData);

    }
    @GetMapping("/image/product/{fileName}")
    public ResponseEntity<?> downloadProductImage(@PathVariable String fileName){
        byte [] imageProduct = imageProductService.downloadImage(fileName);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(imageProduct);
    }

}
