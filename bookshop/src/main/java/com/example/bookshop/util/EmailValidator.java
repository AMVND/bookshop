package com.example.bookshop.util;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.AddressException;
import org.springframework.stereotype.Component;

@Component
public class EmailValidator {
    public static boolean isEmailValid(String email) {
        try {
            InternetAddress internetAddress = new InternetAddress(email);
            internetAddress.validate();
            return true; // Email is valid
        } catch (AddressException e) {
            return false; // Email is not valid
        }
    }
}
