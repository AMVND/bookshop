package com.example.bookshop.util;

import com.example.bookshop.domain.User;
import com.example.bookshop.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class EmailUtil {

    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private UserRepository userRepository;

    public void sendOtpEmail(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        User user = userRepository.findByEmail(email).orElseThrow();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        String content = "<p>Xin chào: " + user.getFirstName() + " " + user.getLastName() + "</p>"
                + "<p>Thông tin đăng nhập của bạn là: </p>"
                + "<p>Email đăng nhập: " + email + "</p>"
                + "<p>Mật khẩu: <b>" + otp + "</b></p>"
                + "<br>";
        mimeMessageHelper.setTo(email);
        mimeMessageHelper.setSubject("Change password");
        mimeMessageHelper.setText(content, true);

        javaMailSender.send(mimeMessage);
    }

    public void sendSingUpEmail(String firstName, String lastName, String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        String content = "<p>Xin chào: " + firstName + " " + lastName + "</p>"
                + "<p>Thông tin đăng nhập của bạn là: </p>"
                + "<p>Email đăng nhập: " + email + "</p>"
                + "<p>Mật khẩu: <b>" + otp + "</b></p>"
                + "<br>";
        mimeMessageHelper.setTo(email);
        mimeMessageHelper.setSubject("Login information");
        mimeMessageHelper.setText(content, true);

        javaMailSender.send(mimeMessage);
    }
}
