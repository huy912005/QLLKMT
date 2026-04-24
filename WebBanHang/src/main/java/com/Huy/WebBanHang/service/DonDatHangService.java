package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.DonHangRequest;
import com.Huy.WebBanHang.dto.respoonse.ChiTietDonHangResponse;
import com.Huy.WebBanHang.dto.respoonse.DonDatHangResponse;
import com.Huy.WebBanHang.entity.ApplicationUserEntity;
import com.Huy.WebBanHang.entity.ChiTietDonHangEntity;
import com.Huy.WebBanHang.entity.ChiTietGioHangEntity;
import com.Huy.WebBanHang.entity.DonDatHangEntity;
import com.Huy.WebBanHang.repository.ApplicationUserRepository;
import com.Huy.WebBanHang.repository.ChiTietDonHangRepository;
import com.Huy.WebBanHang.repository.ChiTietGioHangRepository;
import com.Huy.WebBanHang.repository.DonDatHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class DonDatHangService {
    private final DonDatHangRepository donDatHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final ApplicationUserRepository userRepository;
 // Đặt hàng
    @Transactional
    public String checkout(String userId, DonHangRequest request) {
        // Quét Giỏ hàng của User này. Nếu rỗng thì báo lỗi!
        List<ChiTietGioHangEntity> cartItems = chiTietGioHangRepository.findByUser_IdNguoiDung(userId);
        if (cartItems.isEmpty())
            throw new RuntimeException("Giỏ hàng rỗng, không thể tiến hành đặt hàng!");
        DonDatHangEntity order = new DonDatHangEntity();
        String orderId = generateOrderId();
        order.setIdDonDat(orderId);
        ApplicationUserEntity userProxy = userRepository.getReferenceById(userId);
        order.setNguoiDung(userProxy);
        order.setSdtGiaoHang(request.getSdtGiaoHang());
        order.setSoNha(request.getSoNha());
        order.setThanhToan(request.getThanhToan());
        order.setNgayDat(LocalDateTime.now());
        order.setTrangThai("CHO_XAC_NHAN");
        order.setDaThanhToan(false);
        donDatHangRepository.save(order);
        // Đổ Giỏ hàng sang Chi Tiết Đơn Hàng
        for (ChiTietGioHangEntity cartItem : cartItems) {
            ChiTietDonHangEntity orderDetail = new ChiTietDonHangEntity();
            orderDetail.setDonDatHang(order);
            // Map Sản phẩm từ Giỏ qua
            orderDetail.setSanPham(cartItem.getSanPham());
            orderDetail.setSoLuong(cartItem.getSoLuongTrongGio());
            orderDetail.setDonGia(cartItem.getSanPham().getGia());
            chiTietDonHangRepository.save(orderDetail);
        }
        chiTietGioHangRepository.deleteAll(cartItems);
        return orderId;
    }
    private String generateOrderId() {
        DonDatHangEntity lastOrder = donDatHangRepository.findTopByOrderByIdDonDatDesc();
        if (lastOrder == null || lastOrder.getIdDonDat() == null)
            return "D0001";
        String lastId = lastOrder.getIdDonDat();
        try {
            // Cắt bỏ chữ "D" ở đầu, chỉ lấy số "0015" và ép kiểu sang Int (Ra 15)
            int currentNumber = Integer.parseInt(lastId.substring(1));
            currentNumber++;
            return String.format("D%04d", currentNumber);
        } catch (Exception e) {
            return "D" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        }
    }
//    Cập nhật trạng thái đơn hàng
    @Transactional
    public void updateOrderStatus(String orderId, String newStatus) {
        DonDatHangEntity order = donDatHangRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setTrangThai(newStatus);
        if ("DA_GIAO".equalsIgnoreCase(newStatus))
            order.setNgayGiaoDuKien(LocalDateTime.now());
        donDatHangRepository.save(order);
    }

    // ================== ADMIN - DANH SÁCH ĐƠN HÀNG ==================
    @Transactional(readOnly = true)
    public List<DonDatHangResponse> getAllOrders() {
        List<DonDatHangEntity> orders = donDatHangRepository.findAll();
        return orders.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    // ================== ADMIN - CHI TIẾT ĐƠN HÀNG ==================
    public DonDatHangResponse getOrderById(String orderId) {
        DonDatHangEntity order = donDatHangRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));
        return convertToResponse(order);
    }

    // ================== ADMIN - XÓA ĐƠN HÀNG ==================
    @Transactional
    public void deleteOrder(String orderId) {
        DonDatHangEntity order = donDatHangRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));
        donDatHangRepository.delete(order);
    }

    // ================== CUSTOMER - DANH SÁCH ĐƠN HÀNG CỦA USER ==================
    public List<DonDatHangResponse> getOrdersByUserId(String userId) {
        List<DonDatHangEntity> orders = donDatHangRepository.findByNguoiDung_Id(userId);
        return orders.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    // ================== CUSTOMER - HỦY ĐƠN HÀNG ==================
    @Transactional
    public void cancelOrder(String userId, String orderId) {
        DonDatHangEntity order = donDatHangRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));
        
        if (!order.getNguoiDung().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền thực hiện hành động này!");
        }
        
        if (!"CHO_XAC_NHAN".equals(order.getTrangThai())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận!");
        }
        
        order.setTrangThai("DA_HUY");
        donDatHangRepository.save(order);
    }

    // ================== CUSTOMER - MUA LẠI ĐƠN HÀNG ==================
    @Transactional
    public void reorder(String userId, String orderId) {
        DonDatHangEntity order = donDatHangRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderId));
        
        if (!order.getNguoiDung().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền thực hiện hành động này!");
        }

        for (ChiTietDonHangEntity detail : order.getChiTietDonHangs()) {
            ChiTietGioHangEntity cartItem = chiTietGioHangRepository.findByUser_IdAndSanPham_IdSanPham(userId, detail.getSanPham().getIdSanPham());
            if (cartItem != null) {
                cartItem.setSoLuongTrongGio(cartItem.getSoLuongTrongGio() + detail.getSoLuong());
                chiTietGioHangRepository.save(cartItem);
            } else {
                ChiTietGioHangEntity newCartItem = new ChiTietGioHangEntity();
                newCartItem.setIdChiTietGioHang("GH" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
                newCartItem.setUser(order.getNguoiDung());
                newCartItem.setSanPham(detail.getSanPham());
                newCartItem.setSoLuongTrongGio(detail.getSoLuong());
                chiTietGioHangRepository.save(newCartItem);
            }
        }

        // Theo yêu cầu: Nếu đơn hàng này ở trạng thái ĐÃ HỦY, hệ thống sẽ xóa luôn nó khỏi lịch sử
        if (order.getTrangThai() != null && "DA_HUY".equalsIgnoreCase(order.getTrangThai().trim())) {
            System.out.println("===> Bắt đầu xóa đơn hàng đã hủy: " + order.getIdDonDat());
            donDatHangRepository.delete(order);
        }
    }

    // ================== HELPER METHOD - CONVERT ENTITY TO DTO ==================
    private DonDatHangResponse convertToResponse(DonDatHangEntity order) {
        // Tính tổng tiền an toàn
        BigDecimal tongTien = BigDecimal.ZERO;
        if (order.getChiTietDonHangs() != null) {
            tongTien = order.getChiTietDonHangs().stream()
                    .filter(detail -> detail.getDonGia() != null)
                    .map(detail -> detail.getDonGia().multiply(new BigDecimal(detail.getSoLuong())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        // Convert chi tiết an toàn
        List<ChiTietDonHangResponse> chiTietResponses = java.util.List.of();
        if (order.getChiTietDonHangs() != null) {
            chiTietResponses = order.getChiTietDonHangs().stream()
                    .map(detail -> {
                        String sanPhamId = detail.getSanPham() != null ? detail.getSanPham().getIdSanPham() : "Unknown";
                        String tenSanPham = detail.getSanPham() != null ? detail.getSanPham().getTenSanPham() : "Unknown";
                        String imageURL = detail.getSanPham() != null ? detail.getSanPham().getImageURL() : "";
                        BigDecimal donGia = detail.getDonGia() != null ? detail.getDonGia() : BigDecimal.ZERO;
                        int count = detail.getSoLuong();
                        return ChiTietDonHangResponse.builder()
                                .idSanPham(sanPhamId)
                                .tenSanPham(tenSanPham)
                                .imageURL(imageURL)
                                .soLuong(count)
                                .donGia(donGia)
                                .thanhTien(donGia.multiply(new BigDecimal(count)))
                                .build();
                    })
                    .collect(Collectors.toList());
        }

        String userId = "Unknown";
        String userName = "Người dùng đã xóa";
        try {
            if (order.getNguoiDung() != null) {
                userId = order.getNguoiDung().getId() != null ? order.getNguoiDung().getId() : "Unknown";
                userName = order.getNguoiDung().getHoTen() != null ? order.getNguoiDung().getHoTen() : 
                           (order.getNguoiDung().getUserName() != null ? order.getNguoiDung().getUserName() : "Unknown User");
            }
        } catch (Exception e) {
            System.err.println("Cannot load user for order: " + order.getIdDonDat());
        }

        return DonDatHangResponse.builder()
                .idDonDat(order.getIdDonDat())
                .idNguoiDung(userId)
                .tenNguoiDung(userName)
                .sdtGiaoHang(order.getSdtGiaoHang())
                .soNha(order.getSoNha())
                .trangThai(order.getTrangThai())
                .thanhToan(order.getThanhToan())
                .ngayDat(order.getNgayDat())
                .ngayThanhToan(order.getNgayThanhToan())
                .ngayGiaoDuKien(order.getNgayGiaoDuKien())
                .daThanhToan(order.isDaThanhToan())
                .tongTien(tongTien)
                .chiTietDonHangs(chiTietResponses)
                .build();
    }
}
