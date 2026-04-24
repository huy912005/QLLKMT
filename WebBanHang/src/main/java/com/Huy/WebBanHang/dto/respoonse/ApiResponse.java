package com.Huy.WebBanHang.dto.respoonse;

import lombok.*;

@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    // private String errorCode;
}
