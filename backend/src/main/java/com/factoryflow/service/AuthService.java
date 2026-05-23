package com.factoryflow.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Value("${app.passcode}")
    private String passcode;

    public boolean validatePasscode(String inputPasscode) {
        return passcode.equals(inputPasscode);
    }
}
