package com.example.bookshop.mapper;

import com.example.bookshop.domain.Comment;
import com.example.bookshop.dto.CommentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CommentMapper implements EntityMapper<CommentDto, Comment> {
    @Autowired
    UserMapper userMapper;
    @Autowired
    ProductMapper productMapper;

    @Override
    public CommentDto toDo(Comment entity) {
        CommentDto dto = new CommentDto();
        dto.setId(entity.getId());
        dto.setUser(userMapper.toDo(entity.getUser()));
        dto.setProduct(productMapper.toDo(entity.getProduct()));
        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setParentId(entity.getParentId());
        return dto;
    }

    @Override
    public Comment toEntity(CommentDto dto) {
        Comment entity = new Comment();
        entity.setId(dto.getId());
//        entity.setProduct(productMapper.toEntity(dto.getProduct()));
        entity.setContent(dto.getContent());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setParentId(dto.getParentId());
        return entity;
    }

    @Override
    public List<CommentDto> toDo(List<Comment> e) {
        List<CommentDto> dtos = new ArrayList<>();
        e.forEach(comment -> {
            CommentDto dto = toDo(comment);
            dtos.add(dto);
        });
        return dtos;
    }

    @Override
    public List<Comment> toEntity(List<CommentDto> d) {
        return null;
    }
}
