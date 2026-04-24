package com.Huy.WebBanHang.mapper;

import com.Huy.WebBanHang.dto.respoonse.ChiTietGioHangResponse;
import com.Huy.WebBanHang.entity.ChiTietGioHangEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChiTietGioHangMapper {
    ChiTietGioHangResponse toResponse(ChiTietGioHangEntity entity);
}
