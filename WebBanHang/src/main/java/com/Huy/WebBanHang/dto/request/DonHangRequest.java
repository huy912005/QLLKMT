package com.Huy.WebBanHang.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonHangRequest {
    @NotBlank(message = "Số điện thoại giao hàng không được bỏ trống")
    private String sdtGiaoHang;
    @NotBlank(message = "Địa chỉ/Số nhà không được bỏ trống")
    private String soNha;
    @NotBlank(message = "Phương thức thanh toán không được bỏ trống")
    private String thanhToan;
}
