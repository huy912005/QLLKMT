package com.Huy.WebBanHang.mapper;

import com.Huy.WebBanHang.dto.request.ThanhToanRequest;
import com.Huy.WebBanHang.dto.respoonse.ThanhToanResponse;
import com.Huy.WebBanHang.entity.ThanhToanEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ThanhToanMapper {
    @Mapping(target = "idThanhToan", ignore = true)
    @Mapping(target = "donDatHang", ignore = true)
    @Mapping(target = "daThanhToan", ignore = true)
    @Mapping(target = "ngayThanhToan", ignore = true)
    @Mapping(target = "maGiaoDich", ignore = true)
    ThanhToanEntity toEntity(ThanhToanRequest request);
    @Mapping(source = "donDatHang.idDonDat", target = "idDonDat")
    ThanhToanResponse toResponse(ThanhToanEntity entity);
}