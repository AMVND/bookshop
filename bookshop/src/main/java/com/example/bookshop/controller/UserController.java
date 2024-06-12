package com.example.bookshop.controller;

import com.example.bookshop.auth.AuthenticationResponse;
import com.example.bookshop.auth.AuthenticationService;
import com.example.bookshop.dto.APIResponse;
import com.example.bookshop.dto.UserDto;
import com.example.bookshop.service.ImageUserSevice;
import com.example.bookshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final AuthenticationService service;

    private final ImageUserSevice imageUserSevice;

    //cho nay lan sau de post lay dto nhe
    /*
    http://localhost:8080/user/auth/admin/filter?id=&firstName=&lastName=&mobile=&email=
     */
    @GetMapping("/auth/admin/filter")
    List<UserDto> filter(@RequestParam(defaultValue = "") String id,
                         @RequestParam(defaultValue = "") String firstName,
                         @RequestParam(defaultValue = "") String lastName,
                         @RequestParam(defaultValue = "") String mobile,
                         @RequestParam(defaultValue = "") String email) {
        List<UserDto> dtos = userService.filter(id, firstName, lastName, mobile, email);
        return dtos;
    }


    //delete
    @DeleteMapping("/auth/delete/{id}")
    public void delete(@PathVariable("id") Long id) {
        userService.delete(id);
    }

    @GetMapping("/auth/admin")
    public List<UserDto> findAll() {
        List<UserDto> dtos = userService.findAll();
        return dtos;
    }

    // http://localhost:8080/user/page?page=1&size=2
    @GetMapping("/auth/admin/page")
    public ResponseEntity<List<UserDto>> findAllPage(Pageable pageable) {
        Page<UserDto> page = userService.findAllPage(pageable);
        HttpHeaders headers = new HttpHeaders();
        headers.add("total", String.valueOf(page.getTotalElements()));
        headers.add("totalPages", String.valueOf(page.getTotalPages()));
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    // todo: get data user đang đăng nhập
    @GetMapping("/auth/info")
    public UserDto getUserInformation() {
        UserDto dto = userService.getUserInformation();
        return dto;
    }

    // Page: Phân trang
//    Pageable pageable = PageRequest.of(1, 10);
    @PutMapping("/auth/updatePassUser")
    public ResponseEntity<AuthenticationResponse> updatePassUser(
            @RequestBody UserDto dto
    ) {
        return ResponseEntity.ok(service.updatePassUser(dto));
    }


    // Cập nhật thông tin người dùng
    @PutMapping("/auth/updateInfo")
    public ResponseEntity<AuthenticationResponse> updateInfo(@RequestBody UserDto dto) {
        return ResponseEntity.ok(service.updateInfo(dto));
    }

    // todo: test image
    @PostMapping("/auth/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        String uploadImage = imageUserSevice.uploadImage(file);
        return ResponseEntity.status(HttpStatus.OK)
                .body(uploadImage);
    }

    @GetMapping("/auth/image/{fileName}")
    public ResponseEntity<?> downloadImage(@PathVariable String fileName) {
        byte[] imageData = imageUserSevice.downloadImage(fileName);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(imageData);

    }
    //

    // Admin: Cập nhật quyền cho user
    @PutMapping("/auth/admin/role")
    public void updateRoleUser(@RequestParam String userId, @RequestParam String role) {
        service.updateRoleUser(userId, role);
    }

    // todo: findAllUsers
    @GetMapping("/auth/admin/{offset}/{pageSize}")
    private APIResponse<Page<UserDto>> findAllUsers(
            @PathVariable int offset,
            @PathVariable int pageSize,
            @RequestParam(value = "field", defaultValue = "id") String field,
            @RequestParam(value = "sort", defaultValue = "ASC") String sort,
            @RequestParam(value = "keyname", defaultValue = "") String keyname,
            @RequestParam(value = "mobile", defaultValue = "") String mobile,
            @RequestParam(value = "email", defaultValue = "") String email,
            @RequestParam(value = "role", defaultValue = "") String role
    ) {
        Page<UserDto> dtos = userService.findAllUsers(
                offset, pageSize, field, sort, keyname, mobile, email, role
        );
        return new APIResponse<>(dtos.getSize(), dtos);
    }

    // todo: admin - findUserById
    @GetMapping("/auth/admin/u/{id}")
    private UserDto findUserById(@PathVariable String id) {
        UserDto dto = userService.findUserById(id);
        return dto;
    }

    // todo: api
    @GetMapping("/api/u/{id}")
    private UserDto filterUserById(@PathVariable String id) {
        UserDto dto = userService.filterUserById(id);
        return dto;
    }

    // todo: amdin edit data user by id
    @PutMapping("/auth/admin/u")
    public void edit(@RequestParam("id") String id, @RequestBody UserDto dto) {
        userService.edit(id, dto);
    }

    // todo: change vendor : thay đổi vendor
    @PutMapping("/auth/change-vendor")
    public ResponseEntity<?> changeVendor(@RequestParam String id, @RequestParam Integer vendor) {
        return ResponseEntity.ok(userService.changeVendor(id, vendor));
    }
}
