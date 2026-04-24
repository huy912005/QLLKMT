package com.Huy.WebBanHang.security;

import com.Huy.WebBanHang.entity.ApplicationUserEntity;
import com.Huy.WebBanHang.repository.ApplicationUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final ApplicationUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Đem UserName hoặc Email xuống DB tra hỏi
        ApplicationUserEntity user = userRepository.findByUserNameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("Tài khoản hoặc Email không tồn tại!"));

        // Đóng gói lại thành chuẩn Spring giao nộp
        return new CustomUserDetails(user);
    }
}
