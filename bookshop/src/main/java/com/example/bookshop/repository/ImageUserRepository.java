package com.example.bookshop.repository;

import com.example.bookshop.domain.ImageUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageUserRepository extends JpaRepository<ImageUser,Long> {


    Optional<ImageUser> findByName(String fileName);
    Optional<ImageUser> findByUserId(Long userId);
}
