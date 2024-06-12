package com.example.bookshop.service;

import com.example.bookshop.domain.Category;
import com.example.bookshop.domain.ProductCategory;
import com.example.bookshop.dto.ProductCategoryDto;
import com.example.bookshop.mapper.ProductCategoryMapper;
import com.example.bookshop.repository.CategoryRepository;
import com.example.bookshop.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductCategoryMapper productCategoryMapper;
    private final CategoryRepository categoryRepository;

    // Create new user
    @Transactional
    public void create(ProductCategoryDto dto) {
//         Kiểm tra sự kiện Slug nhập vào đã tồn tại hay chưa? nếu rồi thì ngừng và in ra thng báo đã sử dụng.
//        Optional<Category> categoryOptionalSlug = categoryRepository.findBySlug(dto.getSlug());
//        if (categoryOptionalSlug.isPresent()) {
//            throw new RuntimeException("Slug: " + dto.getSlug() + " đã được sử dụng.");
//        }

        ProductCategory entity = productCategoryMapper.toEntity(dto);
        productCategoryRepository.save(entity);
        System.out.println("Thực thi create");
    }

    // Edit user
    @Transactional
    public void edit(Long id, ProductCategoryDto dto) {
        ProductCategory entity = productCategoryMapper.toEntity(dto);
        entity.setId(id);
        productCategoryRepository.save(entity);
        System.out.println("Thực thi edit");
    }

    // Delete user
    @Transactional
    public void delete(Long id) {
        productCategoryRepository.deleteById(String.valueOf(id));
        System.out.println("Thực thi delete");
    }

    // get all
    public List<ProductCategoryDto> findAll() {
        List<ProductCategory> entity = productCategoryRepository.findAll();
        List<ProductCategoryDto> dtos = productCategoryMapper.toDo(entity);
        return dtos;
    }

    // todo: findByProductId
    public ProductCategoryDto findByProductId(Long productId) {
        Optional<ProductCategory> entity = productCategoryRepository.findByProductId(productId);
        if (entity.isPresent()) {
            ProductCategoryDto dto = productCategoryMapper.toDo(entity.get());
            return dto;
        } else return null;

    }


    public Page<ProductCategoryDto> filterAllProduct(String title, int offset, int pageSize, String field, String status, String category, String sort) {
        Page<ProductCategory> entity = productCategoryRepository.filterAllProduct(title,
                (PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.valueOf(sort), field))),
                category,
                status);
        Page<ProductCategoryDto> dtos = entity.map(productCategoryMapper::toDo);
        return dtos;
    }


    public String handleChangeProductCategory(Long productId, String categoryId) {
        ProductCategory entity = productCategoryRepository.findByProductId(productId).orElse(null);
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (entity != null && category != null) {
            entity.setCategory(category);
            productCategoryRepository.save(entity);
            return "true";
        } else {
            return "false";
        }
    }
}
