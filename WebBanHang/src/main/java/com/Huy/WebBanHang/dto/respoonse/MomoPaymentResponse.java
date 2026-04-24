package com.Huy.WebBanHang.dto.respoonse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response trả về cho React sau khi tạo link MoMo
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MomoPaymentResponse {
    /** URL chuyển hướng đến cổng MoMo */
    private String payUrl;
    /** Mã đơn hàng nội bộ */
    private String orderId;
    /** Số tiền */
    private String amount;
    /** Mô tả kết quả */
    private String message;
    /** resultCode: 0 = OK */
    private int resultCode;
    /** Mã QR nếu có */
    private String qrCodeUrl;
}
