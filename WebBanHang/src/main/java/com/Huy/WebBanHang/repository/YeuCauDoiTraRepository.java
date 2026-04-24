package com.Huy.WebBanHang.repository;

import com.Huy.WebBanHang.entity.YeuCauDoiTraEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YeuCauDoiTraRepository extends JpaRepository<YeuCauDoiTraEntity, Integer> {
    // 1. Hàm dùng để bắt Lỗi Spam: Kiểm tra xem Mã Đơn Hàng này đã từng bị khiếu nại đổi trả chưa?
    // Spring sẽ gen SQL: SELECT COUNT(*) > 0 FROM YeuCauDoiTra WHERE idDonDat = ?
    boolean existsByDonDatHang_IdDonDat(String idDonDat);
    // 2. Tìm toàn bộ Yêu cầu đổi trả của MỘT khách hàng cụ thể (Dùng cho lịch sử)
    // Tương đương: SELECT * FROM YeuCauDoiTra WHERE userId = ?
    // "IdNguoiDung" hãy đổi thành tên biến khoá chính mà bạn khai báo bên file ApplicationUserEntity
    List<YeuCauDoiTraEntity> findByUser_Id(String idNguoiDung);
    // 3. (Tuỳ chọn thêm cho Admin): Tìm danh sách Đơn hàng theo trạng thái để admin dễ duyệt
    // Ví dụ: tìm các đơn đang "CHO_XU_LY"
    List<YeuCauDoiTraEntity> findByTrangThai(String trangThai);
}