package com.example.bookshop.controller;
import com.example.bookshop.service.OrderItemService;
import com.example.bookshop.dto.OrderItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/order-item")
public class OrderItemController {
    private final OrderItemService orderItemService;


    @PostMapping("/auth")
    public void create(@RequestBody OrderItemDto dto) {
        orderItemService.create(dto);
    }

    //edit
    @PutMapping("/auth/{id}")
    public void edit(@RequestBody OrderItemDto dto, @PathVariable("id") Long id) {
        orderItemService.edit(id, dto);
    }

    //delete
    @DeleteMapping("/auth/delete/{id}")
    public void delete(@PathVariable("id") Long id) {
        orderItemService.delete(id);
    }

    @GetMapping("/auth")
    public List<OrderItemDto> findAll(){
        List<OrderItemDto> dtos = orderItemService.findAll();
        return dtos;
    }
    /*
    người bán quản lý
    hiện trạng các product được order
    Hiển thị
     */
    @GetMapping("/auth/shop/order")
    public List<OrderItemDto> findOrderItemByProductUserId(){
        List<OrderItemDto> dtos = orderItemService.findOrderItemByProductUserId();
        return dtos;
    }
    /*
    todo: user đang đăng nhập thực hiện Hiển thị thông tin chi tiết của 1 phiếu order nào đó của mình
     */
    @GetMapping("/auth/shop/order/{orderDetail}")
    public List<OrderItemDto> findOrderItemByOrderId(@PathVariable String orderDetail){
        List<OrderItemDto> dtos = orderItemService.findOrderItemByOrderId(orderDetail);
        return dtos;
    }
    /*
    todo: admin thực hiện hiển thị thông tin chi tiết của một phiếu order nào đó
     */
    @GetMapping("/auth/admin/o/{orderId}")
    public List<OrderItemDto> findByOrderId(@PathVariable String orderId){
        List<OrderItemDto> dtos = orderItemService.findByOrderId(orderId);
        return dtos;
    }
}