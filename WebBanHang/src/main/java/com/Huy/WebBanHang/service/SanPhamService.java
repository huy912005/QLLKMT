package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.respoonse.SanPhamResponse;
import com.Huy.WebBanHang.dto.sanPham.SanPhamUpsertDto;
import com.Huy.WebBanHang.entity.SanPhamEntity;
import com.Huy.WebBanHang.mapper.SanPhamMapper;
import com.Huy.WebBanHang.repository.CongTyRepository;
import com.Huy.WebBanHang.repository.LoaiSanPhamRepository;
import com.Huy.WebBanHang.repository.SanPhamRepository;
import com.Huy.WebBanHang.utils.FileUploadUtil;
import org.springframework.transaction.annotation.Transactional;
import lombok.*;
import org.springframework.stereotype.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SanPhamService {
    private final SanPhamRepository sanPhamRepository;
    private final CongTyRepository congTyRepository;
    private final LoaiSanPhamRepository loaiSanPhamRepository;
    private final SanPhamMapper sanPhamMapper;

    // @Transactional: Cái này thay thế hoàn toàn cho _unitOfWork.Save()
    // Nếu hàm chạy mượt, Spring tự Save xuống DB.
    // Nếu có lỗi Exception tung ra, Spring tự Rollback sạch sẽ.
    @Transactional(readOnly = true)
    public List<SanPhamResponse> getAllSanPham() {
        return sanPhamRepository.findAll().stream().map(sanPhamEntity -> sanPhamMapper.toResponse(sanPhamEntity))
                .toList();
    }
    @Transactional
    public void upsertSanPham(SanPhamUpsertDto dto) throws IOException {
        SanPhamEntity sanPham;
        if (dto.getIdSanPham() != null && !dto.getIdSanPham().equals("")) {
            // Chế độ UPDATE: lấy entity cũ từ DB
            sanPham = sanPhamRepository.findById(dto.getIdSanPham()).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));
            sanPhamMapper.updateEntityFromDto(dto, sanPham);
        } else {
            // Chế độ CREATE: tạo entity mới
            sanPham = sanPhamMapper.toEntity(dto);
            sanPham.setIdSanPham(generateNewId());
        }
        // Chỉ update CongTy nếu có ID mới được truyền vào
        if (dto.getIdCongTy() != null && !dto.getIdCongTy().isBlank()) {
            sanPham.setCongTy(congTyRepository.getReferenceById(dto.getIdCongTy()));
        }
        // Chỉ update LoaiSanPham nếu có ID mới được truyền vào
        if (dto.getIdLoaiSanPham() != null && !dto.getIdLoaiSanPham().isBlank()) {
            sanPham.setLoaiSanPham(loaiSanPhamRepository.getReferenceById(dto.getIdLoaiSanPham()));
        }
        // Chỉ update ảnh nếu có file mới được upload
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String path = FileUploadUtil.saveFile(dto.getImage());
            sanPham.setImageURL(path);
        }
        sanPhamRepository.save(sanPham);
    }
    private String generateNewId() {
        return String.format("SP%03d", sanPhamRepository.count() + 1);
    }
    @Transactional(readOnly = true)
    public SanPhamResponse getSanPhamById(String id) {
        SanPhamEntity sanPham = sanPhamRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tồn tại sản phẩm!"));
        return sanPhamMapper.toResponse(sanPham);
    }

    @Transactional
    public void deleteSanPham(String id) {
        SanPhamEntity obj = sanPhamRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tồn tại sản phẩm"));
        try {
            sanPhamRepository.delete(obj);
            sanPhamRepository.flush(); // Bắt lỗi CSDL lập tức nếu sản phẩm có khóa ngoại
        } catch (Exception e) {
            throw new RuntimeException("Sản phẩm đang được sử dụng");
        }
    }

    // ================= DÀNH CHO CUSTOMER =================

    @Transactional(readOnly = true)
    public List<SanPhamResponse> getAllCustomerSanPham(String loai) {
        if (loai == null || loai.trim().isEmpty()) {
            return getAllSanPham();
        }
        return sanPhamRepository.getSanPhamByTenLoai(loai).stream().map(sanPhamMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> searchSanPham(String q) {
        if (q == null || q.trim().isEmpty()) return List.of();
        
        List<SanPhamEntity> products = sanPhamRepository.searchSanPham(q.trim());
        return products.stream().map(p -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", p.getIdSanPham());
            map.put("tenSanPham", p.getTenSanPham());
            map.put("gia", p.getGia());
            map.put("imageURL", p.getImageURL());
            map.put("loai", p.getLoaiSanPham() != null ? p.getLoaiSanPham().getTenLoaiSanPham() : "");
            return map;
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<SanPhamResponse> getTop10BanChay() {
        return sanPhamRepository.findTop10BestSelling().stream().map(sanPhamMapper::toResponse).toList();
    }
}
