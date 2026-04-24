package com.Huy.WebBanHang.mapper;

import com.Huy.WebBanHang.dto.request.CongTyRequest;
import com.Huy.WebBanHang.dto.respoonse.CongTyResponse;
import com.Huy.WebBanHang.entity.CongTyEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CongTyMapper {
    CongTyEntity toEntity(CongTyRequest request);
    // Hàm trộn data cho lúc Update
    void updateEntityFromDto(CongTyRequest request, @MappingTarget CongTyEntity entity);
    CongTyResponse toResponse(CongTyEntity entity);
}
