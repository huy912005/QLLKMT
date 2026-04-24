import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import categoryService from "../../services/category/categoryService";
import Swal from "sweetalert2";

const ROWS_PER_PAGE = 7;

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const isEdit = !!initialData?.idLoaiSanPham;
    const [form, setForm] = useState({ tenLoaiSanPham: "" });

    useEffect(() => {
        if (initialData) {
            setForm({ tenLoaiSanPham: initialData.tenLoaiSanPham || "" });
        } else {
            setForm({ tenLoaiSanPham: "" });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000}}>
            <div style={{ background: "#fff", borderRadius: "12px", width: "400px", overflow: "hidden" }}>
                <div style={{ background: "#1e293b", padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between" }}>
                    <h3 style={{ margin: 0 }}>{isEdit ? "Sửa Danh Mục" : "Thêm Danh Mục"}</h3>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ padding: "20px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>Tên danh mục <span style={{color:"red"}}>*</span></label>
                    <input 
                        type="text" 
                        value={form.tenLoaiSanPham} 
                        onChange={(e) => setForm({ tenLoaiSanPham: e.target.value })} 
                        placeholder="Ví dụ: CPU, RAM, VGA..."
                        style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }} 
                    />
                </div>
                <div style={{ padding: "16px 20px", background: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}>Hủy</button>
                    <button onClick={() => onSubmit(form)} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#10b981", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>Lưu</button>
                </div>
            </div>
        </div>
    );
};

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAll();
            if (response.success) {
                setCategories(response.data || []);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.message || "Lỗi tải danh sách danh mục");
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleRemove = async (id) => {
        const result = await Swal.fire({ title: "Xác nhận xóa?", text: "Xóa danh mục có thể ảnh hưởng đến sản phẩm liên quan!", icon: "warning", showCancelButton: true });
        if (result.isConfirmed) {
            try {
                await categoryService.remove(id);
                Swal.fire("Thành công", "Đã xóa danh mục", "success");
                fetchCategories();
            } catch (err) { Swal.fire("Lỗi", err.message, "error"); }
        }
    };

    const handleModalSubmit = async (formData) => {
        if (!formData.tenLoaiSanPham) return Swal.fire("Lỗi", "Vui lòng nhập tên danh mục", "error");
        try {
            const data = { ...formData };
            if (editingCategory) data.idLoaiSanPham = editingCategory.idLoaiSanPham;
            await categoryService.upsert(data);
            Swal.fire("Thành công", editingCategory ? "Đã cập nhật" : "Đã thêm mới", "success");
            setShowModal(false);
            fetchCategories();
        } catch (err) { Swal.fire("Lỗi", err.message, "error"); }
    };

    const filtered = categories.filter(c => c.tenLoaiSanPham.toLowerCase().includes(filterText.toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    return (
        <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "22px" }}>Quản lý danh mục</h2>
                <button onClick={() => { setEditingCategory(null); setShowModal(true); }} style={{ background: "#4bc26d", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", display: "flex", gap: "6px", cursor: "pointer", fontWeight: "bold" }}>
                    <Plus size={18} /> Thêm danh mục
                </button>
            </div>
            
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            
            <input 
                type="text" 
                placeholder="Tìm theo tên danh mục..." 
                value={filterText} 
                onChange={e => { setFilterText(e.target.value); setCurrentPage(1); }} 
                style={{ padding: "10px", width: "300px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "16px" }} 
            />

            <div style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#1e293b", color: "#fff", textAlign: "left" }}>
                        <tr>
                            <th style={{ padding: "12px 16px" }}>ID</th>
                            <th style={{ padding: "12px 16px" }}>Tên danh mục</th>
                            <th style={{ padding: "12px 16px" }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(c => (
                            <tr key={c.idLoaiSanPham} style={{ borderBottom: "1px solid #f1f5f9", transition: "0.2s" }}>
                                <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#64748b" }}>{c.idLoaiSanPham}</td>
                                <td style={{ padding: "12px 16px", fontWeight: "500" }}>{c.tenLoaiSanPham}</td>
                                <td style={{ padding: "12px 16px", display: "flex", gap: "8px" }}>
                                    <button onClick={() => { setEditingCategory(c); setShowModal(true); }} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer" }}><Pencil size={16} /></button>
                                    <button onClick={() => handleRemove(c.idLoaiSanPham)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer" }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {paginated.length === 0 && <tr><td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>Không tìm thấy danh mục nào</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px" }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: currentPage === 1 ? "#f8fafc" : "#fff", cursor: currentPage === 1 ? "default" : "pointer" }}><ChevronLeft size={18}/></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: page === currentPage ? "#1e293b" : "transparent", color: page === currentPage ? "#fff" : "#64748b", fontWeight: "bold", cursor: "pointer" }}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: currentPage === totalPages ? "#f8fafc" : "#fff", cursor: currentPage === totalPages ? "default" : "pointer" }}><ChevronRight size={18}/></button>
            </div>

            <CategoryFormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleModalSubmit} initialData={editingCategory} />
        </div>
    );
};

export default CategoryPage;
