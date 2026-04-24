package com.Huy.WebBanHang.security;

import com.Huy.WebBanHang.entity.ApplicationUserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    // Gói thằng User của Database lại
    private final ApplicationUserEntity user;

    // Gõ đoạn khởi tạo này vào
    public CustomUserDetails(ApplicationUserEntity user) {
        this.user = user;
    }
    public String getId() {
        return user.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Tạm thời cấp quyền chung là "ROLE_USER".
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash(); // Mình phải chỉ định rõ field nào là Password
    }

    @Override
    public String getUsername() {
        return user.getUserName(); // Khóa tài khoản dùng để Login
    }

    // Pass qua đoạn kiểm duyệt khóa account mặc định (Mặc định cho Tự Do Trắng Án hết)
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
