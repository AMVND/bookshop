package com.example.bookshop.service;

import com.example.bookshop.config.Config;
import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.Order;
import com.example.bookshop.domain.Transaction;
import com.example.bookshop.dto.CheckPaymentDto;
import com.example.bookshop.dto.PaymentDto;
import com.example.bookshop.dto.TransactionDto;
import com.example.bookshop.dto.TransactionStatusDto;
import com.example.bookshop.mapper.TransactionMapper;
import com.example.bookshop.repository.OrderRepository;
import com.example.bookshop.repository.TransactionRepository;
import com.example.bookshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {
    public final TransactionMapper transactionMapper;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    // Create new
    @Transactional
    public void create(TransactionDto dto) {

        Transaction entity = transactionMapper.toEntity(dto);
        // Set User
//        User userId = userRepository.findById(String.valueOf(dto.getUsers())).orElse(null);


        // Set order (Nếu có order với id đó thì nhận id đó, nếu không thì truyền tham số null)
        Order orderId = orderRepository.findById(String.valueOf(dto.getOrderId())).orElse(null);
        entity.setUser(orderId.getUser());
        entity.setOrder(orderId);
        entity.setStatus(0);
        entity.setContent(orderId.getContent());

        // Set create at
        entity.setCreatedAt(Instant.now());
        transactionRepository.save(entity);
        System.out.println("Thực thi create");
    }

    // Edit by Transaction id
    @Transactional
    public void edit(Long id, TransactionDto dto) {
        Transaction entity = transactionMapper.toEntity(dto);
        Transaction transaction = transactionRepository.findById(String.valueOf(id)).orElse(null);
        entity.setId(transaction.getId());
        // Giữ nguyên bản order
        entity.setOrder(transaction.getOrder());
        // Giữ nguyên user tạo transaction
        entity.setUser(transaction.getUser());
        // Giữ nguyên thời gian tạo
        entity.setCreatedAt(transaction.getCreatedAt());
        // Set update at
        entity.setUpdatedAt(Instant.now());
        transactionRepository.save(entity);

        System.out.println("Thực thi edit");
    }

    // Delete user
    @Transactional
    public void delete(String id) {
        Optional<Transaction> entity = transactionRepository.findById(id);
        if (entity.isPresent()) {

            transactionRepository.deleteById(id);
            System.out.println("Thực thi delete");


        }

    }

    // get all
    public List<TransactionDto> findAll(String field) {
        List<Transaction> entity = transactionRepository.findAll(Sort.by(Sort.Direction.DESC, field));
        List<TransactionDto> dtos = transactionMapper.toDo(entity);
        return dtos;
    }

    public TransactionDto findByUserId(String userId) {
        Transaction entity = transactionRepository.findByUserId(userId);
        TransactionDto dto = transactionMapper.toDo(entity);
        return dto;
    }

    // todo: findAllTransaction
    public Page<TransactionDto> findAllTransaction(int offset, int pageSize, String field, String sort,
                                                   String userId,
                                                   String orderId,
                                                   String username,
                                                   String mobile,
                                                   String email,
                                                   String address,
                                                   String city,
                                                   String country,
                                                   String type,
                                                   String mode,
                                                   String status) {
        Page<Transaction> entity = transactionRepository.findAllTransaction(
                (PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.valueOf(sort), field))),
                userId, orderId, username, mobile, email, address, city, country, type, mode, status
        );
        Page<TransactionDto> dtos = entity.map(transactionMapper::toDo);
        return dtos;
    }

    // todo: user hiển thị thông tin transaction theo id
    public TransactionDto findTransactionById(String id) {
        Transaction entity = transactionRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu transaction: " + id));
        if (entity.getUser().getId() == SecurityUtils.getPrincipal().getId()) {
            TransactionDto dto = transactionMapper.toDo(entity);
            return dto;
        } else {
            return new TransactionDto();
        }
    }

    // todo: admin hiển thị thông tin của transaction theo id
    public TransactionDto findById(String id) {
        Transaction entity = transactionRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy phiếu transaction: " + id));
        TransactionDto dto = transactionMapper.toDo(entity);
        return dto;
    }

    // todo: user tìm đến transaction thông qua orderId
    public TransactionDto findByOrderId(Long orderId) {
        Transaction entity = transactionRepository.findByOrderId(orderId).orElseThrow(() -> new RuntimeException("Không tìm thấy transaction qua orderId"));
        if (entity.getUser().getId() == SecurityUtils.getPrincipal().getId()) {
            TransactionDto dto = transactionMapper.toDo(entity);
            return dto;
        } else {
            return new TransactionDto();
        }
    }

    // todo: admin tìm đến transaction thông qua orderId
    public TransactionDto adminFindByOrderId(Long orderId) {
        Transaction entity = transactionRepository.findByOrderId(orderId).orElseThrow(
                () -> new RuntimeException("Không tìm thấy transaction qua orderId"));
        TransactionDto dto = transactionMapper.toDo(entity);
        return dto;
    }

    // todo: user thanh toán giao dịch 0 -> 1
    public PaymentDto paymentUser(String id) throws UnsupportedEncodingException {
        Transaction entity = transactionRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy transaction, id: " + id));

        long amount = (long) (entity.getOrder().getTotal() * 100);
        String vnp_TxnRef = String.valueOf(entity.getOrder().getId());
        String vnp_TmnCode = Config.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();

        vnp_Params.put("vnp_Version", Config.vnp_Version);
        vnp_Params.put("vnp_Command", Config.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", Config.vnp_OrderType);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_ReturnUrl", Config.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", "192.168.1.12");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = Config.hmacSHA512(Config.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;
        PaymentDto paymentDto = new PaymentDto();
        if (entity.getUser().getId() == SecurityUtils.getPrincipal().getId()) {
            paymentDto.setStatus("Ok");
            paymentDto.setMessage("Successfully");
            paymentDto.setURL(paymentUrl);
        }
        ;
        return paymentDto;

    }

    // todo: admin xác nhận thanh toán cho giao dịch 0 -> 1
    public void paymentAdmin(String id) {
        Transaction entity = transactionRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy transaction, id: " + id));
        entity.setStatus(1);
        transactionRepository.save(entity);
        System.out.println("transaction đã được thanh toán");

    }

    public void refundedTransaction(String id) {
        Transaction entity = transactionRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy transaction, id: " + id));
        if (entity.getUser().getId() == SecurityUtils.getPrincipal().getId()) {
            entity.setStatus(7);
            transactionRepository.save(entity);
            System.out.println("transaction đã được thanh toán");
        }
    }

    public TransactionStatusDto checkPayment(CheckPaymentDto checkPaymentDto) {
        TransactionStatusDto transactionStatusDto = new TransactionStatusDto();
        Transaction transaction = transactionRepository.findByOrderId(Long.valueOf(checkPaymentDto.getVnp_TxnRef())).orElse(null);
        if (transaction != null && checkPaymentDto.getVnp_ResponseCode().equals("00")) {
            transaction.setCode(checkPaymentDto.getVnp_TransactionNo());
            transaction.setContent(checkPaymentDto.getVnp_OrderInfo());
            transaction.setStatus(1);
            transactionRepository.save(transaction);
            Order order = orderRepository.findById(String.valueOf(transaction.getOrder().getId())).orElse(null);
            order.setStatus(4);
            orderRepository.save(order);
            transactionStatusDto.setStatus("Ok");
            transactionStatusDto.setMessage("true");
            transactionStatusDto.setData(String.valueOf(transaction.getId()));

            return transactionStatusDto;
        } else {
            transactionStatusDto.setStatus("No");
            transactionStatusDto.setMessage("false");
            transactionStatusDto.setData("");
            return transactionStatusDto;
        }

    }
}
