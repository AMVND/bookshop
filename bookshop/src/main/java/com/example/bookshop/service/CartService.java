package com.example.bookshop.service;

import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.Cart;
import com.example.bookshop.domain.CartItem;
import com.example.bookshop.domain.Product;
import com.example.bookshop.domain.User;
import com.example.bookshop.dto.CartDto;
import com.example.bookshop.mapper.CartMapper;
import com.example.bookshop.repository.CartItemRepository;
import com.example.bookshop.repository.CartRepository;
import com.example.bookshop.repository.ProductRepository;
import com.example.bookshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    public final CartRepository cartRepository;
    public final CartMapper cartMapper;

    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final CartItemService cartItemService;
    private final ProductRepository productRepository;

    // Create new user
    public String create() {

        Cart check = cartRepository.isActiveCart(SecurityUtils.getPrincipal().getId()).orElse(null);
        if (check != null) {
            System.out.println("Đã có giỏ hàng");
            return "false";
        } else {

            Cart entity = new Cart();
            // Set userId
            User user = SecurityUtils.getPrincipal();
            entity.setUser(user);

            // Set trạng thái
            entity.setStatus(0);
            // Set first name
//            entity.setFirstName(user.getFirstName());
//            //Set Last Name
//            entity.setLastName(user.getLastName());
//            // Set Mobile
//            entity.setMobile(user.getMobile());
//            // Set Email
//            entity.setEmail(user.getEmail());
            entity.setCountry("Việt Nam");
            // Set create at
            entity.setCreatedAt(Instant.now());
            entity.setUpdatedAt(Instant.now());
            cartRepository.save(entity);
            System.out.println("Thực thi create");
            return "true";
        }
    }


    // Edit user
    @Transactional
    public void edit(Long id, CartDto dto) {
        Cart entity = cartRepository.findById(String.valueOf(id)).orElse(null);
        // Cập nhật thông tin user
        User user = userRepository.findById(String.valueOf(entity.getUser().getId())).orElse(null);
//        entity.setFirstName(user.getFirstName());
//        entity.setLastName(user.getLastName());
//        entity.setMobile(user.getMobile());
//        entity.setEmail(user.getEmail());
        // Cập nhật thông tin địa chỉ đơn hàng
        entity.setLine1(dto.getLine1());
        entity.setCity(dto.getCity());
        entity.setCountry(dto.getCountry());
        entity.setContent(dto.getContent());
        // Set update at
        entity.setUpdatedAt(Instant.now());
        cartRepository.save(entity);

        System.out.println("Thực thi edit");
    }

    // Delete user's cart with cart's id
    @Transactional
    public void delete(String id) {
        Cart entity = cartRepository.findById(id).orElseThrow();
        if (SecurityUtils.getPrincipal().getId() == entity.getUser().getId()) {
            if (entity.getStatus() == 0) {
                //
                List<CartItem> cartItemList = cartItemRepository.findByCartId(Long.valueOf(id));
                //
                if (cartItemList.toArray().length > 0) {
                    //
                    cartItemList.forEach(cartItem -> {
//                        cartItemRepository.deleteById(String.valueOf(cartItem.getId()));
                        System.out.println("Xoá cart item id=  " + cartItem.getId() + "product title " + cartItem.getProduct().getTitle());
                        // set thông tin cho product
                        Product productId = productRepository.findById(String.valueOf(cartItem.getProduct().getId())).orElseThrow();
                        Cart cart = cartRepository.findById(String.valueOf(cartItem.getCart().getId())).orElseThrow();
                        int quantity = productId.getQuantity() + cartItem.getQuantity();
                        productId.setQuantity(quantity);
                        productId.setUpdatedAt(Instant.now());
                        productRepository.save(productId);
                        // sau khi xoá cartitem thì cập nhật thông tin cho cart
                        cart.setUpdatedAt(Instant.now());
                        cartRepository.save(cart);
                        // Sau cùng là xoá cart item
                        cartItemRepository.deleteById(String.valueOf(cartItem.getId()));
                    });
                    //
//                    cartRepository.deleteById(id);
                    System.out.println("Thực thi delete cho cart có item");
                } else {
                    //
                    cartRepository.deleteById(id);
                    System.out.println("Thực thi delete cho cart không có item");
                }
            }
        }
    }

    // get all
    public List<CartDto> findAll() {
        List<Cart> entity = cartRepository.findAll();
        List<CartDto> dtos = cartMapper.toDo(entity);
        return dtos;
    }

    public List<CartDto> findAllByUserId(Long userId) {
        List<Cart> entity = cartRepository.findAllByUserId(userId);
        List<CartDto> dtos = cartMapper.toDo(entity);
        return dtos;
    }

    //
    public CartDto findMyCartById(String id) {
        Cart entity = cartRepository.findById(id).orElse(null);
        if (SecurityUtils.getPrincipal().getId() == entity.getUser().getId()) {
            CartDto dto = cartMapper.toDo(entity);
            return dto;
        }
        return null;
    }

    public List<CartDto> findUsersCart(String status) {
        Long userId = SecurityUtils.getPrincipal().getId();
        List<Cart> entity = cartRepository.findUsersCart(userId, status);
        List<CartDto> dtos = cartMapper.toDo(entity);
        return dtos;
    }


    public CartDto isActiveCart() {
        Cart entity = cartRepository.isActiveCart(SecurityUtils.getPrincipal().getId()).orElse(null);
        if (entity != null) {
            System.out.println("Đã có giỏ hàng");
            CartDto dto = cartMapper.toDo(entity);
            return dto;
        } else {
            System.out.println("Chưa có giỏ hàng");
            create();
            Cart newCart = cartRepository.isActiveCart(SecurityUtils.getPrincipal().getId()).orElse(null);
            CartDto dto = cartMapper.toDo(newCart);
            return dto;
        }
    }
}
