package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.LoaiSanPhamRequest;
import com.Huy.WebBanHang.dto.respoonse.LoaiSanPhamResponse;
import com.Huy.WebBanHang.entity.LoaiSanPhamEntity;
import com.Huy.WebBanHang.mapper.LoaiSanPhamMapper;
import com.Huy.WebBanHang.repository.LoaiSanPhamRepository;
import com.Huy.WebBanHang.repository.SanPhamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoaiSanPhamService {
    private final LoaiSanPhamRepository loaiSanPhamRepository;
    private final SanPhamRepository sanPhamRepository;
    private final LoaiSanPhamMapper loaiSanPhamMapper;
    @Transactional(readOnly = true)
    public List<LoaiSanPhamResponse> getAllLoaiSanPham() {
        return loaiSanPhamRepository.findAll()
                .stream()
                .map(loaiSanPhamMapper::toResponse)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public LoaiSanPhamResponse getLoaiSanPhamById(String id) {
        LoaiSanPhamEntity entity = loaiSanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại sản phẩm với ID: " + id));
        return loaiSanPhamMapper.toResponse(entity);
    }
    @Transactional
    public LoaiSanPhamResponse createOrUpdate(LoaiSanPhamRequest request) {
        if (request == null)
            throw new IllegalArgumentException("Dữ liệu không hợp lệ (null)");
        LoaiSanPhamEntity entityToSave;
        if (request.getIdLoaiSanPham() != null && !request.getIdLoaiSanPham().isBlank() && loaiSanPhamRepository.existsById(request.getIdLoaiSanPham())) {
            entityToSave = loaiSanPhamRepository.findById(request.getIdLoaiSanPham()).get();
            loaiSanPhamMapper.updateEntityFromDto(request, entityToSave);
        } else {
            entityToSave = loaiSanPhamMapper.toEntity(request);
            if (entityToSave.getIdLoaiSanPham() == null || entityToSave.getIdLoaiSanPham().isBlank()) {
                entityToSave.setIdLoaiSanPham(generateNewId());
            }
        }
        LoaiSanPhamEntity savedEntity = loaiSanPhamRepository.save(entityToSave);
        return loaiSanPhamMapper.toResponse(savedEntity);
    }

    private String generateNewId() {
        // Find max ID or just count. Since IDs are strings like "LSP01", counting is risky if some are deleted.
        // But for this project's scale, count + 1 with prefix is common.
        long count = loaiSanPhamRepository.count();
        return String.format("LSP%02d", count + 1);
    }
    @Transactional
    public void deleteLoaiSanPham(String id) {
        LoaiSanPhamEntity loai = loaiSanPhamRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tồn tại loại sản phẩm này"));
        boolean dangDuocSuDung = sanPhamRepository.existsByLoaiSanPham_IdLoaiSanPham(id);
        if (dangDuocSuDung)
            throw new RuntimeException("Không thể xóa vì loại sản phẩm đang được sử dụng");
        loaiSanPhamRepository.delete(loai);
    }
}
