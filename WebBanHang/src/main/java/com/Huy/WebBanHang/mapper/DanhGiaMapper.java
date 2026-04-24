package com.Huy.WebBanHang.mapper;

import com.Huy.WebBanHang.dto.respoonse.DanhGiaResponse;
import com.Huy.WebBanHang.entity.DanhGiaSanPhamEntity;
import com.Huy.WebBanHang.entity.HinhAnhDanhGiaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface DanhGiaMapper {
    @Mapping(target = "userName", expression = "java(entity.getUser().getHoTen() != null ? entity.getUser().getHoTen() : entity.getUser().getUserName())")
    @Mapping(target = "imageUrls", expression = "java(mapImages(entity.getHinhAnhDanhGias()))")
    DanhGiaResponse toResponse(DanhGiaSanPhamEntity entity);
    default List<String> mapImages(List<HinhAnhDanhGiaEntity> images) {
        if (images == null) return List.of();
        return images.stream().map(HinhAnhDanhGiaEntity::getImageUrl).collect(Collectors.toList());
    }
}
