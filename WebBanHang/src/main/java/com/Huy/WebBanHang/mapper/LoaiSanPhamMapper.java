package com.Huy.WebBanHang.mapper;
import com.Huy.WebBanHang.dto.request.LoaiSanPhamRequest;
import com.Huy.WebBanHang.dto.respoonse.LoaiSanPhamResponse;
import com.Huy.WebBanHang.entity.LoaiSanPhamEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LoaiSanPhamMapper {
    LoaiSanPhamEntity toEntity(LoaiSanPhamRequest request);
    void updateEntityFromDto(LoaiSanPhamRequest request, @MappingTarget LoaiSanPhamEntity entity);
    LoaiSanPhamResponse toResponse(LoaiSanPhamEntity entity);
}