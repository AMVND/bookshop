package com.example.bookshop.controller;

import com.example.bookshop.dto.APIResponse;
import com.example.bookshop.dto.ProductCategoryDto;
import com.example.bookshop.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/product-category")
public class ProductCategoryController {
    private final ProductCategoryService productCategoryService;

    @PostMapping("/auth/create")
    public void create(@RequestBody ProductCategoryDto dto) {
        productCategoryService.create(dto);
    }

    //edit
    @PutMapping("/auth/update/{id}")
    public void edit(@RequestBody ProductCategoryDto dto, @PathVariable("id") Long id) {
        productCategoryService.edit(id, dto);
    }

    @PutMapping("/auth/product/{productId}/category/{categoryId}")
    public ResponseEntity<?> handleChangeProductCategory(
            @PathVariable Long productId,
            @PathVariable String categoryId
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(productCategoryService.handleChangeProductCategory(productId, categoryId));
    }

    //delete
    @DeleteMapping("/auth/delete/{id}")
    public void delete(@PathVariable("id") Long id) {
        productCategoryService.delete(id);
    }

    @GetMapping("/api/find-all")
    public List<ProductCategoryDto> findAll() {
        List<ProductCategoryDto> dtos = productCategoryService.findAll();
        return dtos;
    }

    @GetMapping("/api/{productId}")
    public ProductCategoryDto findByProductId(@PathVariable Long productId) {
        ProductCategoryDto dto = productCategoryService.findByProductId(productId);
        return dto;
    }

    //
    @GetMapping("/auth/admin/{offset}/{pageSize}/{field}")
    private APIResponse<Page<ProductCategoryDto>> filterAllProduct(
            @RequestParam(value = "title", defaultValue = "") String title,
            @PathVariable int offset,
            @PathVariable int pageSize,
            @PathVariable String field,
            @RequestParam(value = "status", defaultValue = "") String status,
            @RequestParam(value = "category", defaultValue = "") String category,
            @RequestParam String sort) {
        Page<ProductCategoryDto> dtos = productCategoryService.filterAllProduct(
                title, offset, pageSize, field, status, category, sort
        );
        return new APIResponse<>(dtos.getSize(), dtos);
    }

}
