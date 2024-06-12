package com.example.bookshop.service;

import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.ImageUser;
import com.example.bookshop.domain.User;
import com.example.bookshop.repository.ImageUserRepository;
import com.example.bookshop.repository.UserRepository;
import com.example.bookshop.util.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageUserSevice {
    private final UserRepository userRepository;
    @Autowired
    private ImageUserRepository repository;

    public String uploadImage(MultipartFile file) throws IOException {
        ImageUser entity = repository.findByUserId(SecurityUtils.getPrincipal().getId()).orElse(null);
        if (entity == null) {
            System.out.println("chưa có ảnh");
            ImageUser imageData = repository.save(ImageUser.builder()
                    .user(SecurityUtils.getPrincipal())
                    .name("user-" + SecurityUtils.getPrincipal().getId())
                    .type(file.getContentType())
                    .imageData(ImageUtils.compressImage(file.getBytes())).build());
            if (imageData != null) {
                User user = userRepository.findById(String.valueOf(SecurityUtils.getPrincipal().getId()))
                        .orElseThrow();
                user.setPhotos("/api/v1/auth/image/user/" + imageData.getName());
                return "file uploaded successfully : " + imageData.getName();
            }
        } else {
            System.out.println("đã có ảnh");
            entity.setImageData(ImageUtils.compressImage(file.getBytes()));
            entity.setType(file.getContentType());
            User user = userRepository.findById(String.valueOf(SecurityUtils.getPrincipal().getId()))
                    .orElseThrow();
            user.setPhotos("/api/v1/auth/image/user/" + entity.getName());
            return "file uploaded successfully : " + entity.getName();
        }


        return null;
    }

    public byte[] downloadImage(String fileName) {
        Optional<ImageUser> dbImageData = repository.findByName(fileName);
        byte[] images = ImageUtils.decompressImage(dbImageData.get().getImageData());
        return images;
    }
}
