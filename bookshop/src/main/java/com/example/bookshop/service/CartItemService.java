package com.example.bookshop.service;

import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.Cart;
import com.example.bookshop.domain.CartItem;
import com.example.bookshop.domain.Product;
import com.example.bookshop.dto.CartItemDto;
import com.example.bookshop.mapper.CartItemMapper;
import com.example.bookshop.repository.CartItemRepository;
import com.example.bookshop.repository.CartRepository;
import com.example.bookshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemService {
    public final CartItemMapper cartItemMapper;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    // Create new
    @Transactional
    public void create(CartItemDto dto) {

        CartItem entity = cartItemMapper.toEntity(dto);
        Cart cartId = cartRepository.isActiveCart(SecurityUtils.getPrincipal().getId()).orElseThrow(
                () -> new RuntimeException("Không tìm thấy giỏ hàng!"));

        // Set product
        // Kiểm tra product đó trong list product có tồn tại hay không
        Product productId = productRepository.findById(String.valueOf(dto.getProductId())).orElse(null);

        // Check product được chọn đã có trong giỏ hàng hay chưa?
        //
        CartItem cartItem = cartItemRepository.findByProductAndCart(dto.getProductId(), cartId.getId()).orElse(null);

        if (cartItem != null) {
            // set thêm giá trị quantity : cartItem
            cartItem.setQuantity((cartItem.getQuantity() + entity.getQuantity()));
            cartItem.setUpdatedAt(Instant.now());
            cartId.setUpdatedAt(Instant.now());
            cartItemRepository.save(cartItem);
            // set giá trị : product
            int quantity = productId.getQuantity() - entity.getQuantity();
            productId.setQuantity(quantity);
            productId.setUpdatedAt(Instant.now());
            productRepository.save(productId);
            System.out.println("Thực thi mua thêm lần nữa");
        } else {
            entity.setProduct(productId);
            // Set thông tin cart item
            entity.setCart(cartId);
            entity.setPrice(productId.getPrice());
            entity.setDiscount(productId.getDiscount());
            //
            int quantity = productId.getQuantity() - entity.getQuantity();
            productId.setQuantity(quantity);
            productId.setUpdatedAt(Instant.now());
            productRepository.save(productId);
            // Set active
            entity.setActive(true);
            // Set create at
            entity.setCreatedAt(Instant.now());
            entity.setUpdatedAt(Instant.now());
            // Set dữ liệu cho cart
//            cartId.setStatus((short) 1);
            cartId.setUpdatedAt(Instant.now());
            // Save data
            cartRepository.save(cartId);
            cartItemRepository.save(entity);
            System.out.println("Thực thi create");
        }


    }

    // Edit quantity của cart Item
    @Transactional
    public void edit(Long id, Integer quantity) {

        // get data cartItem
        CartItem cartItem = cartItemRepository.findById(String.valueOf(id)).
                orElseThrow(() -> new RuntimeException("Không thấy cartItem"));
        // get data cart của cartItem
        Cart cart = cartRepository.findById(String.valueOf(cartItem.getCart().getId())).
                orElseThrow(() -> new RuntimeException("Không thấy ct của cartItem"));
        // get data product của cartItem đó
        Product product = productRepository.findById(String.valueOf(cartItem.getProduct().getId())).
                orElseThrow(() -> new RuntimeException("Không thấy product của cartItem"));
        // set số lượng sản phẩm của product = tổng còn lại cộng với sô lượng hiện có của cartItem rồi tất cả trừ đi số sản phẩm sửa lại
        int quantityProduct = product.getQuantity() + cartItem.getQuantity() - quantity;
        product.setQuantity(quantityProduct);
        product.setUpdatedAt(Instant.now());
        // set số lượng sản phẩm trong giỏ hàng
        cartItem.setQuantity(quantity);
        // cập nhật thời gian cập nhật cart
        cart.setUpdatedAt(Instant.now());
        // lưu lại thông tin của product và cartItem
        productRepository.save(product);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
        System.out.println("Thực thi cập nhật quantity cho cartItem");
    }

    // người mua thực hiện delete: xoá item khỏi giỏ hàng
    @Transactional
    public void delete(String id) {
        CartItem cartItem = cartItemRepository.findById(id).orElseThrow();
        Product productId = productRepository.findById(String.valueOf(cartItem.getProduct().getId())).orElse(null);
        Cart cart = cartRepository.findById(String.valueOf(cartItem.getCart().getId())).orElseThrow();
        int quantity = productId.getQuantity() + cartItem.getQuantity();
        productId.setQuantity(quantity);
        productId.setUpdatedAt(Instant.now());
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
        productRepository.save(productId);
        cartItemRepository.deleteById(id);

        System.out.println("Thực thi delete");
    }

    // Người bán thực hiện delete: xoá cart item của người người mua khỏi giỏ hàng của họ vì lý do nào đó
    public void removeProductCartFromUser(String id) {
        CartItem cartItem = cartItemRepository.findById(id).orElse(null);
        Long userId = SecurityUtils.getPrincipal().getId();
        // Check người thực hiện có phải là người quản lý sản phẩm đó không
        if (userId == cartItem.getProduct().getUser().getId()) {
            // get data của product được chọn by product's id from cartItem
            Product productId = productRepository.findById(String.valueOf(cartItem.getProduct().getId())).orElse(null);
            // Trả về dữ liệu cho sản phẩm sau khi xoá và lưu lại
            int quantity = productId.getQuantity() + cartItem.getQuantity();
            productId.setQuantity(quantity);
            productId.setUpdatedAt(Instant.now());
            productRepository.save(productId);
            cartItemRepository.deleteById(id);
        }

    }
    // get all

    public List<CartItemDto> findAll() {
        List<CartItem> entity = cartItemRepository.findAll();
        List<CartItemDto> dtos = cartItemMapper.toDo(entity);
        return dtos;
    }

    // Get cart item with id cart
    // todo: security user id = cart user id
    public List<CartItemDto> findByCartId(Long cartId) {
        Long userSecurityId = SecurityUtils.getPrincipal().getId();
        Cart cartUser = cartRepository.findById(String.valueOf(cartId)).orElse(null);
        if (userSecurityId == cartUser.getUser().getId()) {
            List<CartItem> entity = cartItemRepository.findByCartId(cartId);
            List<CartItemDto> dtos = cartItemMapper.toDo(entity);
            return dtos;
        }
        return null;
    }

    public List<CartItemDto> findCartItemByProductUserId() {
        Long productUserId = SecurityUtils.getPrincipal().getId();
        List<CartItem> entity = cartItemRepository.findCartItemByProductUserId(productUserId);
        List<CartItemDto> dtos = cartItemMapper.toDo(entity);
        return dtos;
    }


    public List<CartItemDto> isActiveCartItem() {
        Cart check = cartRepository.isActiveCart(SecurityUtils.getPrincipal().getId()).orElse(null);
        List<CartItem> entity = cartItemRepository.findByCartId(check.getId());
        List<CartItemDto> dtos = cartItemMapper.toDo(entity);
        return dtos;
    }
}
