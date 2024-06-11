package com.example.bookshop.controller;
import com.example.bookshop.service.OrderService;
import com.example.bookshop.dto.APIResponse;
import com.example.bookshop.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;


    @GetMapping("/auth/c/{carts}")
    public ResponseEntity<?> findByCarts(@PathVariable("carts") Long carts) {
        OrderDto dto = orderService.findByCarts(carts);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    // Thực hiện order cho cart ?idCart={id}
    @PostMapping("/auth/createByCart")
    public ResponseEntity<?> createOrderByCart(@RequestParam("idCart") Long id) {
        OrderDto dto = orderService.createOrderByCart(id);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }


    /*
    Hiển thị tất cả các order

    */
    @GetMapping("/auth/admin/filter")
    public List<OrderDto> filter(@RequestParam String status) {
        List<OrderDto> dtos = orderService.filter(status);
        return dtos;
    }

    /*
    Hiển thị tất cả order của user đang đăng nhập???
     */
    @GetMapping("/auth/user")
    public List<OrderDto> findByUsers(@RequestParam String status) {
        List<OrderDto> dtos = orderService.findByUsers(status);
        return dtos;
    }

    // todo: user đăng nhập thực hiện get data order của mình
    @GetMapping("/auth/findOneById/{id}")
    public OrderDto findOneById(@PathVariable String id) {
        OrderDto dto = orderService.findOneById(id);
        return dto;
    }

    // todo: admin thực hiện get data order
    @GetMapping("/auth/admin/p/{id}")
    public OrderDto findById(@PathVariable String id) {
        OrderDto dto = orderService.findById(id);
        return dto;
    }

    @PostMapping("/auth/create")
    public void create(@RequestBody OrderDto dto) {
        orderService.create(dto);
    }

    /*
    Thực hiện xác nhận order -> vận chuyển
     */
//    @PutMapping("/auth/admin/set-status")
//    public void confirmOrder(@RequestParam String id, @RequestParam int status){
//        orderService.setStatusOrder(id, status);
//    }
    // todo: findAllOrder
    @GetMapping("/auth/admin/{offset}/{pageSize}")
    private APIResponse<Page<OrderDto>> findAllOrder(
            @PathVariable int offset,
            @PathVariable int pageSize,
            @RequestParam String field,
            @RequestParam String sort,
            @RequestParam String cartId,
            @RequestParam String userId,
            @RequestParam String username,
            @RequestParam String mobile,
            @RequestParam String email,
            @RequestParam String address,
            @RequestParam String city,
            @RequestParam String country,
            @RequestParam String status
    ) {
        Page<OrderDto> dtos = orderService.findAllOrder(
                offset, pageSize, field, sort, cartId, userId, username, mobile, email, address, city, country, status
        );
        return new APIResponse<>(dtos.getSize(), dtos);
    }

    // todo: xác nhận vận chuyển hàng của đơn hàng: 0 -> 1
    @PutMapping("/auth/admin/shipping")
    public void shippingOrder(@RequestParam String id) {
        orderService.shippingOrder(id);
    }

    // todo: xác nhận đang giao hàng cho đơn hàng: 1 -> 2
    @PutMapping("/auth/admin/delivery")
    public void deliveryOrder(@RequestParam String id) {
        orderService.deliveryOrder(id);
    }

    // todo: user xác nhận đã nhận đơn hàng: 2 -> 3
    @PutMapping("/auth/receive")
    public void receiveOrder(@RequestParam String id) {
        orderService.receiveOrder(id);
    }

    // todo: user xác nhận đơn hàng thành công 3 -> 4
    @PutMapping("/auth/success")
    public void handleSuccessOrder(@RequestParam String id) {
        orderService.handleSuccessOrder(id);
    }

    // todo: user hoàn trả đơn hàng: 3 -> 7
    @PutMapping("/auth/returns")
    public void returnsOrder(@RequestParam String id) {
        orderService.returnsOrder(id);
    }

    // todo: admin - xác nhận đã hoàn trả hàng: 7 -> 8
    @PutMapping("/auth/admin/returned")
    public void returnedOrder(@RequestParam String id) {
        orderService.returnedOrder(id);
    }

    // todo: user huỷ đơn hàng: 0 || 1 || 2 -> 5
    @PutMapping("/auth/cancel")
    public void userCancelOrder(@RequestParam String id) {
        orderService.userCancelOrder(id);
    }

    // todo: admin huỷ đơn hàng: 0 || 1 || 2 -> 5
    @PutMapping("/auth/admin/cancel")
    public void adminCancelOrder(@RequestParam String id) {
        orderService.adminCancelOrder(id);
    }
}