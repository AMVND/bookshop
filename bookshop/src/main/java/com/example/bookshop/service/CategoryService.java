package com.example.bookshop.service;

import com.example.bookshop.domain.Category;
import com.example.bookshop.dto.CategoryDto;
import com.example.bookshop.mapper.CategoryMapper;
import com.example.bookshop.repository.CategoryRepository;
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
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    // Create new user
    @Transactional
    public void create(CategoryDto dto) {
        // Kiểm tra sự kiện Slug nhập vào đã tồn tại hay chưa? nếu rồi thì ngừng và in ra thng báo đã sử dụng.
        Optional<Category> categoryOptionalSlug = categoryRepository.findBySlug(dto.getSlug());
        if (categoryOptionalSlug.isPresent()) {
            throw new RuntimeException("Slug: " + dto.getSlug() + " đã được sử dụng.");
        }

        Category entity = categoryMapper.toEntity(dto);
        categoryRepository.save(entity);
        System.out.println("Thực thi create");
    }

    // Edit user
    @Transactional
    public void edit(Long id, CategoryDto dto) {
        Category entity = categoryMapper.toEntity(dto);
        entity.setId(id);
        entity.setTitle(dto.getTitle());
        entity.setSlug(dto.getSlug());
        entity.setContent(dto.getContent());
        categoryRepository.save(entity);
        System.out.println("Thực thi edit");
    }

    // Delete user
    @Transactional
    public void delete(Long id) {
        categoryRepository.deleteById(String.valueOf(id));
        System.out.println("Thực thi delete");
    }

    // get all
    public List<CategoryDto> findAll() {
        List<Category> entity = categoryRepository.findAll();
        List<CategoryDto> dtos = categoryMapper.toDo(entity);
        return dtos;
    }

    public List<CategoryDto> filter(String title) {
        List<Category> entity = categoryRepository.filter(title);
        List<CategoryDto> dtos = categoryMapper.toDo(entity);
        return dtos;
    }

    public CategoryDto singleProductCategory(String field) {
        Category entity = categoryRepository.singleProductCategory(field).orElseThrow(() -> new RuntimeException("sản phẩm không có category"));
        CategoryDto dto = categoryMapper.toDo(entity);
        return dto;
    }

    // todo: findAllCategory
    public Page<CategoryDto> findAllCategory(int offset, int pageSize, String field, String sort, String title) {
        Page<Category> entity = categoryRepository.findAllCategory(
                (PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.valueOf(sort), field))),
                title);
        Page<CategoryDto> dtos = entity.map(categoryMapper::toDo);
        return dtos;
    }

    public CategoryDto findById(String id) {
        Category entity = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy category id: " + id));
        CategoryDto dto = categoryMapper.toDo(entity);
        return dto;
    }
}
