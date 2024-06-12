package com.example.bookshop.controller;

import com.example.bookshop.dto.APIResponse;
import com.example.bookshop.dto.ProductDto;
import com.example.bookshop.payload.response.DataResponse;
import com.example.bookshop.projection.ProductInfo;
import com.example.bookshop.service.ImageProductService;
import com.example.bookshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;
    private final ImageProductService imageProductService;

    /*
    user đăng nhập thực hiện tạo sản phẩm mới

     */
    @PostMapping("/auth")
    public void create(@RequestBody ProductDto dto) {
        productService.create(dto);
    }

    //edit by id
    /*
    Người dùng thực hiện thay đổi thông tin sản phẩm họ đăng bán

     */
    @PutMapping("/auth/{id}")
    public void edit(@PathVariable String id, @RequestBody ProductDto dto) {
        productService.edit(id, dto);
    }

    /*
    find product by id
     */
    @GetMapping("/auth/{id}")
    public ProductDto findByProductId(@PathVariable String id) {
        ProductDto dto = productService.findByProductId(id);
        return dto;
    }

    //delete by id
    @DeleteMapping("/auth/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(productService.delete(id));
    }

    @GetMapping("/api/find-all-product")
    public List<ProductDto> findAllProduct() {
        List<ProductDto> dtos = productService.findAllProduct();
        return dtos;
    }


    @GetMapping("/api/filter")
    public List<ProductDto> filter(@RequestParam(defaultValue = "") String keySearch) {
        List<ProductDto> dtos = productService.filter(keySearch);
        return dtos;
    }


    @GetMapping("/auth/user")
    public List<ProductDto> findByUsers(@RequestParam(value = "") String title) {
        List<ProductDto> dtos = productService.findByUsers(title);
        return dtos;
    }

    // todo: filterUsersProducts - user lọc tất cả các product của mình ở dạng page
    @GetMapping("/auth/user/{offset}/{pageSize}/{field}")
    private APIResponse<Page<ProductDto>> filterUsersProducts(
            @PathVariable int offset,
            @PathVariable int pageSize,
            @PathVariable String field,
            @RequestParam(value = "title", defaultValue = "") String title,
            @RequestParam String categoryId,
            @RequestParam(value = "status", defaultValue = "") String status,
            @RequestParam String sort) {
        Page<ProductDto> dtos = productService.filterUsersProducts(title, offset, pageSize, field, categoryId, status, sort);
        return new APIResponse<>(dtos.getSize(), dtos);
    }

    // todo: filterAllProducts - admin lọc tất cả các product ở dạng page
    @GetMapping("/auth/admin/{offset}/{pageSize}")
    private APIResponse<Page<ProductDto>> filterAllProducts(
            @PathVariable int offset,
            @PathVariable int pageSize,
            @RequestParam String field,
            @RequestParam String sort,
            @RequestParam String username,
            @RequestParam String ptitle,
            @RequestParam String ctitle,
            @RequestParam String status,
            @RequestParam String vendor

    ) {
        Page<ProductDto> dtos = productService.filterAllProducts(offset, pageSize, field, sort,
                username, ptitle, ctitle, status, vendor);
        return new APIResponse<>(dtos.getSize(), dtos);
    }


    //Tesst page
    @GetMapping("/api/page")
    private APIResponse<List<ProductDto>> getProduct() {
        List<ProductDto> dtos = productService.findAllProduct();
        return new APIResponse<>(dtos.size(), dtos);
    }

    @GetMapping("/api/{field}/{key}")
    private APIResponse<List<ProductDto>> getProductsWithSort(@PathVariable String field, @PathVariable String key) {
        List<ProductDto> dtos = productService.findProductsWithSorting(field, key);
        return new APIResponse<>(dtos.size(), dtos);
    }

    @GetMapping("/api/pagination/{offset}/{pageSize}")
    private APIResponse<Page<ProductDto>> getProductsWithPagination(@PathVariable int offset, @PathVariable int pageSize) {
        Page<ProductDto> dtos = productService.findProductsWithPagination(offset, pageSize);
        return new APIResponse<>(dtos.getSize(), dtos);
    }
    // get page api not filter: chỉ get all
//    @GetMapping("/api/paginationAndSort/{offset}/{pageSize}/{field}")
//    private APIResponse<Page<ProductDto>> getProductsWithPaginationAndSort(@PathVariable int offset, @PathVariable int pageSize, @PathVariable String field){
//        Page<ProductDto> dtos = productService.findProductsWithPaginationAndSorting(offset, pageSize, field);
//        return new APIResponse<>(dtos.getSize(), dtos);
//    }

    // todo: test page

    @GetMapping("/api/paginationAndSort/{offset}/{pageSize}/{field}")
    private APIResponse<Page<ProductDto>> getProductsWithPaginationAndSort(

            @PathVariable int offset,
            @PathVariable int pageSize,
            @RequestParam(value = "title", defaultValue = "") String title,
            @RequestParam(value = "categoryId", defaultValue = "") String categoryId,
            @PathVariable String field) {
        Page<ProductDto> dtos = productService.findProductsWithPaginationAndSorting(offset, pageSize, title, categoryId, field);
        return new APIResponse<>(dtos.getSize(), dtos);
    }


    //
    @GetMapping("/api/findProductBySlug/{slug}")
    public ProductDto findProductBySlug(@PathVariable String slug) {
        return productService.findProductBySlug(slug);

    }

    /*
    /product/auth/admin/filter?sort={column}&field={Direction: phương hướng}
     */
    @GetMapping("/auth/admin/filter")
    public List<ProductDto> filterProduct(@RequestParam String sort, @RequestParam String field) {
        List<ProductDto> dtos = productService.filterProduct(sort, field);
        return dtos;
    }

    // todo: Quản lý trạng thái của sản phẩm - NCC
    @PutMapping("/auth/change-status")
    public void changeStatus(@RequestParam("id") String id, @RequestParam("status") int status) {
        productService.setStatusProduct(id, status);
    }

    // Quản lý trạng thái status của các product:
    @PutMapping("/auth/admin/setStatus")
    public void setStatusProduct(@RequestParam("id") String id, @RequestParam("status") int status) {
        productService.setStatusProduct(id, status);
    }

    // sản phẩm mới nhất
    @GetMapping("/api/lastest-product")
    public DataResponse<List<ProductDto>> lastestProduct(@RequestParam String field) {
        List<ProductDto> dtos = productService.lastestProduct(field);
        if (dtos != null) {
            return new DataResponse<>(true, dtos, "Product found successfully.");
        } else {
            return new DataResponse<>(false, null, "Product not found.");
        }
    }

    // todo: upload image
    @PostMapping("/auth/image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile file, @RequestParam("slug") String slug)
            throws IOException {
        String uploadImage = imageProductService.uploadImage(file, slug);
        return ResponseEntity.status(HttpStatus.OK)
                .body(uploadImage);
    }

    // todo: admin thay đổi thuộc tính cho product - không có ảnh
    @PostMapping("/auth/admin/handleChangeProduct")
    public ResponseEntity<?> handleChangeProduct(
            @RequestParam("id") String id,
            @RequestParam("slug") String slug,
            @RequestParam("title") String title,
            @RequestParam("summary") String summary,
            @RequestParam("price") Float price,
            @RequestParam("discount") Float discount,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("content") String content
    ) throws IOException {
        return ResponseEntity.status(HttpStatus.OK)
                .body(productService.handleChangeProduct(
                        id, slug, title, summary, price, discount, quantity, content
                ));
    }

    @GetMapping("/auth/image/{fileName}")
    public ResponseEntity<?> downloadImage(@PathVariable String fileName) {
        byte[] imageData = imageProductService.downloadImage(fileName);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(imageData);

    }

    @GetMapping("/api/filter_product_by_category")
    public ResponseEntity<?> filterProductByCategory() {
        return ResponseEntity.status(HttpStatus.OK).body(productService.filterProductByCategory());
    }

    // todo: hiển thị danh sách sản phẩm bán chạy nhất
    @GetMapping("/api/best_selling_product/{offset}/{pageSize}")
    public APIResponse<Page<ProductInfo>> findBestSellingProduct(
            @PathVariable int offset,
            @PathVariable int pageSize,
            @RequestParam String title,
            @RequestParam LocalDate time1,
            @RequestParam LocalDate time2,
            @RequestParam String sort,
            @RequestParam String field

    ) {
        Page<ProductInfo> dtos = productService.findBestSellingProduct(
                offset, pageSize,
                title, time1, time2,
                sort, field);
        return new APIResponse<>(dtos.getSize(), dtos);
    }
}
