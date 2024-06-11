package com.example.bookshop.service;

import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.*;
import com.example.bookshop.repository.*;
import com.example.bookshop.dto.OrderDto;
import com.example.bookshop.mapper.CartItemMapOrderItemMapper;
import com.example.bookshop.mapper.CartMapOrderMapper;
import com.example.bookshop.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CartRepository cartRepository;
    private final CartMapOrderMapper cartMapOrderMapper;
    private final CartItemMapOrderItemMapper orderItemMapper;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;

    public List<OrderDto> findByUsers(String status) {
        Long users = SecurityUtils.getPrincipal().getId();
        List<Order> entity = orderRepository.findByUser(users, status);
        List<OrderDto> dtos = orderMapper.toDo(entity);
        return dtos;
    }

    public OrderDto findByCarts(Long carts) {
        Order entity = orderRepository.findByCart(carts).orElseThrow(()-> new RuntimeException("Không tìm thấy!"));
        OrderDto dto = orderMapper.toDo(entity);
        return dto;
    }

    @Transactional
    public void create(OrderDto dto) {
        Cart cart = cartRepository.findById(String.valueOf(dto.getCartId())).orElse(null);
        Order entity = orderMapper.toEntity(dto);
        // Set userId
//        User user = userRepository.findById(String.valueOf(dto.getUserId())).orElse(null);
//        entity.setUsers(user);
        //Set cart

        entity.setCart(cart);
        // Set user từ giỏ hàng cart
        entity.setUser(cart.getUser());
        // Set địa chỉ giao hàng
        entity.setLine1(cart.getLine1());
        entity.setCity(cart.getCity());
        entity.setCountry(cart.getCountry());
        entity.setContent(cart.getContent());
        // Set create at
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
        orderRepository.save(entity);
        cart.setStatus(1);
        cartRepository.save(cart);
    }

    public void edit(Long id, OrderDto dto) {

        Order entity = orderMapper.toEntity(dto);
        Order order = orderRepository.findById(String.valueOf(id)).orElse(null);
        Cart cart = cartRepository.findById(String.valueOf(order.getCart())).orElse(null);
        //
        entity.setId(order.getId());

        entity.setCart(order.getCart());
        // Set thông tin user
        entity.setUser(cart.getUser());

        // set update
        entity.setUpdatedAt(Instant.now());
        orderRepository.save(entity);
    }

    public List<OrderDto> findAll() {
        List<Order> entity = orderRepository.findAll();
        List<OrderDto> dtos = orderMapper.toDo(entity);
        return dtos;

    }

    public List<OrderDto> filter(String status) {
        List<Order> entity = orderRepository.filter(status);
        List<OrderDto> dtos = orderMapper.toDo(entity);
        return dtos;
    }

    /* todo: Chức năng order: khi thực hiện, một phiếu order mới được tạo ra,
        các item từ bảng cart sẽ được lưu thành các orderItem
        mỗi orer item đều chứa id của phiếu order để nhận diện.
    */
    public OrderDto createOrderByCart(Long id) {

        Cart cart = cartRepository.findById(String.valueOf(id)).orElseThrow();
        // dùng tạm cách này vậy
        List<CartItem> cartItem = cartItemRepository.findByCartId(id);

        Order order = cartMapOrderMapper.toEntity(cart);
        // todo: Lưu thông tin đính kèm của giỏ hàng
        order.setFirstName(cart.getUser().getFirstName());
        order.setLastName(cart.getUser().getLastName());
        order.setMobile(cart.getUser().getMobile());
        order.setEmail(cart.getUser().getEmail());
        order.setLine1(cart.getLine1());
        order.setCity(cart.getCity());
        order.setCountry(cart.getCountry());
        order.setContent(cart.getContent());

        //todo: Set các thuộc tính not null(làm sau)
        //viết như này mai sau tìm xem minh chua lam cai gi cho de
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());
        order.setItemDiscount(0F);
        // tính Tổng giảm giá của các mặt hàng đặt hàng.

        /*
        Trạng thái của đơn đặt hàng có thể là :
        Mới, Đã thanh toán, Đã thanh toán, Không thành công, Đã vận chuyển, Đã giao, Đã trả lại và Hoàn thành.
         */
        order.setStatus(0);
        // tính Tổng giá của các Mục đặt hàng.
        order.setSubTotal((float) 0);
        // Tổng giá của Đơn hàng đã bao gồm thuế và phí vận chuyển.
        order.setTotal((float) 0);
        // Lưu
        List<OrderItem> orderItem = orderItemMapper.toEntity(cartItem);

        orderItem.forEach(orderItem1 -> {
            orderItem1.setOrder(order);
            // todo: tính giá trị tổng đơn hàng
            order.setSubTotal(order.getSubTotal() + orderItem1.getPrice() * orderItem1.getQuantity());
            // todo: tính giá trị tổng tiền được giảm của đơn hàng
            order.setItemDiscount(
                    order.getItemDiscount() +
                            ((orderItem1.getPrice() * orderItem1.getDiscount()) / 100) * orderItem1.getQuantity());


        });
        // todo: Tính giá trị tổng tiền của đơn hàng sau khi được giảm
        order.setTotal(order.getSubTotal() - order.getItemDiscount());
        orderRepository.save(order);
        orderItemRepository.saveAll(orderItem);
        cart.setStatus(1);
        cartRepository.save(cart);
        OrderDto dto = orderMapper.toDo(order);
        return dto;
    }

    public OrderDto findOneById(String id) {
        Order entity = orderRepository.findById(id).orElse(null);
        if (entity.getUser().getId() == SecurityUtils.getPrincipal().getId()) {
            OrderDto dto = orderMapper.toDo(entity);
            return dto;
        }
        return null;
    }

    // todo: xác nhận vận chuyển hàng của đơn hàng: 0 -> 1
    public void shippingOrder(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy order với id: " + id));
        System.out.println("xác nhận vận chuyển hàng của order");
        // đồng thời check tạo phiếu thanh toán
        Optional<Transaction> check = transactionRepository.findByOrderId(entity.getId());
        if (check.isEmpty()) {
            Transaction transaction = new Transaction();
            transaction.setOrder(entity);
            transaction.setUser(entity.getUser());
            transaction.setType(0);
            transaction.setMode(0);
            transaction.setStatus(0);
            transaction.setContent(entity.getContent());
            transaction.setCreatedAt(Instant.now());
            transaction.setUpdatedAt(Instant.now());
            transactionRepository.save(transaction);
            System.out.println("Tạo transaction");
        }
        entity.setStatus(1);
        entity.setUpdatedAt(Instant.now());
        orderRepository.save(entity);
    }

    ;

    // todo: xác nhận đang giao hàng cho đơn hàng: 1 -> 2
    public void deliveryOrder(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy order với id: " + id));
        System.out.println("xác nhận giao hàng của order");
        entity.setStatus(2);
        entity.setUpdatedAt(Instant.now());
        orderRepository.save(entity);
    }

    // todo: user xác nhận đã nhận đơn hàng: 2 -> 3
    public void receiveOrder(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy order với id: " + id));
        // đã thanh toán mới được nhận hàng
        Transaction transaction = transactionRepository.findByOrderId(entity.getId()).orElseThrow(
                () -> new RuntimeException("Không tìm thấy phiếu thanh toán"));
        if (transaction.getStatus() == 1) {
            System.out.println("xác nhận đã nhận hàng");
            entity.setStatus(3);
            entity.setUpdatedAt(Instant.now());
            orderRepository.save(entity);
        }


    }

    // todo: user xác nhận đơn hàng thành công 3 -> 4
    public void handleSuccessOrder(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy order với id: " + id));
        if (entity.getUser().getId() == SecurityUtils.getPrincipal().getId()) {
            Transaction transaction = transactionRepository.findByOrderId(entity.getId()).orElseThrow(
                    () -> new RuntimeException("Không tìm thấy phiếu thanh toán"));

            System.out.println("xác nhận đơn hàng thành công");
            entity.setStatus(4);
            entity.setUpdatedAt(Instant.now());
            orderRepository.save(entity);
            transaction.setStatus(2);
            transactionRepository.save(transaction);
            System.out.println("giao dịch thành công");
        }

    }

    // todo: user hoàn trả đơn hàng: 3 -> 7
    public void returnsOrder(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy order với id: " + id));
        System.out.println(" hoàn trả hàng");
        entity.setStatus(7);
        entity.setUpdatedAt(Instant.now());
        orderRepository.save(entity);
        // hoàn trả thanh toán
        Transaction transaction = transactionRepository.findByOrderId(entity.getId()).orElseThrow(
                () -> new RuntimeException("Không tìm thấy transaction"));
        if (transaction.getStatus() == 1) {
            transaction.setStatus(6);
            transaction.setUpdatedAt(Instant.now());
            transactionRepository.save(transaction);
            System.out.println("hoàn trả transaction");
        }
    }

    ;

    // todo: admin - xác nhận đã hoàn trả hàng: 7 -> 8
    public void returnedOrder(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy order với id: " + id));
        System.out.println("xác nhận đã hoàn trả hàng");
        entity.setStatus(8);
        entity.setUpdatedAt(Instant.now());
        orderRepository.save(entity);
        // trả lại hàng cho cửa hàng
        List<OrderItem> orderItem = orderItemRepository.findOrderItemByOrderId(entity.getId());
        orderItem.forEach(orderItem1 -> {
            Product product = productRepository.findById(String.valueOf(orderItem1.getProduct().getId()))
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy product: " + orderItem1.getProduct().getId()));
            product.setQuantity((product.getQuantity() + orderItem1.getQuantity()));
            System.out.println("Trả lại hàng hoá cho cửa hàng");
            productRepository.save(product);
        });
        Transaction transaction = transactionRepository.findByOrderId(entity.getId()).orElse(null);
        if (transaction != null) {
            transaction.setStatus(7);
            transaction.setUpdatedAt(Instant.now());
            transactionRepository.save(transaction);
            System.out.println("đã hoàn trả transaction");
        }
    }

    // todo: user huỷ đơn hàng: 0 || 1 || 2 -> 5
    public void userCancelOrder(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin order: " + id));
        if (SecurityUtils.getPrincipal().getId() == entity.getUser().getId()) {
            System.out.println("đúng người sở hữu");
            System.out.println("user huỷ order");


            // Set data product : trả lại số lượng hàng đã order
            List<OrderItem> orderItemList = orderItemRepository.findOrderItemByOrderId(entity.getId());
            // Xét từng item tìm được và trả lại số hàng đã order
            orderItemList.forEach(orderItem -> {
                System.out.println("Thực hiện hoàn trả số lượn hàng cho product có id: " + orderItem.getProduct().getId() +
                        "và có title: " + orderItem.getProduct().getTitle() + " với số lượng: " + orderItem.getQuantity());
                // Tìm kiếm sản phẩm trên hệ thống
                Product product = productRepository.findById(String.valueOf(orderItem.getProduct().getId())).orElseThrow();
                // set data cho product
                int quantity = product.getQuantity() + orderItem.getQuantity();
                product.setQuantity(quantity);
                product.setUpdatedAt(Instant.now());
                // lưu lại thông tin thay đổi
                productRepository.save(product);
            });
            if (entity.getStatus() == 0) {
                System.out.println("order chưa được xác nhận");
            }
            ;
            if (entity.getStatus() == 1 || entity.getStatus() == 2) {
                System.out.println("order đã được xác nhận");
                Transaction transaction = transactionRepository.findByOrderId(entity.getId()).orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu giao dịch"));

                if (transaction.getStatus() == 0) {
                    System.out.println("transaction chưa được thanh toán");
                    transaction.setStatus(3);
                    transaction.setUpdatedAt(Instant.now());
                    transactionRepository.save(transaction);
                    System.out.println("user huỷ transaction");
                }
                ;
                if (transaction.getStatus() == 1) {
                    transaction.setStatus(6);
                    transaction.setUpdatedAt(Instant.now());
                    transactionRepository.save(transaction);
                    System.out.println("cần hoàn trả transaction");
                }


            };
            entity.setStatus(5);
            entity.setUpdatedAt(Instant.now());
            orderRepository.save(entity);

        }

    }

    // todo: admin huỷ đơn hàng: 0 || 1 || 2 -> 5
    public void adminCancelOrder(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin order: " + id));

        System.out.println("admin thực hiện huỷ order");
        entity.setStatus(5);
        entity.setUpdatedAt(Instant.now());
        orderRepository.save(entity);
        // Set data product : trả lại số lượng hàng đã order
        List<OrderItem> orderItemList = orderItemRepository.findOrderItemByOrderId(entity.getId());
        // todo: trả lại số hàng đã order
        orderItemList.forEach(orderItem -> {
            Product product = productRepository.findById(String.valueOf(orderItem.getProduct().getId())).orElseThrow();
            int quantity = product.getQuantity() + orderItem.getQuantity();
            product.setQuantity(quantity);
            product.setUpdatedAt(Instant.now());
            productRepository.save(product);
        });
        if (entity.getStatus() == 0) {
            System.out.println("order chưa được xác nhận");
        }
        ;
        if (entity.getStatus() == 1 || entity.getStatus() == 2) {
            System.out.println("order đã được xác nhận");
            Transaction transaction = transactionRepository.findByOrderId(entity.getId()).orElse(null);
            if (transaction != null) {
                if (transaction.getStatus() == 0) {
                    System.out.println("transaction chưa được thanh toán");
                    transaction.setStatus(4);
                    transaction.setUpdatedAt(Instant.now());
                    transactionRepository.save(transaction);
                    System.out.println("admin huỷ transaction");
                }
                ;
                if (transaction.getStatus() == 1) {
                    transaction.setStatus(6);
                    transaction.setUpdatedAt(Instant.now());
                    transactionRepository.save(transaction);
                    System.out.println("cần hoàn trả transaction");
                }

            }
        }
    }

    // todo: findAllOrder
    public Page<OrderDto> findAllOrder(int offset, int pageSize, String field, String sort, String cartId,
                                       String userId,
                                       String username,
                                       String mobile,
                                       String email,
                                       String address,
                                       String city,
                                       String country,
                                       String status) {
        Page<Order> entity = orderRepository.findAllOrder(
                (PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.valueOf(sort), field))),
                cartId, userId, username, mobile, email, address, city, country, status
        );
        Page<OrderDto> dtos = entity.map(orderMapper::toDo);
        return dtos;
    }

    public OrderDto findById(String id) {
        Order entity = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy order với id: " + id));
        OrderDto dto = orderMapper.toDo(entity);
        return dto;
    }
}