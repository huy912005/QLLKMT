package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.AdminCreateUserRequest;
import com.Huy.WebBanHang.entity.ApplicationUserEntity;
import com.Huy.WebBanHang.repository.ApplicationUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final ApplicationUserRepository userRepository;
    private final com.Huy.WebBanHang.repository.ApplicationRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final jakarta.persistence.EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllUsers() {
        List<ApplicationUserEntity> users = userRepository.findAllWithRolesAndXaPhuong();
        return users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("userName", u.getUserName());
            map.put("email", u.getEmail());
            map.put("phone", u.getPhoneNumber());
            
            String tenXa = (u.getXaPhuong() != null) ? u.getXaPhuong().getTenXaPhuong() : "";
            String diaChi = (u.getSoNha() != null ? u.getSoNha() : "") + ", " + tenXa;
            if (diaChi.startsWith(", ")) diaChi = diaChi.substring(2);
            
            map.put("diaChi", diaChi);
            // Lấy danh sách tên vai trò
            String userRoles = "";
            if (u.getRoles() != null && !u.getRoles().isEmpty()) {
                userRoles = u.getRoles().stream()
                        .map(com.Huy.WebBanHang.entity.ApplicationRoleEntity::getName)
                        .collect(Collectors.joining(", "));
            }
            map.put("role", userRoles.isEmpty() ? "No Role" : userRoles);
            map.put("emailConfirmed", true);
            map.put("isOtpVerified", u.isOtpVerified());
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<com.Huy.WebBanHang.entity.ApplicationRoleEntity> getAllRoles() {
        try {
            List<com.Huy.WebBanHang.entity.ApplicationRoleEntity> roles = roleRepository.findAll();
            System.out.println("===> Tìm thấy số lượng vai trò trong DB: " + roles.size());
            return roles;
        } catch (Exception e) {
            System.err.println("===> LỖI KHI LẤY VAI TRÒ: " + e.getMessage());
            return java.util.List.of();
        }
    }

    @Transactional(readOnly = true)
    public List<String> getDatabaseTables() {
        try {
            return entityManager.createNativeQuery("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
                    .getResultList();
        } catch (Exception e) {
            return List.of("Lỗi: " + e.getMessage());
        }
    }

    @Transactional
    public void createUser(AdminCreateUserRequest request) {
        if (userRepository.findByUserName(request.getUserName()).isPresent()) {
            throw new RuntimeException("UserName đã tồn tại");
        }

        ApplicationUserEntity user = new ApplicationUserEntity();
        user.setId(UUID.randomUUID().toString());
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setOtpVerified(true);
        // Mã hóa mật khẩu
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Gán Role nếu có
        if (request.getRoleName() != null && !request.getRoleName().trim().isEmpty()) {
            com.Huy.WebBanHang.entity.ApplicationRoleEntity role = roleRepository.findByName(request.getRoleName())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò: " + request.getRoleName()));
            user.getRoles().clear();
            user.getRoles().add(role);
        }
        
        userRepository.save(user);
    }

    @Transactional
    public void updateUser(String id, com.Huy.WebBanHang.dto.request.AdminUpdateUserRequest request) {
        ApplicationUserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        // Cập nhật Role nếu có
        if (request.getRoleName() != null && !request.getRoleName().trim().isEmpty()) {
            com.Huy.WebBanHang.entity.ApplicationRoleEntity role = roleRepository.findByName(request.getRoleName())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò: " + request.getRoleName()));
            user.getRoles().clear();
            user.getRoles().add(role);
        }

        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String id) {
        ApplicationUserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        userRepository.delete(user);
    }
}
