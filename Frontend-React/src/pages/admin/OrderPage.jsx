import { useEffect, useState } from "react";
import { Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import orderService from "../../services/order/orderService";
import Swal from "sweetalert2";

const ROWS_PER_PAGE = 7;

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getAllOrders();
            // Đơn hàng từ DonDatHangController được bọc trong ApiResponse { success, data, message }
            if (response.success) {
                setOrders(response.data || []);
            } else {
                setError(response.message || "Lỗi lấy danh sách đơn hàng");
            }
        } catch (err) {
            setError(err.message || "Lỗi lấy danh sách đơn hàng");
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleRemove = async (id) => {
        const row = await Swal.fire({ title: "Xác nhận xóa", text: "Bạn chắc chắn muốn xóa đơn hàng này?", icon: "warning", showCancelButton: true });
        if (row.isConfirmed) {
            try {
                // Chúng ta sẽ cần tạo thêm API delete cho admin nếu chưa có
                await orderService.deleteOrder(id);
                fetchOrders();
                Swal.fire("Đã xóa", "", "success");
            } catch (err) { 
                Swal.fire("Lỗi", err.message || "Không thể xóa đơn hàng", "error"); 
            }
        }
    };

    const handleEditStatus = async (order) => {
        let inputOptions = {
            "CHO_XAC_NHAN": "Chờ xác nhận",
            "DANG_GIAO": "Đang giao",
            "DA_GIAO": "Đã giao",
            "DA_HUY": "Đã hủy",
            "TRA_LAI": "Trả lại"
        };

        // Ràng buộc logic nghiệp vụ:
        if (order.trangThai === "DA_GIAO") {
            inputOptions = {
                "DA_GIAO": "Đã giao (Hiện tại)",
                "TRA_LAI": "Yêu cầu Trả lại / Đổi trả"
            };
        } else if (order.trangThai === "TRA_LAI") {
            inputOptions = {
                "TRA_LAI": "Đang trạng thái Trả lại hàng",
                "DA_GIAO": "Hủy đổi trả (Khôi phục về Đã giao)"
            };
        } else if (order.trangThai === "DA_HUY") {
            Swal.fire("Thông báo", "Đơn hàng đã hủy không thể thay đổi trạng thái nữa.", "info");
            return;
        }

        const { value: newStatus } = await Swal.fire({
            title: "Cập nhật trạng thái",
            input: "select",
            inputOptions: inputOptions,
            inputValue: order.trangThai,
            showCancelButton: true,
        });
        
        if (newStatus && newStatus !== order.trangThai) {
            try {
                await orderService.updateOrderStatus(order.idDonDat, newStatus);
                Swal.fire("Thành công", "Đã cập nhật trạng thái", "success");
                fetchOrders();
            } catch (err) {
                Swal.fire("Lỗi", err.message, "error");
            }
        }
    };

    const handleAddClick = () => {
        // Chức năng này đã bị gỡ bỏ theo yêu cầu
    };

    const filtered = orders.filter(o => `${o.idDonDat} ${o.tenNguoiDung} ${o.trangThai}`.toLowerCase().includes(filterText.toLowerCase()));
    // Sắp xếp mới nhất lên đầu
    const sorted = [...filtered].sort((a,b) => new Date(b.ngayDat) - new Date(a.ngayDat));
    const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE));
    const paginated = sorted.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    const getStatusBadge = (status) => {
        const map = {
            CHO_XAC_NHAN: { label: 'Chờ xác nhận', color: '#f59e0b' },
            DANG_GIAO: { label: 'Đang giao', color: '#3b82f6' },
            DA_GIAO: { label: 'Đã giao', color: '#10b981' },
            DA_HUY: { label: 'Đã hủy', color: '#ef4444' },
            TRA_LAI: { label: 'Yêu cầu đổi trả', color: '#dc3545' }
        };
        const info = map[status] || { label: status, color: '#6b7280' };
        return <span style={{ background: info.color, color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>{info.label}</span>;
    };

    return (
        <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "22px" }}>Quản lý đơn hàng</h2>
            </div>
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            <input type="text" placeholder="Tìm theo ID, Tên KH, Trạng thái..." value={filterText} onChange={e => { setFilterText(e.target.value); setCurrentPage(1); }} style={{ padding: "8px", width: "300px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "16px" }} />
            
            <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#2c3e50", color: "#fff", textAlign: "left" }}>
                        <tr>
                            <th style={{ padding: "10px" }}>Mã Đơn</th>
                            <th style={{ padding: "10px" }}>Khách hàng</th>
                            <th style={{ padding: "10px" }}>Ngày đặt</th>
                            <th style={{ padding: "10px" }}>Tổng tiền</th>
                            <th style={{ padding: "10px" }}>Trạng thái</th>
                            <th style={{ padding: "10px" }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(o => (
                            <tr key={o.idDonDat} style={{ borderBottom: "1px solid #f1f1f1" }}>
                                <td style={{ padding: "10px", fontWeight: "bold" }}>#{o.idDonDat}</td>
                                <td style={{ padding: "10px" }}>{o.tenNguoiDung}</td>
                                <td style={{ padding: "10px" }}>{new Date(o.ngayDat).toLocaleDateString('vi-VN')}</td>
                                <td style={{ padding: "10px", color: "red", fontWeight: "bold" }}>{o.tongTien?.toLocaleString("vi-VN")} ₫</td>
                                <td style={{ padding: "10px" }}>{getStatusBadge(o.trangThai)}</td>
                                <td style={{ padding: "10px", display: "flex", gap: "6px" }}>
                                    <button onClick={() => handleEditStatus(o)} title="Đổi trạng thái" style={{ background: "#0d6efd", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer" }}><Pencil size={14} /></button>
                                    <button onClick={() => handleRemove(o.idDonDat)} title="Xóa" style={{ background: "#dc3545", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer" }}><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Phân trang */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                        padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1",
                        background: currentPage === 1 ? "#f1f5f9" : "#fff", cursor: currentPage === 1 ? "default" : "pointer",
                        display: "flex", alignItems: "center"
                    }}
                >
                    <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                            padding: "6px 12px", borderRadius: "6px",
                            border: page === currentPage ? "none" : "1px solid #cbd5e1",
                            background: page === currentPage ? "#2c3e50" : "#fff",
                            color: page === currentPage ? "#fff" : "#374151",
                            cursor: "pointer", fontWeight: page === currentPage ? 700 : 400,
                            minWidth: "36px"
                        }}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1",
                        background: currentPage === totalPages ? "#f1f5f9" : "#fff",
                        cursor: currentPage === totalPages ? "default" : "pointer",
                        display: "flex", alignItems: "center"
                    }}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
export default OrderPage;
