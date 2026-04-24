package com.Huy.WebBanHang.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

/**
 * Request gửi lên từ React khi bấm "Đặt hàng (COD)"
 * POST /api/checkout/confirm
 */
@Data
public class CheckoutRequest {
    /** "cod" | "momo" | "banking" */
    @NotBlank(message = "Phương thức thanh toán không được bỏ trống")
    private String paymentMethod;

    /**
     * Số điện thoại giao hàng (tuỳ chọn – nếu đã có trong profile thì backend tự
     * lấy)
     */
    private String sdtGiaoHang;

    /** Địa chỉ giao hàng (tuỳ chọn) */
    private String soNha;
}
