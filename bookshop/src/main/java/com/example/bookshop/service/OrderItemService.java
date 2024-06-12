package com.example.bookshop.service;

import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.Order;
import com.example.bookshop.domain.OrderItem;
import com.example.bookshop.domain.Product;
import com.example.bookshop.dto.OrderItemDto;
import com.example.bookshop.mapper.OrderItemMapper;
import com.example.bookshop.repository.OrderItemRepository;
import com.example.bookshop.repository.OrderRepository;
import com.example.bookshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderItemService {
    public final OrderItemMapper orderItemMapper;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    // Create new
    @Transactional
    public void create(OrderItemDto dto) {

        OrderItem entity = orderItemMapper.toEntity(dto);
        // Set product
        Product productId = productRepository.findById(String.valueOf(dto.getProductId())).orElse(null);
        entity.setProduct(productId);

        // Set order (Nếu có order với id đó thì nhận id đó, nếu không thì truyền tham số null)
        Order orderId = orderRepository.findById(String.valueOf(dto.getOrder())).orElse(null);
        entity.setOrder(orderId);

        // Set create at
        //khong can nua
//        entity.setCreatedAt(Instant.now());
        orderItemRepository.save(entity);
        System.out.println("Thực thi create");
    }

    // Edit user
    @Transactional
    public void edit(Long id, OrderItemDto dto) {
        OrderItem entity = orderItemMapper.toEntity(dto);
        entity.setId(id);

        // Set update at
        entity.setUpdatedAt(Instant.now());
        orderItemRepository.save(entity);

        System.out.println("Thực thi edit");
    }

    // Delete user
    @Transactional
    public void delete(Long id) {
        orderItemRepository.deleteById(String.valueOf(id));
        System.out.println("Thực thi delete");
    }

    // get all
    public List<OrderItemDto> findAll() {
        List<OrderItem> entity = orderItemRepository.findAll();
        List<OrderItemDto> dtos = orderItemMapper.toDo(entity);
        return dtos;
    }

    public List<OrderItemDto> findOrderItemByProductUserId() {
        Long productUserId = SecurityUtils.getPrincipal().getId();
        List<OrderItem> entity = orderItemRepository.findOrderItemByProductUserId(productUserId);
        List<OrderItemDto> dtos = orderItemMapper.toDo(entity);
        return dtos;
    }

    public List<OrderItemDto> findOrderItemByOrderId(String orderDetail) {
        Order order = orderRepository.findById(orderDetail).orElse(null);
        if (order.getUser().getId() == SecurityUtils.getPrincipal().getId()) {
            List<OrderItem> entity = orderItemRepository.findOrderItemByOrderId(order.getId());
            List<OrderItemDto> dtos = orderItemMapper.toDo(entity);
            return dtos;
        } else {
            return null;
        }

    }

    public List<OrderItemDto> findByOrderId(String orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin của order yêu cầu: " + orderId));
        List<OrderItem> entity = orderItemRepository.findOrderItemByOrderId(order.getId());
        List<OrderItemDto> dtos = orderItemMapper.toDo(entity);
        return dtos;
    }
}
