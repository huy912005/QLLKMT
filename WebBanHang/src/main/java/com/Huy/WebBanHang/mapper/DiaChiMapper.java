package com.Huy.WebBanHang.mapper;

import com.Huy.WebBanHang.dto.respoonse.*;
import com.Huy.WebBanHang.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DiaChiMapper {
    TinhResponse toTinhResponse(TinhEntity entity);
    @Mapping(source = "tinh.idTinh", target = "idTinh")
    XaPhuongResponse toXaPhuongResponse(XaPhuongEntity entity);
}
