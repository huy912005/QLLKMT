package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.YeuCauDoiTraRequest;
import com.Huy.WebBanHang.dto.respoonse.YeuCauDoiTraResponse;
import com.Huy.WebBanHang.entity.DonDatHangEntity;
import com.Huy.WebBanHang.entity.YeuCauDoiTraEntity;
import com.Huy.WebBanHang.mapper.YeuCauDoiTraMapper;
import com.Huy.WebBanHang.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class YeuCauDoiTraService {
    private final YeuCauDoiTraRepository yeuCauDoiTraRepository;
    private final DonDatHangRepository donDatHangRepository;
    private final ApplicationUserRepository userRepository;
    private final YeuCauDoiTraMapper yeuCauDoiTraMapper;

    // Gửi Yêu Cầu Đổi Trả
    @Transactional
    public void taoYeuCauDoiTra(String userId, YeuCauDoiTraRequest request) {
        // BƯỚC 1: Lấy đơn hàng ra kiểm tra
        DonDatHangEntity donHang = donDatHangRepository.findById(request.getIdDonDat())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        // BƯỚC 2: Ràng buộc Bảo mật - Đơn hàng này có đúng là của User đang đăng nhập
        // mua không?
        if (!donHang.getNguoiDung().getId().equals(userId))
            throw new RuntimeException("Bạn không có quyền thao tác trên đơn hàng của người khác");
        // BƯỚC 3: Ràng buộc Nghiệp vụ - Chỉ được đổi trả nếu đơn "Đã Giao"
        // (Đây là điểm nhấn Enterprise so với cơ bản)
        if (!"DA_GIAO".equalsIgnoreCase(donHang.getTrangThai()))
            throw new RuntimeException("Chỉ có thể yêu cầu đổi trả với đơn hàng đã được giao thành công");
        // BƯỚC 4: Ràng buộc Chống Spam - 1 đơn hàng chỉ được tạo yêu cầu 1 lần
        if (yeuCauDoiTraRepository.existsByDonDatHang_IdDonDat(request.getIdDonDat())) {
            // Nếu đã có bản ghi yêu cầu rồi nhưng trạng thái đơn hàng vẫn là DA_GIAO
            // thì cập nhật lại trạng thái đơn hàng cho đồng bộ (đề phòng dữ liệu cũ)
            donHang.setTrangThai("TRA_LAI");
            donDatHangRepository.save(donHang);
            throw new RuntimeException("Đơn hàng này đã được gửi yêu cầu đổi trả trước đó rồi (hệ thống đã cập nhật lại trạng thái đơn hàng cho bạn)");
        }
        // VƯỢT QUA HẾT VALIDATE -> TẠO MỚI
        YeuCauDoiTraEntity yeuCau = new YeuCauDoiTraEntity();
        yeuCau.setUser(userRepository.getReferenceById(userId));
        yeuCau.setDonDatHang(donHang); // Set object trỏ tới đơn hàng
        yeuCau.setLyDo(request.getLyDo());
        yeuCau.setTrangThai("CHO_XU_LY"); // Trạng thái mặc định chờ Admin duyệt
        yeuCau.setNgayTao(LocalDateTime.now());
        yeuCauDoiTraRepository.save(yeuCau);

        // BƯỚC 5: Cập nhật trạng thái đơn hàng thành TRA_LAI để Admin và User đều thấy
        donHang.setTrangThai("TRA_LAI");
        donDatHangRepository.save(donHang);
        // (Mở rộng: Chỗ này có thể trigger gọi class ThongBaoService để push 1 cái
        // Notification cho Admin)
    }

    // Xem lịch sử các yêu cầu đổi trả
    @Transactional(readOnly = true)
    public List<YeuCauDoiTraResponse> layDanhSachYeuCauCuaUser(String userId) {
        return yeuCauDoiTraRepository.findByUser_Id(userId).stream().map(yeuCauDoiTraMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Thay đổi trạng thái đổi trả
    @Transactional
    public void capNhatTrangThaiYeuCau(Integer idYeuCau, String trangThaiMoi) {
        YeuCauDoiTraEntity yeuCau = yeuCauDoiTraRepository.findById(idYeuCau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu đổi trả này"));
        yeuCau.setTrangThai(trangThaiMoi);
        yeuCauDoiTraRepository.save(yeuCau);
        // Nâng cao (Optional): Nếu "DONG_Y", bạn móc vào DonDatHangService để chuyển
        // trạng thái Đơn đặt hàng thành "DA_HOAN_TRA"
    }
    @Transactional
    public void huyYeuCau(int idYeuCau, String userId) {
        YeuCauDoiTraEntity yeuCau = yeuCauDoiTraRepository.findById(idYeuCau).orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu đổi trả này"));
        if (!yeuCau.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bảo mật: Bạn không có quyền thao tác trên yêu cầu của người khác");
        }
        if (!"CHO_XU_LY".equalsIgnoreCase(yeuCau.getTrangThai()) && !"ChoDuyet".equalsIgnoreCase(yeuCau.getTrangThai())) {
            throw new RuntimeException("Không thể hủy yêu cầu đã được Admin xử lý.");
        }
        DonDatHangEntity donHang = yeuCau.getDonDatHang();
        yeuCauDoiTraRepository.delete(yeuCau);

        // Khôi phục trạng thái đơn hàng về DA_GIAO sau khi hủy yêu cầu đổi trả
        if (donHang != null) {
            donHang.setTrangThai("DA_GIAO");
            donDatHangRepository.save(donHang);
        }
    }

}