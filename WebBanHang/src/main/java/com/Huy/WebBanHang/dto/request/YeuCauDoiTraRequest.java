package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class YeuCauDoiTraRequest {
    @NotBlank(message = "Mã đơn đặt hàng không được bỏ trống")
    private String idDonDat;
    @NotBlank(message = "Lý do đổi trả không được bỏ trống")
    private String lyDo;
}