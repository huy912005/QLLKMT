package com.Huy.WebBanHang.service;


import com.Huy.WebBanHang.dto.request.ChiTietGioHangRequest;
import com.Huy.WebBanHang.dto.respoonse.ChiTietGioHangResponse;
import com.Huy.WebBanHang.entity.ApplicationUserEntity;
import com.Huy.WebBanHang.entity.ChiTietGioHangEntity;
import com.Huy.WebBanHang.entity.SanPhamEntity;
import com.Huy.WebBanHang.mapper.ChiTietGioHangMapper;
import com.Huy.WebBanHang.repository.ApplicationUserRepository;
import com.Huy.WebBanHang.repository.ChiTietGioHangRepository;
import com.Huy.WebBanHang.repository.SanPhamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChiTietGioHangService {
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final SanPhamRepository sanPhamRepository;
    private final ChiTietGioHangMapper chiTietGioHangMapper;
    private final ApplicationUserRepository userRepository;

    @Transactional
    public void addToCart(String userId, ChiTietGioHangRequest request) {
        SanPhamEntity sanPham = sanPhamRepository.findById(request.getIdSanPham()).orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong hệ thống"));
        // Tìm xem người dùng đã có nó trong giỏ chưa
        ChiTietGioHangEntity cartFromDb = chiTietGioHangRepository.findByUser_IdAndSanPham_IdSanPham(userId, request.getIdSanPham());
        if (cartFromDb != null) {
            // Đã có cộng dồn số lượng
            cartFromDb.setSoLuongTrongGio(cartFromDb.getSoLuongTrongGio() + request.getSoLuongTrongGio());
            chiTietGioHangRepository.save(cartFromDb);
        } else {
            // Chưa có Tạo mới
            ChiTietGioHangEntity newCartItem = new ChiTietGioHangEntity();
            newCartItem.setIdChiTietGioHang("GH" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
            ApplicationUserEntity userProxy = userRepository.getReferenceById(userId);
            newCartItem.setUser(userProxy);
            newCartItem.setSanPham(sanPham);

            newCartItem.setSoLuongTrongGio(request.getSoLuongTrongGio());
            chiTietGioHangRepository.save(newCartItem);
        }
    }
    @Transactional(readOnly = true)
    public List<ChiTietGioHangResponse> getUserCart(String userId) {
        return chiTietGioHangRepository.findByUser_IdNguoiDung(userId).stream().map(chiTietGioHangMapper::toResponse).collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public long getCartCount(String userId) {
        return chiTietGioHangRepository.countByUser_IdNguoiDung(userId);
    }
    @Transactional
    public void deleteCartItem(String userId, String idSanPham) {
        ChiTietGioHangEntity cartItem = chiTietGioHangRepository.findByUser_IdAndSanPham_IdSanPham(userId, idSanPham);
        if (cartItem == null)
            throw new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng");
        chiTietGioHangRepository.delete(cartItem);
    }
    @Transactional
    public int plus(String userId, String idSanPham) {
        ChiTietGioHangEntity cartItem = chiTietGioHangRepository.findByUser_IdAndSanPham_IdSanPham(userId, idSanPham);
        if (cartItem == null) throw new RuntimeException("Lỗi: Không tìm thấy sản phẩm");
        cartItem.setSoLuongTrongGio(cartItem.getSoLuongTrongGio() + 1);
        chiTietGioHangRepository.save(cartItem);
        return cartItem.getSoLuongTrongGio();
    }
    @Transactional
    public int minus(String userId, String idSanPham) {
        ChiTietGioHangEntity cartItem = chiTietGioHangRepository.findByUser_IdAndSanPham_IdSanPham(userId, idSanPham);
        if (cartItem == null)
            throw new RuntimeException("Lỗi: Không tìm thấy sản phẩm");
        if (cartItem.getSoLuongTrongGio() <= 1)
            throw new RuntimeException("Số lượng không thể nhỏ hơn 1");
        cartItem.setSoLuongTrongGio(cartItem.getSoLuongTrongGio() - 1);
        chiTietGioHangRepository.save(cartItem);
        return cartItem.getSoLuongTrongGio();
    }
}
