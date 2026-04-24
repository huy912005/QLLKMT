package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.AuthRequest;
import com.Huy.WebBanHang.dto.request.RegisterRequest;
import com.Huy.WebBanHang.dto.request.ForgotPasswordRequest;
import com.Huy.WebBanHang.dto.respoonse.AuthResponse;
import com.Huy.WebBanHang.entity.ApplicationUserEntity;
import com.Huy.WebBanHang.repository.ApplicationUserRepository;
import com.Huy.WebBanHang.security.CustomUserDetailsService;
import com.Huy.WebBanHang.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;       
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final ApplicationUserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public AuthResponse login(AuthRequest request) {
        // 1. Quăng Username và Pass cho Hệ thống gác cổng quét nhau 
        // Nếu Sai mật khẩu: Lập tức bị vắng Exception (Và sẽ bá ị GlobalExceptionHandler tứm đầu)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // 2. Chạy qua cửa ải sống sót -> Lôi thông tin dưới DB lên chầu.
        UserDetails user = userDetailsService.loadUserByUsername(request.getUsername());

        // 2.5. Lấy userId — tìm theo cả username VÀ email (nhất quán với bước xác thực)
        ApplicationUserEntity userEntity = userRepository.findByUserNameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));

        // 3. Khởi động Máy In, in thẻ bì "Token" mới nóng hổi   
        String jwtToken = jwtUtil.generateToken(user);

        // 4. Nhét Token và vào hộp Response thẻy ra ngoài (lần này thêm userId)
        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .userId(userEntity.getId())
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Kiểm tra username đã tồn tại
        if (userRepository.findByUserName(request.getUsername()).isPresent()) { 
            throw new RuntimeException("Tài khoản đã tồn tại!");       
        }

        // 2. Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {       
            throw new RuntimeException("Email đã được đăng ký!");      
        }

        ApplicationUserEntity newUser = new ApplicationUserEntity();
        String userId = UUID.randomUUID().toString();
        newUser.setId(userId);
        newUser.setUserName(request.getUsername());
        // NormalizedUserName bắt buộc theo schema của ASP.NET Identity
        newUser.setNormalizedUserName(request.getUsername().toUpperCase());
        newUser.setEmail(request.getEmail());
        // NormalizedEmail bắt buộc theo schema của ASP.NET Identity
        newUser.setNormalizedEmail(request.getEmail().toUpperCase());
        newUser.setHoTen(request.getHoTen());

        String encodedPass = passwordEncoder.encode(request.getPassword());     
        newUser.setPasswordHash(encodedPass);

        userRepository.save(newUser);

        UserDetails userDetails = userDetailsService.loadUserByUsername(newUser.getUserName());
        String jwtToken = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(userDetails.getUsername())
                .userId(userId)
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        // 1. Kiểm tra Email có tồn tại trong hệ thống không        
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống!"));

        // 2. Gửi Email khôi phục (Tính năng mở rộng - Placeholder)  
        // System.out.println("Gửi Mail khôi phục đến: " + request.getEmmail());
    }

    /**
     * [CHỈ DÙNG KHI DEV] Tìm user theo username hoặc email, rồi encode lại password bằng BCrypt.
     * Dùng để fix user cũ tạo bởi C# ASP.NET Identity có hash format khác.
     */
    @Transactional
    public void resetPasswordDev(String username, String newPassword) {
        ApplicationUserEntity user = userRepository.findByUserNameOrEmail(username, username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user: " + username));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
