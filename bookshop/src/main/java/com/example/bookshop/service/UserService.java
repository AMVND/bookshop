package com.example.bookshop.service;

import com.example.bookshop.config.SecurityUtils;
import com.example.bookshop.domain.Role;
import com.example.bookshop.domain.User;
import com.example.bookshop.repository.UserRepository;
import com.example.bookshop.dto.UserDto;
import com.example.bookshop.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class  UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;


    // Filter user by: id, firstName, lastName, mobile, email
    public List<UserDto> filter(String id, String firstName, String lastName, String mobile, String email) {
        List<User> entity = userRepository.filter(id, firstName, lastName, mobile, email);
        List<UserDto> dtos = userMapper.toDo(entity);
        return dtos;}

    // Edit user
    @Transactional
    public void edit(String id, UserDto dto){
        User entity = userRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy user với id: "+id));
//        entity.setPhotos(dto.getPhotos());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setMobile(dto.getMobile());
        entity.setEmail(dto.getEmail());
        entity.setVendor(dto.getVendor());
        entity.setIntro(dto.getIntro());
        entity.setProfile(dto.getProfile());
        entity.setRole(Role.valueOf(dto.getRole()));
        userRepository.save(entity);
        System.out.println("Thực thi edit data user");
    }

    // Delete user
    @Transactional
    public void delete(Long id) {
        userRepository.deleteById(String.valueOf(id));
        System.out.println("Thực thi delete");
    }
    // get all
    public List<UserDto> findAll (){
        List<User> entity =userRepository.findAll();
        List<UserDto> dtos = userMapper.toDo(entity);
        return dtos;
    }

    @Transactional
    public Page<UserDto> findAllPage(Pageable pageable){
        return userRepository.findAll(pageable).map(userMapper::toDo);
    }

    @Transactional
    public UserDto getUserInformation(){
        User entity = SecurityUtils.getPrincipal();
        UserDto dto = userMapper.toDo(entity);
        return dto;
    }
    // todo: findAllUsers by page
    public Page<UserDto> findAllUsers( int offset, int pageSize, String field, String sort, String keyname, String mobile, String email, String role) {
        Page<User> entity = userRepository.findAllUser(
                (PageRequest.of(offset, pageSize).withSort(Sort.by(Sort.Direction.valueOf(sort), field))),
                keyname, mobile, email,
                role);
        Page<UserDto> dtos = entity.map(userMapper::toDo);
        return dtos;
    }
    // todo: findUserById
    public UserDto findUserById(String id) {
        User entity = userRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy user với id: "+id));
        System.out.println("get user : " +entity.getFirstName() + entity.getLastName());
        UserDto dto = userMapper.toDo(entity);
        return dto;
    }

    public UserDto filterUserById(String id) {
        User entity = userRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy user với id: "+id));
        System.out.println("get user : " +entity.getFirstName() + entity.getLastName());
        UserDto dto = userMapper.toDo(entity);
        return dto;
    }
    // todo: ứng tuyển làm nhà cung cầp - vendor = 2
    public String changeVendor(String id,Integer vendor){
        User entity = userRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("Không tìm thấy user với id: "+id));
        entity.setVendor(vendor);
        userRepository.save(entity);
        if (vendor == 0){
            return "Người dùng không bán hàng nữa.";
        } else if (vendor == 1){
            return "Người dùng được phép bán hàng.";
        } else if (vendor == 2) {
            return "Người dùng ứng tuyển vị trí bán hàng";
        } else {
            return "Người dùng không được phép bán hàng";
        }

    }
}
