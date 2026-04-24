package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.DanhGiaRequest;
import com.Huy.WebBanHang.dto.respoonse.DanhGiaResponse;
import com.Huy.WebBanHang.dto.respoonse.DanhGiaTongHopResponse;
import com.Huy.WebBanHang.entity.DanhGiaSanPhamEntity;
import com.Huy.WebBanHang.entity.HinhAnhDanhGiaEntity;
import com.Huy.WebBanHang.mapper.DanhGiaMapper;
import com.Huy.WebBanHang.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DanhGiaService {
    private final DanhGiaSanPhamRepository danhGiaRepository;
    private final HinhAnhDanhGiaRepository hinhAnhDanhGiaRepository;
    private final ApplicationUserRepository userRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DanhGiaMapper danhGiaMapper;
    private final String UPLOAD_DIR = "uploads/images/danhgia/";

    @Transactional(readOnly = true)
    public DanhGiaTongHopResponse getDanhGiaBySanPham(String idSanPham) {
        if (!sanPhamRepository.existsById(idSanPham))
            throw new RuntimeException("Sản phẩm không tồn tại");
        List<DanhGiaSanPhamEntity> danhGiaList = danhGiaRepository.findBySanPhamIdSanPham(idSanPham);
        if (danhGiaList.isEmpty())
            throw new RuntimeException("Chưa tồn tại đánh giá nào!");
        DanhGiaTongHopResponse result = new DanhGiaTongHopResponse();
        Double avg = danhGiaRepository.getAverageRatingBySanPham(idSanPham);
        result.setDiemTrungBinh(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        List<DanhGiaResponse> responses = danhGiaList.stream().map(danhGiaMapper::toResponse).collect(Collectors.toList());
        result.setDanhGiaList(responses);
        return result;
    }
//    Khách hàng Đánh giá + Upload Ảnh
    @Transactional
    public void taoDanhGia(String userId, DanhGiaRequest request) throws IOException {
        // 1. Kiểm tra spam (1 user gõ nhiều đánh giá cho 1 SP)
        boolean daDanhGia = danhGiaRepository.existsByUser_IdAndSanPham_IdSanPham(userId, request.getIdSanPham());
        if (daDanhGia)
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi!");
        // 2. Map Proxy và Lưu form Text trước
        DanhGiaSanPhamEntity danhGia = new DanhGiaSanPhamEntity();
        danhGia.setUser(userRepository.getReferenceById(userId));
        danhGia.setSanPham(sanPhamRepository.getReferenceById(request.getIdSanPham()));
        danhGia.setNoiDung(request.getNoiDung());
        danhGia.setSoSao(request.getSoSao());
        danhGia.setNgayDanhGia(LocalDateTime.now());
        DanhGiaSanPhamEntity savedDanhGia = danhGiaRepository.save(danhGia);
        // 3. Xử lý Upload Ảnh
        if (request.getHinhAnhs() != null && !request.getHinhAnhs().isEmpty()) {
            // Tạo thư mục nếu chưa có
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();
            for (MultipartFile file : request.getHinhAnhs()) {
                if (!file.isEmpty()) {
                    // Logic đặt tên file ngẫu nhiên chống trùng: UUID + Extension
                    String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
                    String fileName = UUID.randomUUID().toString() + extension;
                    Path filePath = Paths.get(UPLOAD_DIR, fileName);
                    Files.copy(file.getInputStream(), filePath); // Copy bit nén (tương đương copyTo(stream) bên C#)
                    // Ghi vào Database ảnh
                    HinhAnhDanhGiaEntity hinhAnhEntity = new HinhAnhDanhGiaEntity();
                    hinhAnhEntity.setDanhGiaSanPham(savedDanhGia); // Set khóa ngoại ngược về đánh giá
                    hinhAnhEntity.setImageUrl("/images/danhgia/" + fileName);
                    hinhAnhDanhGiaRepository.save(hinhAnhEntity);
                }
            }
        }
    }
}
