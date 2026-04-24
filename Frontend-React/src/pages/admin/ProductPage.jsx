import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import productService from "../../services/product/productService";
import ProductFormModal from "../../components/admin/ProductFormModal";
import categoryService from "../../services/category/categoryService";
import companyService from "../../services/company/companyService";
import Swal from "sweetalert2";

const ROWS_PER_PAGE = 7;

const Product = () => {
    const [product, setProduct] = useState([]);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loaiSanPhamList, setLoaiSanPhamList] = useState([]);
    const [congTyList, setCongTyList] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [loaiRes, congTyRes] = await Promise.all([
                categoryService.getAll(),
                companyService.getAll()
            ]);
            if (loaiRes.success) setLoaiSanPhamList(loaiRes.data || []);
            if (congTyRes.success) setCongTyList(congTyRes.data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách loại/công ty", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await productService.getAll();
            if (response.success) {
                setProduct(response.data || []);
            } else {
                setError("Lỗi không thể lấy được sản phẩm!");
            }
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm", error);
            setError("Lỗi khi lấy sản phẩm!");
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc muốn xóa sản phẩm này?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            });
            if (result.isConfirmed) {
                const response = await productService.Delete(id);
                if (response.success) {
                    setProduct(prev => prev.filter(item => item.idSanPham !== id));
                    Swal.fire({ icon: "success", title: "Đã xóa", text: "Sản phẩm đã được xóa thành công!", timer: 1500, showConfirmButton: false });
                }
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm", error);
            Swal.fire({ icon: "error", title: "Lỗi", text: error.message || "Không thể xóa sản phẩm" });
        }
    };

    // Mở modal Sửa
    const openEditModal = (item) => {
        setEditingProduct(item);
        setShowModal(true);
    };

    // Mở modal Thêm mới
    const openCreateModal = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    // Đóng modal
    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    // Hàm xử lý khi bấm Lưu trong Modal (dùng chung cho cả Thêm và Sửa)
    const handleModalSubmit = async (formData) => {
        try {
            if (editingProduct) {
                // Chế độ Sửa
                const response = await productService.update(editingProduct.idSanPham, formData);
                if (response.success) {
                    closeModal();
                    await fetchProducts(); // Fetch lại toàn bộ danh sách từ server
                    Swal.fire({ icon: "success", title: "Đã cập nhật", text: "Sản phẩm đã được cập nhật!", timer: 1500, showConfirmButton: false });
                }
            } else {
                // Chế độ Thêm mới
                const response = await productService.create(formData);
                if (response.success) {
                    closeModal();
                    await fetchProducts(); // Fetch lại toàn bộ danh sách từ server
                    Swal.fire({ icon: "success", title: "Đã tạo", text: "Sản phẩm đã được tạo!", timer: 1500, showConfirmButton: false });
                }
            }
        } catch (error) {
            console.error("Lỗi khi lưu sản phẩm", error);
            Swal.fire({ icon: "error", title: "Lỗi", text: error.message || "Không thể lưu sản phẩm" });
        }
    };

    // Lọc theo ô tìm kiếm
    const filtered = product.filter(item =>
        (item.tenSanPham?.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.tenLoaiSanPham?.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.tenCongTy?.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.idSanPham?.toLowerCase().includes(filterText.toLowerCase()))
    );

    // Phân trang
    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

    const handleSearch = (e) => {
        setFilterText(e.target.value);
        setCurrentPage(1); // reset về trang 1 khi tìm kiếm
    };

    // Styles
    const thStyle = {
        padding: "10px 12px",
        background: "#2c3e50",
        color: "#fff",
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
        whiteSpace: "nowrap",
    };
    const tdStyle = {
        padding: "10px 12px",
        borderBottom: "1px solid #e2e8f0",
        fontSize: "13px",
        verticalAlign: "middle",
    };

    return (
        <>
            <div style={{ padding: "24px" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ margin: 0, fontSize: "22px", color: "#1e293b" }}>Quản lý sản phẩm</h2>
                    <button
                        onClick={openCreateModal}
                        style={{
                            background: "#198754", color: "#fff", border: "none",
                            borderRadius: "8px", padding: "9px 18px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "6px",
                            fontWeight: 600, fontSize: "14px"
                        }}
                    >
                        <Plus size={16} /> Thêm sản phẩm
                    </button>
                </div>

                {/* Thông báo lỗi */}
                {error && <div style={{ color: "#dc3545", marginBottom: "12px", padding: "10px", background: "#fff5f5", borderRadius: "6px" }}>{error}</div>}

                {/* Tìm kiếm + đếm */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <input
                        type="text"
                        placeholder="🔍 Tìm theo tên, loại, công ty, ID..."
                        value={filterText}
                        onChange={handleSearch}
                        style={{
                            padding: "8px 14px", borderRadius: "8px",
                            border: "1px solid #cbd5e1", width: "320px", fontSize: "14px"
                        }}
                    />
                    <span style={{ fontSize: "13px", color: "#64748b" }}>
                        Hiển thị {paginated.length} / {filtered.length} sản phẩm
                    </span>
                </div>

                {/* Bảng */}
                <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Hình ảnh</th>
                                <th style={thStyle}>Tên sản phẩm</th>
                                <th style={thStyle}>Giá</th>
                                <th style={thStyle}>Loại SP</th>
                                <th style={thStyle}>Công ty</th>
                                <th style={thStyle}>Mô tả</th>
                                <th style={thStyle}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "#94a3b8", padding: "32px" }}>
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((item, idx) => (
                                    <tr key={item.idSanPham} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                        <td style={tdStyle}>{item.idSanPham}</td>
                                        <td style={tdStyle}>
                                            <img
                                                src={
                                                    !item.imageURL ? ''
                                                    : item.imageURL.startsWith('/images/')
                                                        ? `http://localhost:8080${item.imageURL}`
                                                        : `/public/images/${item.imageURL}`
                                                }
                                                alt={item.tenSanPham}
                                                style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", background: "#f1f5f9" }}
                                            />
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: 500 }}>{item.tenSanPham}</td>
                                        <td style={tdStyle}>{item.gia?.toLocaleString("vi-VN")} ₫</td>
                                        <td style={tdStyle}>{item.tenLoaiSanPham}</td>
                                        <td style={tdStyle}>{item.tenCongTy}</td>
                                        <td style={{ ...tdStyle, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {item.moTa}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button
                                                    title="Cập nhật"
                                                    onClick={() => openEditModal(item)}
                                                    style={{
                                                        background: "#0d6efd", color: "#fff", border: "none",
                                                        borderRadius: "6px", padding: "6px 10px", cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: "4px", fontSize: "13px"
                                                    }}
                                                >
                                                    <Pencil size={14} /> Sửa
                                                </button>
                                                <button
                                                    title="Xóa"
                                                    onClick={() => handleRemoveItem(item.idSanPham)}
                                                    style={{
                                                        background: "#dc3545", color: "#fff", border: "none",
                                                        borderRadius: "6px", padding: "6px 10px", cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: "4px", fontSize: "13px"
                                                    }}
                                                >
                                                    <Trash2 size={14} /> Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        style={{
                            padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1",
                            background: safePage === 1 ? "#f1f5f9" : "#fff", cursor: safePage === 1 ? "default" : "pointer",
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
                                border: page === safePage ? "none" : "1px solid #cbd5e1",
                                background: page === safePage ? "#2c3e50" : "#fff",
                                color: page === safePage ? "#fff" : "#374151",
                                cursor: "pointer", fontWeight: page === safePage ? 700 : 400,
                                minWidth: "36px"
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        style={{
                            padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1",
                            background: safePage === totalPages ? "#f1f5f9" : "#fff",
                            cursor: safePage === totalPages ? "default" : "pointer",
                            display: "flex", alignItems: "center"
                        }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

            </div>

            {/* Modal Thêm / Sửa sản phẩm */}
            <ProductFormModal
                isOpen={showModal}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                initialData={editingProduct}
                loaiSanPhamList={loaiSanPhamList}
                congTyList={congTyList}
            />
        </>
    );
};

export default Product;