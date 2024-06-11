package com.example.bookshop.util;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;
@Component
public class OtpUtil {

  private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  private static final int OTP_LENGTH = 6;

  public String generateOtp() {
    SecureRandom secureRandom = new SecureRandom();
    StringBuilder otp = new StringBuilder();

    for (int i = 0; i < OTP_LENGTH; i++) {
      int randomIndex = secureRandom.nextInt(CHARACTERS.length());
      char randomChar = CHARACTERS.charAt(randomIndex);
      otp.append(randomChar);
    }

    return otp.toString();
  }
}