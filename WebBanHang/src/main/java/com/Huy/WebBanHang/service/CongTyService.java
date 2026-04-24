package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.CongTyRequest;
import com.Huy.WebBanHang.dto.respoonse.CongTyResponse;
import com.Huy.WebBanHang.entity.CongTyEntity;
import com.Huy.WebBanHang.mapper.CongTyMapper;
import com.Huy.WebBanHang.repository.CongTyRepository;
import com.Huy.WebBanHang.repository.SanPhamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CongTyService {
    private final CongTyRepository congTyRepository;
    private final SanPhamRepository sanPhamRepository;
    private final CongTyMapper congTyMapper;
//    Lấy toàn bộ danh sách Công Ty
    @Transactional(readOnly = true)
    public List<CongTyResponse> getAllCongTy() {
        return congTyRepository.findAll().stream().map(congTyMapper::toResponse).collect(Collectors.toList());
    }
//    Lấy 1 Công ty theo ID
    @Transactional(readOnly = true)
    public CongTyResponse getCongTyById(String id) {
        CongTyEntity entity = congTyRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy công ty với ID: " + id));
        return congTyMapper.toResponse(entity);
    }
//    Tạo mới hoặc Cập nhật Công Ty
    @Transactional
    public CongTyResponse createOrUpdate(CongTyRequest request) {
        if (request == null)
            throw new IllegalArgumentException("Request không hợp lệ");
        CongTyEntity entityToSave;
        // có id thì update
        if (request.getIdCongTy() != null && !request.getIdCongTy().isBlank() && congTyRepository.existsById(request.getIdCongTy())) {
            entityToSave = congTyRepository.findById(request.getIdCongTy()).get();
            congTyMapper.updateEntityFromDto(request, entityToSave);
        } else {
            entityToSave = congTyMapper.toEntity(request);
            if (entityToSave.getIdCongTy() == null || entityToSave.getIdCongTy().isBlank()) {
                entityToSave.setIdCongTy(generateNewId());
            }
        }
        CongTyEntity savedEntity = congTyRepository.save(entityToSave);
        return congTyMapper.toResponse(savedEntity);
    }

    private String generateNewId() {
        long count = congTyRepository.count();
        return String.format("CT%02d", count + 1);
    }
//    Xóa Công Ty
    @Transactional
    public void deleteCongTy(String id) {
        CongTyEntity entity = congTyRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy công ty với ID: " + id));
        boolean isUsed = sanPhamRepository.existsByCongTy_IdCongTy(id);
        if (isUsed)
            throw new RuntimeException("Không thể xóa do công ty đang có dữ liệu trong bảng Sản phẩm!");
        congTyRepository.delete(entity);
    }
}
