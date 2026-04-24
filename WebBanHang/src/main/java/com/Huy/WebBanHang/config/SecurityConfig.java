package com.Huy.WebBanHang.config;

import com.Huy.WebBanHang.security.CustomUserDetailsService;
import com.Huy.WebBanHang.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    // 1. Phân quyền và Cấu hình các luồng cửa (Routes)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOriginPatterns(java.util.List.of("*"));
                    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(java.util.List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .csrf(csrf -> csrf.disable()) // Tắt tính năng chặn Form giả mạo (Vì mình dùng Token nên miễn nhiễm rồi)
                .authorizeHttpRequests(auth -> auth
                        // CHÚ Ý: Mấy đường dẫn này là Miễn Phí (Ai vào cũng được)
                        .requestMatchers("/api/auth/**", "/api/diachi/**", "/api/customer/**", "/api/checkout/momo/ipn").permitAll()

                        // Mọi đường link API bị ẩn đi khác (Ví dụ checkout, admin...) bắt buộc phải CÓ
                        // TOKEN (Thẻ)
                        .anyRequest().authenticated())
                // Khai báo: Web này dùng API REST, không chơi Session Cookie vớ vẩn, có Token
                // thì nói chuyện
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authenticationProvider(authenticationProvider())

                // Xếp đội hình: Cho ông Filter (bảo vệ) mình vừa code đứng chặn ngay Cửa đầu
                // tiên của Spring
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 2. Chỉ định Ông Cụ CSDL và Dàn Máy Nhận Diện (Bộ giải mã Password)
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 4. Kích hoạt Manager này để chút nữa Controller Màn Hình Login gọi tới
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
