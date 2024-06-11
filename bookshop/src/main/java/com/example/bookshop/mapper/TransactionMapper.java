package com.example.bookshop.mapper;

import com.example.bookshop.domain.Transaction;
import com.example.bookshop.dto.TransactionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
public class TransactionMapper implements EntityMapper<TransactionDto, Transaction>{
    @Autowired
    UserMapper userMapper;
    @Autowired
    OrderMapper orderMapper;
    @Override
    public TransactionDto toDo(Transaction entity) {
        TransactionDto dto = new TransactionDto();
        dto.setId(entity.getId());
        dto.setUser(userMapper.toDo(entity.getUser()));
        dto.setOrder(orderMapper.toDo(entity.getOrder()));
        dto.setCode(entity.getCode());
        dto.setType(entity.getType());
        dto.setMode(entity.getMode());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setContent(entity.getContent());
        return dto;
    }

    @Override
    public Transaction toEntity(TransactionDto dto) {
        Transaction entity = new Transaction();
        entity.setId(dto.getId());
//        entity.setUsers(userMapper.toEntity(dto.getUsers()));
//        entity.setOrder(orderMapper.toEntity(dto.getOrders()));
        entity.setCode(dto.getCode());
        entity.setType(dto.getType());
        entity.setMode(dto.getMode());
        entity.setStatus(dto.getStatus());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setContent(dto.getContent());
        return entity;
    }

    @Override
    public List<TransactionDto> toDo(List<Transaction> e) {
        List<TransactionDto> dtos = new ArrayList<>();
        e.forEach(transaction -> {
            TransactionDto dto = toDo(transaction);
            dtos.add(dto);
        });
        return dtos;
    }

    @Override
    public List<Transaction> toEntity(List<TransactionDto> d) {
        return null;
    }
}