package com.Huy.WebBanHang.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter { // Bảo đảm chỉ quét mỗi gói thư đi qua đúng 1 lần
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        // 1. Dòm xem trên đỉnh (Header) Của lá thư có nhãn "Authorization" không?
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userName;
        // Nếu không có mộc hoặc không bắt đầu bằng "Bearer " thì Vứt lá thư đó đi, cấm vào luồng sâu!
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        // 2. Chặt cụt khúc đầu, lấy đúng chữ Token
        jwt = authHeader.substring(7);
        try {
            // Máy quét bắt đầu soi mã User giấu trong Token
            userName = jwtUtil.extractUsername(jwt);
            // Móc được User, và kiểm tra xem có phải máy chủ mới hoàn toàn hay không
            if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Mời ông Cảnh Sát CSDL "UserDetailsService" đem CMND ra so cọng râu
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userName);
                // Máy quét check in coi mộc có thật không? Có hết hạn chưa?
                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    // Mọi thứ hoàn hảo! Cấp thẻ VIP vào cổng (Đăng Nhập Thành Công Ảo)
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Lưu cờ đánh dấu Thằng Này Đã Được Đăng Nhập
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Bắt được token fake hoặc linh tinh thì làm lơ, đẩy ra ngoài
        }
        // 3. Cho phép request chạy tiếp vô Các Vùng Cấm Controller
        filterChain.doFilter(request, response);
    }
}
