package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CongTyRequest {
    private String idCongTy;
    @NotBlank(message = "Tên công ty không được để trống")
    private String tenCongTy;
}
