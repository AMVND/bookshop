package com.example.bookshop.controller;
import com.example.bookshop.service.CartService;
import com.example.bookshop.dto.CartDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    // Tạo giỏ hàng cart mới
    /*
    {
        "line1": "Hiệp Thuận",
        "city": "Hà Nội",
        "country": "VN",
        "content": "Test"
    }
     */
    @PostMapping("/auth/create")
    public ResponseEntity<?> create() {
        return ResponseEntity.ok(cartService.create());
    }

    //edit giỏ hàng theo id
    /*
    {
        line1: line1,
        city: city,
        country: country,
        content: content,
    }
     */
    @PutMapping("/auth/{id}")
    public void edit(@RequestBody CartDto dto, @PathVariable("id") Long id) {
        cartService.edit(id, dto);
    }

    // Xoá giỏ hàng
    @DeleteMapping("/auth/delete/{id}")
    public void delete(@PathVariable("id") String id) {
        cartService.delete(id);
    }

    // Hiển thị tất cả các giỏ hàng cart
    @GetMapping("/auth")
    public List<CartDto> findAll(){
        List<CartDto> dtos = cartService.findAll();
        return dtos;
    }

    // Hiển thị các giỏ hàng cart của user có id = userID
    @GetMapping("/auth/{userId}")
    public List<CartDto> findAllByUserId(@PathVariable("userId") Long userId){
        List<CartDto> dtos = cartService.findAllByUserId(userId);
        return dtos;
    }

    // get data cart có id?
    // trong đó: id của user đăng nhập phải giống với id của user có trong thông tin của cart đó
    @GetMapping("/auth/my-cart/{id}")
    public CartDto findMyCartById(@PathVariable String id){
        CartDto dto = cartService.findMyCartById(id);
        return dto;
    }

    // get all cart - Security user
    @GetMapping("/auth/my-cart")
    public List<CartDto> findUsersCart(@RequestParam String status){
        List<CartDto> dtos = cartService.findUsersCart(status);
        return dtos;
    }
    @GetMapping("/auth/active")
    public ResponseEntity<?> isActiveCart(){
        CartDto dto = cartService.isActiveCart();
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }


}