package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.ThanhToanRequest;
import com.Huy.WebBanHang.dto.respoonse.ThanhToanResponse;
import com.Huy.WebBanHang.entity.*;
import com.Huy.WebBanHang.mapper.ThanhToanMapper;
import com.Huy.WebBanHang.repository.*;
import lombok.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ThanhToanService {
    private final ThanhToanRepository thanhToanRepository;
    private final DonDatHangRepository donDatHangRepository;
    private final ThanhToanMapper thanhToanMapper;

    @Transactional
    public ThanhToanResponse taoMoiThanhToan(ThanhToanRequest request) {
        DonDatHangEntity donDatHang = donDatHangRepository.findById(request.getIdDonDat()).orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy đơn hàng mã " + request.getIdDonDat()));
        // Map từ Request thành cấu trúc của một Entity
        ThanhToanEntity thanhToan = thanhToanMapper.toEntity(request);
        // Gán lại đối tượng DonDatHang vì hồi nãy Mapper được dặn là "ignore"
        thanhToan.setDonDatHang(donDatHang);
        thanhToan.setDaThanhToan(false);
        // Save xuống DataBase
        ThanhToanEntity savedThanhToan = thanhToanRepository.save(thanhToan);
        // Chuyển ngược từ Entity thành Response DTO an toàn rồi ném thẳng ra Controller
        return thanhToanMapper.toResponse(savedThanhToan);
    }
    @Transactional
    public ThanhToanResponse xacNhanThanhToan(String idDonDat, String maGiaoDich) {
        ThanhToanEntity thanhToan = thanhToanRepository.findByDonDatHang_IdDonDat(idDonDat).orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch thanh toán cho đơn: " + idDonDat));
        if (thanhToan.isDaThanhToan())
            throw new RuntimeException("Đơn hàng này đã báo thanh toán thành công rồi!");
        thanhToan.setDaThanhToan(true);
        thanhToan.setNgayThanhToan(LocalDateTime.now());
        thanhToan.setMaGiaoDich(maGiaoDich);
        ThanhToanEntity updatedThanhToan = thanhToanRepository.save(thanhToan);
        // Dịch chuyển trạng thái của cái "Đơn đặt" về đã thanh toán luôn
        DonDatHangEntity donDatHang = thanhToan.getDonDatHang();
        donDatHang.setDaThanhToan(true);
        donDatHangRepository.save(donDatHang);
        return thanhToanMapper.toResponse(updatedThanhToan);
    }
}
