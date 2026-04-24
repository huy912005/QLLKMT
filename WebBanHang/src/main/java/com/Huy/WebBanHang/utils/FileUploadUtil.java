package com.Huy.WebBanHang.utils;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class FileUploadUtil {
    // Lưu thẳng vào public/images của React để hiển thị được ngay
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/../Frontend-React/public/images/";

    public static String saveFile(MultipartFile multipartFile) throws IOException {
        if (multipartFile == null || multipartFile.isEmpty())
            return null;
        File folder = new File(UPLOAD_DIR);
        if (!folder.exists())
            folder.mkdirs();
        String fileName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
        File file = new File(UPLOAD_DIR + fileName);
        multipartFile.transferTo(file); // Lưu xuống ổ cứng
        return fileName; // Chỉ trả tên file, frontend tự ghép /public/images/
    }
}
