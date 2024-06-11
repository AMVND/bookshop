package com.example.bookshop.service;

import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.Product;
import com.example.bookshop.domain.ProductReview;
import com.example.bookshop.repository.ProductRepository;
import com.example.bookshop.repository.ProductReviewRepository;
import com.example.bookshop.dto.ProductReviewDto;
import com.example.bookshop.mapper.ProductReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductRevewService {
    private final ProductReviewMapper productReviewMapper;
    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;

    public void create(ProductReviewDto dto){
        ProductReview entity = productReviewMapper.toEntity(dto);
        Product product = productRepository.findById(dto.getProductId()).orElse(null);
        entity.setProduct(product);
        entity.setUser(SecurityUtils.getPrincipal());
        entity.setPublished(0);
        entity.setCreatedAt(Instant.now());
        productReviewRepository.save(entity);
    }
    public void delete(String id){
        ProductReview entity = productReviewRepository.findById(id).orElseThrow();
        productReviewRepository.delete(entity);
    }

    public ProductReviewDto filterRatingWithUserAndProduct(Long productId){
        ProductReview entity = productReviewRepository.filterRatingWithUserAndProduct(
                SecurityUtils.getPrincipal().getId(), productId
        ).orElse(null);
        if (entity != null){
        ProductReviewDto dto = productReviewMapper.toDo(entity);

        return dto;
        } else {
            System.out.println("Bạn chưa đánh giá sản phẩm này!");
            return null;
        }
    }
    public List<ProductReviewDto> getAllByProduct(String productId){
        List<ProductReview> entity = productReviewRepository.findByProduct(productId);
        List<ProductReviewDto> dtos = productReviewMapper.toDo(entity);
        return dtos;
    }
}