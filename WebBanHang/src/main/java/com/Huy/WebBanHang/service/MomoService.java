package com.Huy.WebBanHang.service;

import com.Huy.WebBanHang.dto.request.MomoPaymentRequest;
import com.Huy.WebBanHang.dto.respoonse.MomoPaymentResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * MomoService – Port từ C# MomoService.cs sang Java
 *
 * Sử dụng MoMo Sandbox API v2:
 *   https://test-payment.momo.vn/v2/gateway/api/create
 *
 * Creds sandbox mặc định (test only):
 *   partnerCode : MOMO
 *   accessKey   : F8BBA842ECF85
 *   secretKey   : K951B6PE1waDMi640xX08PD3vg6EkVlz
 */
@Slf4j
@Service
public class MomoService {

    // ── Cấu hình MoMo lấy từ application.properties ──────────
    @Value("${momo.partnerCode:MOMO}")
    private String partnerCode;

    @Value("${momo.accessKey:F8BBA842ECF85}")
    private String accessKey;

    @Value("${momo.secretKey:K951B6PE1waDMi640xX08PD3vg6EkVlz}")
    private String secretKey;

    @Value("${momo.apiUrl:https://test-payment.momo.vn/v2/gateway/api/create}")
    private String apiUrl;

    /**
     * returnUrl: URL React sẽ nhận khi user thanh toán xong
     * (MoMo redirect về đây với query params resultCode, orderId…)
     */
    @Value("${momo.returnUrl:http://localhost:5173/momo-return}")
    private String returnUrl;

    /**
     * ipnUrl: URL backend nhận thông báo IPN từ MoMo (server-to-server)
     * Dùng ngrok hoặc public URL khi môi trường local
     */
    @Value("${momo.ipnUrl:http://localhost:8080/api/checkout/momo/ipn}")
    private String ipnUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ─────────────────────────────────────────────────────────
    // Tạo link thanh toán MoMo
    // ─────────────────────────────────────────────────────────
    public MomoPaymentResponse createPayment(MomoPaymentRequest momoRequest, String internalOrderId) {
        try {
            String requestId = internalOrderId + "_" + Instant.now().toEpochMilli();
            String orderId   = internalOrderId;
            String amountStr = String.valueOf(momoRequest.getAmount().longValue());
            String orderInfo = "Khách hàng: " + momoRequest.getFullName()
                             + ". Nội dung: " + momoRequest.getOrderInfo();
            String extraData = "";
            String requestType = "captureWallet";

            // ── Tạo chuỗi rawData để ký HMAC-SHA256 ──────────
            String rawData =
                "accessKey="   + accessKey   +
                "&amount="     + amountStr   +
                "&extraData="  + extraData   +
                "&ipnUrl="     + ipnUrl      +
                "&orderId="    + orderId     +
                "&orderInfo="  + orderInfo   +
                "&partnerCode="+ partnerCode +
                "&redirectUrl="+ returnUrl   +
                "&requestId="  + requestId   +
                "&requestType="+ requestType;

            String signature = hmacSha256(rawData, secretKey);

            // ── Build request body ────────────────────────────
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("partnerCode", partnerCode);
            body.put("accessKey",   accessKey);
            body.put("requestId",   requestId);
            body.put("amount",      amountStr);
            body.put("orderId",     orderId);
            body.put("orderInfo",   orderInfo);
            body.put("redirectUrl", returnUrl);
            body.put("ipnUrl",      ipnUrl);
            body.put("extraData",   extraData);
            body.put("requestType", requestType);
            body.put("signature",   signature);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(
                objectMapper.writeValueAsString(body), headers
            );

            log.info("[MoMo] Calling API: {}", apiUrl);
            log.info("[MoMo] rawData: {}", rawData);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            JsonNode json = objectMapper.readTree(response.getBody());

            log.info("[MoMo] Response: {}", response.getBody());

            int resultCode = json.path("resultCode").asInt(-1);
            String payUrl  = json.path("payUrl").asText("");
            String qrUrl   = json.path("qrCodeUrl").asText("");
            String message = json.path("message").asText("Không rõ");

            return MomoPaymentResponse.builder()
                    .payUrl(payUrl)
                    .orderId(orderId)
                    .amount(amountStr)
                    .resultCode(resultCode)
                    .message(message)
                    .qrCodeUrl(qrUrl)
                    .build();

        } catch (Exception e) {
            log.error("[MoMo] Lỗi tạo thanh toán: {}", e.getMessage(), e);
            return MomoPaymentResponse.builder()
                    .resultCode(-1)
                    .message("Lỗi hệ thống: " + e.getMessage())
                    .build();
        }
    }

    // ─────────────────────────────────────────────────────────
    // Xác thực IPN callback từ MoMo (server-to-server)
    // ─────────────────────────────────────────────────────────
    public boolean verifyIpnSignature(Map<String, String> params) {
        try {
            String receivedSig = params.getOrDefault("signature", "");
            String rawData =
                "accessKey="    + accessKey +
                "&amount="      + params.getOrDefault("amount", "") +
                "&extraData="   + params.getOrDefault("extraData", "") +
                "&message="     + params.getOrDefault("message", "") +
                "&orderId="     + params.getOrDefault("orderId", "") +
                "&orderInfo="   + params.getOrDefault("orderInfo", "") +
                "&orderType="   + params.getOrDefault("orderType", "") +
                "&partnerCode=" + params.getOrDefault("partnerCode", "") +
                "&payType="     + params.getOrDefault("payType", "") +
                "&requestId="   + params.getOrDefault("requestId", "") +
                "&responseTime="+ params.getOrDefault("responseTime", "") +
                "&resultCode="  + params.getOrDefault("resultCode", "") +
                "&transId="     + params.getOrDefault("transId", "");
            String expected = hmacSha256(rawData, secretKey);
            return expected.equalsIgnoreCase(receivedSig);
        } catch (Exception e) {
            log.error("[MoMo] Lỗi verify signature: {}", e.getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────
    // Hàm ký HMAC-SHA256 (port từ C# ComputeHmacSha256)
    // ─────────────────────────────────────────────────────────
    public String hmacSha256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(
            key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"
        );
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
