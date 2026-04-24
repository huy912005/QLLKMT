package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.MomoPaymentRequest;
import com.Huy.WebBanHang.dto.respoonse.MomoPaymentResponse;
import com.Huy.WebBanHang.entity.*;
import com.Huy.WebBanHang.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * CheckoutService – xử lý luồng đặt hàng + thanh toán MoMo từ React Frontend
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final ChiTietGioHangRepository gioHangRepository;
    private final DonDatHangRepository     donDatHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final ThanhToanRepository      thanhToanRepository;
    private final ApplicationUserRepository userRepository;
    private final MomoService              momoService;

    // ─────────────────────────────────────────────────────────
    // 1. COD – Đặt hàng thanh toán khi nhận
    // ─────────────────────────────────────────────────────────
    @Transactional
    public String confirmCodOrder(String userName) {
        ApplicationUserEntity user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + userName));

        List<ChiTietGioHangEntity> cartItems = gioHangRepository.findByUser_IdNguoiDung(user.getId());
        if (cartItems.isEmpty())
            throw new RuntimeException("Giỏ hàng trống, không thể đặt hàng!");

        // Tạo đơn hàng
        String orderId = generateOrderId();
        DonDatHangEntity order = new DonDatHangEntity();
        order.setIdDonDat(orderId);
        order.setNguoiDung(user);
        order.setSdtGiaoHang(user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        order.setSoNha(user.getSoNha() != null ? user.getSoNha() : "");
        order.setThanhToan("COD");
        order.setNgayDat(LocalDateTime.now());
        order.setTrangThai("CHO_XAC_NHAN");
        order.setDaThanhToan(false);
        donDatHangRepository.save(order);

        // Chuyển giỏ hàng → chi tiết đơn hàng
        BigDecimal tongTien = BigDecimal.ZERO;
        for (ChiTietGioHangEntity item : cartItems) {
            ChiTietDonHangEntity detail = new ChiTietDonHangEntity();
            detail.setDonDatHang(order);
            detail.setSanPham(item.getSanPham());
            detail.setSoLuong(item.getSoLuongTrongGio());
            detail.setDonGia(item.getSanPham().getGia());
            chiTietDonHangRepository.save(detail);
            tongTien = tongTien.add(
                item.getSanPham().getGia().multiply(BigDecimal.valueOf(item.getSoLuongTrongGio()))
            );
        }

        // Khởi tạo bản ghi ThanhToan (COD chưa thanh toán)
        ThanhToanEntity thanhToan = new ThanhToanEntity();
        thanhToan.setDonDatHang(order);
        thanhToan.setPhuongThuc("COD");
        thanhToan.setSoTien(tongTien);
        thanhToan.setDaThanhToan(false);
        thanhToanRepository.save(thanhToan);

        // Xóa giỏ hàng
        gioHangRepository.deleteAll(cartItems);

//        log.info("[Checkout-COD] Tạo đơn {} thành công cho user {}", orderId, userId);
        return orderId;
    }

    // ─────────────────────────────────────────────────────────
    // 2. MoMo – Tạo link thanh toán MoMo
    // ─────────────────────────────────────────────────────────
    @Transactional
    public MomoPaymentResponse createMomoPayment(String userName, MomoPaymentRequest request) {
        ApplicationUserEntity user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + userName));

        List<ChiTietGioHangEntity> cartItems = gioHangRepository.findByUser_IdNguoiDung(user.getId());
        if (cartItems.isEmpty())
            throw new RuntimeException("Giỏ hàng trống, không thể tạo thanh toán!");

        // Tạo đơn hàng TRƯỚC (trạng thái ChờTT)
        String orderId = generateOrderId();
        DonDatHangEntity order = new DonDatHangEntity();
        order.setIdDonDat(orderId);
        order.setNguoiDung(user);
        order.setSdtGiaoHang(user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        order.setSoNha(user.getSoNha() != null ? user.getSoNha() : "");
        order.setThanhToan("MOMO");
        order.setNgayDat(LocalDateTime.now());
        order.setTrangThai("CHO_XAC_NHAN");
        order.setDaThanhToan(false);
        donDatHangRepository.save(order);

        // Chuyển giỏ → chi tiết đơn
        BigDecimal tongTien = BigDecimal.ZERO;
        for (ChiTietGioHangEntity item : cartItems) {
            ChiTietDonHangEntity detail = new ChiTietDonHangEntity();
            detail.setDonDatHang(order);
            detail.setSanPham(item.getSanPham());
            detail.setSoLuong(item.getSoLuongTrongGio());
            detail.setDonGia(item.getSanPham().getGia());
            chiTietDonHangRepository.save(detail);
            tongTien = tongTien.add(
                item.getSanPham().getGia().multiply(BigDecimal.valueOf(item.getSoLuongTrongGio()))
            );
        }

        // Khởi tạo ThanhToan (chưa thanh toán, chờ MoMo confirm)
        ThanhToanEntity thanhToan = new ThanhToanEntity();
        thanhToan.setDonDatHang(order);
        thanhToan.setPhuongThuc("MOMO");
        thanhToan.setSoTien(tongTien);
        thanhToan.setDaThanhToan(false);
        thanhToanRepository.save(thanhToan);

        // KHÔNG xóa giỏ ngay – chờ sau khi MoMo IPN confirm mới xóa
        // Gọi API MoMo để lấy payUrl
        request.setAmount(tongTien);  // dùng giá thực tế thay vì FE gửi lên
        MomoPaymentResponse momoResp = momoService.createPayment(request, orderId);

        if (momoResp.getResultCode() != 0 || momoResp.getPayUrl() == null || momoResp.getPayUrl().isBlank()) {
            // Gặp lỗi → rollback đơn hàng vừa tạo
            log.warn("[MoMo] Tạo link thất bại, xóa đơn {}", orderId);
            chiTietDonHangRepository.deleteAll(order.getChiTietDonHangs() != null ? order.getChiTietDonHangs() : List.of());
            thanhToanRepository.delete(thanhToan);
            donDatHangRepository.delete(order);
            throw new RuntimeException(momoResp.getMessage() != null ? momoResp.getMessage() : "Không thể tạo link MoMo");
        }

        log.info("[Checkout-MoMo] Tạo link thành công cho đơn {} → {}", orderId, momoResp.getPayUrl());
        return momoResp;
    }

    // ─────────────────────────────────────────────────────────
    // 3. MoMo IPN callback – MoMo gọi vào backend server-to-server
    // ─────────────────────────────────────────────────────────
    @Transactional
    public void handleMomoIpn(java.util.Map<String, String> params) {
        String orderId    = params.getOrDefault("orderId", "");
        String resultCode = params.getOrDefault("resultCode", "-1");
        String transId    = params.getOrDefault("transId", "");

        log.info("[MoMo-IPN] orderId={} resultCode={} transId={}", orderId, resultCode, transId);

        // Xác thực chữ ký
        if (!momoService.verifyIpnSignature(params)) {
            log.warn("[MoMo-IPN] Signature KHÔNG hợp lệ! Bỏ qua.");
            return;
        }

        if (!"0".equals(resultCode)) {
            log.warn("[MoMo-IPN] Thanh toán thất bại (resultCode={}), không cập nhật.", resultCode);
            return;
        }

        // Cập nhật ThanhToan & DonDatHang
        thanhToanRepository.findByDonDatHang_IdDonDat(orderId).ifPresent(tt -> {
            if (!tt.isDaThanhToan()) {
                tt.setDaThanhToan(true);
                tt.setNgayThanhToan(LocalDateTime.now());
                tt.setMaGiaoDich(transId);
                thanhToanRepository.save(tt);

                DonDatHangEntity don = tt.getDonDatHang();
                don.setDaThanhToan(true);
                donDatHangRepository.save(don);

                // Xóa giỏ hàng sau khi thanh toán thành công
                String userId = don.getNguoiDung().getId();
                List<ChiTietGioHangEntity> cartItems = gioHangRepository.findByUser_IdNguoiDung(userId);
                gioHangRepository.deleteAll(cartItems);

                log.info("[MoMo-IPN] Đơn {} đã thanh toán thành công!", orderId);
            }
        });
    }

    // ─────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────
    private String generateOrderId() {
        DonDatHangEntity last = donDatHangRepository.findTopByOrderByIdDonDatDesc();
        if (last == null || last.getIdDonDat() == null) return "D0001";
        try {
            int num = Integer.parseInt(last.getIdDonDat().substring(1));
            return String.format("D%04d", num + 1);
        } catch (Exception e) {
            return "D" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        }
    }

    // (Phương thức getField đã bỏ - dùng getter trực tiếp)
}
