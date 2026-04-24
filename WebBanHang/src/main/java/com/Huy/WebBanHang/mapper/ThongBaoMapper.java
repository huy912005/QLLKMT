package com.Huy.WebBanHang.mapper;

import com.Huy.WebBanHang.dto.request.ThongBaoRequest;
import com.Huy.WebBanHang.dto.respoonse.ThongBaoResponse;
import com.Huy.WebBanHang.entity.ThongBaoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ThongBaoMapper {
    @Mapping(target = "idThongBao", ignore = true)
    @Mapping(target = "user", ignore = true)     // Xử lý móc User bằng tay ở Service
    @Mapping(target = "daDoc", ignore = true)    // Mặc định false
    @Mapping(target = "ngayTao", ignore = true)  // Mặc định sinh tự động
    ThongBaoEntity toEntity(ThongBaoRequest request);
    @Mapping(source = "user.id", target = "userId")
    ThongBaoResponse toResponse(ThongBaoEntity entity);
}
