package com.Huy.WebBanHang.mapper;
import com.Huy.WebBanHang.dto.respoonse.SanPhamResponse;
import com.Huy.WebBanHang.dto.sanPham.SanPhamUpsertDto;
import com.Huy.WebBanHang.entity.SanPhamEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

// componentModel="spring" để Service có thể gọi nó qua @RequiredArgsConstructor
@Mapper(componentModel = "spring")
public interface SanPhamMapper {
    // Map dto sang entity. Những trường khác tên (idCongTy -> congTy) chúng ta ignore để map bằng tay sau.
    @Mapping(target = "congTy",ignore = true)
    @Mapping(target = "loaiSanPham",ignore = true)
    SanPhamEntity toEntity(SanPhamUpsertDto dto);
    //Dùng cho hàm Update: Trộn dữ liệu từ DTO đè lên Entity cũ lấy từ CSDL lên
    @Mapping(target = "congTy",ignore = true)
    @Mapping(target = "loaiSanPham",ignore = true)
    void updateEntityFromDto(SanPhamUpsertDto dto, @MappingTarget SanPhamEntity entity);
    //Dùng để response
    @Mapping(source = "congTy.tenCongTy", target = "tenCongTy")
    @Mapping(source = "loaiSanPham.tenLoaiSanPham", target = "tenLoaiSanPham")
    @Mapping(source = "congTy.idCongTy", target = "idCongTy")
    @Mapping(source = "loaiSanPham.idLoaiSanPham", target = "idLoaiSanPham")
    SanPhamResponse toResponse(SanPhamEntity entity);
}
