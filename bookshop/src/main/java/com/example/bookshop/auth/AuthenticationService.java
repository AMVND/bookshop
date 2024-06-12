package com.example.bookshop.auth;

import com.example.bookshop.config.JwtService;
import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.ImageUser;
import com.example.bookshop.domain.Role;
import com.example.bookshop.domain.User;
import com.example.bookshop.dto.UserDto;
import com.example.bookshop.repository.ImageUserRepository;
import com.example.bookshop.repository.UserRepository;
import com.example.bookshop.token.TokenRepository;
import com.example.bookshop.token.TokenType;
import com.example.bookshop.token.Tokens;
import com.example.bookshop.util.EmailUtil;
import com.example.bookshop.util.ImageUtils;
import com.example.bookshop.util.OtpUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpUtil otpUtil;
    private final EmailUtil emailUtil;
    private final ImageUserRepository imageUserRepository;

    public AuthenticationResponse register(UserDto request) throws IOException {

        // todo: tạo password tự động (mã otp gửi qua email)
//        String otp = otpUtil.generateOtp();
//        if (EmailValidator.isEmailValid(request.getEmail())){
//            System.out.println("Email is valid.");
//            try {
//                emailUtil.sendSingUpEmail(request.getFirstName(), request.getLastName(), request.getEmail(), otp);
//            } catch (MessagingException e) {
//                throw new RuntimeException("Unable to send otp please try again");
//            }
//        } else throw new RuntimeException("Email is not valid.");

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .vendor(0)
                .createdAt(new Date().toInstant())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(savedUser, jwtToken);
        saveImageUser(user.getEmail());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    /*
    http://localhost:8080/user/auth/updateInfo
    {
        "firstName": "Tú",
        "lastName": "Nguyễn",
        "mobile": "0987654321",
        "email": "tu@gmail.com",
        "password": 1111,
        "photos": "https://static.sangtacvietcdn.xyz/img/useravatar/user1036.gif?t=1650607808",
        "intro": "Tú",
        "profile": "RedStore"
      }
     */
    public AuthenticationResponse updateInfo(UserDto dto) {
        var user = userRepository.findById(String.valueOf(SecurityUtils.getPrincipal().getId())).orElseThrow();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setMobile(dto.getMobile());
        user.setEmail(dto.getEmail());
        user.setPassword(SecurityUtils.getPrincipal().getPassword());
//        user.setPhotos(dto.getPhotos());
        user.setIntro(dto.getIntro());
        user.setProfile(dto.getProfile());
        var saveUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(saveUser, jwtToken);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse updatePassUser(UserDto dto) {
        var user = userRepository.findById(String.valueOf(SecurityUtils.getPrincipal().getId())).orElseThrow();
//        user.setId(SecurityUtils.getPrincipal().getId());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        var saveUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(saveUser, jwtToken);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Tokens.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void saveImageUser(String email) throws IOException {
        // test save image
        User user = userRepository.findByEmail(email).orElseThrow();
        String imagePath = "src/user_default.jpg"; // Đường dẫn tới tệp ảnh của bạn
        // Tạo đối tượng Path từ đường dẫn
        Path imageFilePath = Paths.get(imagePath);
        // Đọc dữ liệu ảnh từ tệp
        var imageData = Files.readAllBytes(imageFilePath);
        // Tạo đối tượng ImageUser và gán giá trị
        ImageUser imageUser = new ImageUser();
        imageUser.setUser(user);
        imageUser.setName("user-" + user.getId());
        imageUser.setType("jpg");
        imageUser.setImageData(ImageUtils.compressImage(imageData));

        imageUserRepository.save(imageUser);
        user.setPhotos("/api/v1/auth/image/user/user-" + user.getId());
        userRepository.save(user);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

//    @Bean
//    public AuthenticationResponse tesstCreate() throws IOException {
//        var user1 = User.builder()
//                .firstName("Admin")
//                .lastName("admin")
//                .email("admin@gmail.com")
//                .mobile("09899899889")
//                .vendor(1)
//                .createdAt(Instant.now())
//                .password(passwordEncoder.encode("1111"))
//                .role(Role.ADMIN).build();
//        var savedUser = userRepository.save(user1);
//        var jwtToken = jwtService.generateToken(user1);
//        saveUserToken(savedUser, jwtToken);
//        saveImageUser(user1.getEmail());
//        return AuthenticationResponse.builder()
//                .token(jwtToken)
//                .build();
//    }
    // set ADMIN
//    @Bean
//    public void updateAdmin(){
//        var user = userRepository.findByEmail("tu@gmail.com").orElse(null);
//        user.setRole(Role.ADMIN);
//        userRepository.save(user);
//    }
    // Set password mặc định 1111
//    @Bean
//    public void setPassWordDefault() {
//        List<User> users = userRepository.findAll();
//        users.forEach(user -> {
//            user.setPassword(passwordEncoder.encode("1111"));
//        });
//        userRepository.saveAll(users);
//    }

    /*
    Admin: Cập nhật quyền cho user
     */
    public void updateRoleUser(String userId, String role) {
        var user = userRepository.findById(userId).orElseThrow(() ->
                new RuntimeException("Không tìm thấy user" + userId));
        user.setRole(Role.valueOf(role));
        userRepository.save(user);
    }

    // todo: đổi mật khẩu cho user đăng nhập
    public AuthenticationResponse changePassword(String passOld, String passNew) {
        User user = SecurityUtils.getPrincipal();
        if (!passwordEncoder.matches(passOld, user.getPassword())) {
            System.out.println("Đổi mật khẩu không thành công!");
            return null;
        }
        user.setPassword(passwordEncoder.encode(passNew));
        userRepository.save(user);
        System.out.println("Thay đổi mật khẩu thành công.");
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public Boolean forgotPassword(AuthenticationRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user != null) {
            String otp = otpUtil.generateOtp();
            user.setPassword(passwordEncoder.encode(otp));
            userRepository.save(user);
            System.out.println("Đã đổi mật khâu cho email với mã otp là: " + otp);
            try {
                emailUtil.sendOtpEmail(request.getEmail(), otp);
            } catch (MessagingException e) {
                throw new RuntimeException("Unable to send otp please try again");
            }
            return true;
        } else {
            System.out.println("Không tìm thấy tài khoản!");
            return false;
        }

    }
}
