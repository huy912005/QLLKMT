package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.ThongBaoRequest;
import com.Huy.WebBanHang.dto.respoonse.ThongBaoResponse;
import com.Huy.WebBanHang.entity.ApplicationUserEntity;
import com.Huy.WebBanHang.entity.ThongBaoEntity;
import com.Huy.WebBanHang.mapper.ThongBaoMapper;
import com.Huy.WebBanHang.repository.ApplicationUserRepository;
import com.Huy.WebBanHang.repository.ThongBaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThongBaoService {
    private final ThongBaoRepository thongBaoRepository;
    private final ApplicationUserRepository userRepository;
    private final ThongBaoMapper thongBaoMapper;

    @Transactional(readOnly = true) // Phủ sóng chống thao tác ghi (Save) nhem nhuốc khi chỉ cần Select
    public List<ThongBaoResponse> layDanhSachThongBaoCuaUser(String userId) {
        List<ThongBaoEntity> danhSach = thongBaoRepository.findByUser_IdOrderByNgayTaoDesc(userId);
        return danhSach.stream().map(thongBaoMapper::toResponse).collect(Collectors.toList());
    }
//    thông báo cho User
    @Transactional
    public ThongBaoResponse taoThongBao(ThongBaoRequest request) {
        ApplicationUserEntity user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("Không tìm thấy User nhận thông báo!"));
        ThongBaoEntity thongBao = thongBaoMapper.toEntity(request);
        thongBao.setUser(user);
        thongBao.setDaDoc(false);
        thongBao.setNgayTao(LocalDateTime.now());
        ThongBaoEntity saved = thongBaoRepository.save(thongBao);
        return thongBaoMapper.toResponse(saved);
    }
//    Khi User click vào thông báo -> đánh dấu đã đọc
    @Transactional
    public void danhDauDaDoc(int idThongBao) {
        ThongBaoEntity thongBao = thongBaoRepository.findById(idThongBao).orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
        thongBao.setDaDoc(true);
        thongBaoRepository.save(thongBao);
    }
//    Lấy con số để hiển thị số mảng đỏ trên Icon Quả chuông
    @Transactional(readOnly = true)
    public int demSoThongBaoChuaDoc(String userId) {
        return thongBaoRepository.countByUser_IdAndDaDocFalse(userId);
    }
}