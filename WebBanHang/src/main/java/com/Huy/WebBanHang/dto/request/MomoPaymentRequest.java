package com.Huy.WebBanHang.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Request gửi lên từ React khi bấm "Thanh toán MoMo"
 * POST /api/checkout/momo/create
 */
@Data
public class MomoPaymentRequest {
    /** Tên khách hàng */
    @NotBlank(message = "FullName không được bỏ trống")
    private String fullName;

    /** Nội dung đơn hàng */
    private String orderInfo = "Thanh toan don hang";

    /** Số tiền (VND) – tính từ giỏ hàng */
    @NotNull(message = "Amount không được bỏ trống")
    private BigDecimal amount;

    // Tuỳ chọn: SĐT, địa chỉ để tạo đơn hàng đồng thời
    private String sdtGiaoHang;
    private String soNha;
}
