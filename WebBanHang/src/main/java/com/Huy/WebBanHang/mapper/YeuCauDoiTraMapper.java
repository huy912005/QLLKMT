package com.Huy.WebBanHang.mapper;

import com.Huy.WebBanHang.dto.respoonse.YeuCauDoiTraResponse;
import com.Huy.WebBanHang.entity.YeuCauDoiTraEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface YeuCauDoiTraMapper {
    @Mapping(target = "idDonDat", source = "donDatHang.idDonDat")
    YeuCauDoiTraResponse toResponse(YeuCauDoiTraEntity entity);
}
