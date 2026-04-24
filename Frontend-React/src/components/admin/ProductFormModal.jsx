import { useEffect, useState } from "react";

// Helper: lấy đúng URL ảnh cho cả 2 format
const getImgSrc = (imageURL) => {
    if (!imageURL) return null;
    if (imageURL.startsWith('/images/')) return `http://localhost:8080${imageURL}`;
    return `/public/images/${imageURL}`;
};

const ProductFormModal = ({
    isOpen, onClose, onSubmit,
    initialData = null,
    loaiSanPhamList = [],
    congTyList = []
}) => {
    const isEdit = !!initialData?.idSanPham;

    const emptyForm = {
        idSanPham: "", tenSanPham: "", gia: "", soLuongHienCon: 0,
        image: null, imagePreview: null,
        imageLienQuan: "", moTa: "", thongSoSanPham: "",
        idLoaiSanPham: "", idCongTy: ""
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                idSanPham: initialData.idSanPham || "",
                tenSanPham: initialData.tenSanPham || "",
                gia: initialData.gia || "",
                soLuongHienCon: initialData.soLuongHienCon || 0,
                image: null,
                imagePreview: null,
                imageLienQuan: initialData.imageLienQuan || "",
                moTa: initialData.moTa || "",
                thongSoSanPham: initialData.thongSoSanPham || "",
                idLoaiSanPham: initialData.idLoaiSanPham || "",
                idCongTy: initialData.idCongTy || ""
            });
        } else {
            setForm(emptyForm);
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setForm(prev => ({ ...prev, image: file, imagePreview: preview }));
        }
    };

    const handleSubmit = () => {
        if (!form.tenSanPham.trim()) { alert("Vui lòng nhập tên sản phẩm!"); return; }
        if (!isEdit) {
            if (!form.idLoaiSanPham) { alert("Vui lòng chọn loại sản phẩm!"); return; }
            if (!form.idCongTy) { alert("Vui lòng chọn công ty!"); return; }
        }
        const formData = new FormData();
        if (form.idSanPham) formData.append("idSanPham", form.idSanPham);
        formData.append("tenSanPham", form.tenSanPham);
        formData.append("gia", form.gia);
        formData.append("soLuongHienCon", form.soLuongHienCon);
        formData.append("moTa", form.moTa);
        formData.append("thongSoSanPham", form.thongSoSanPham);
        formData.append("imageLienQuan", form.imageLienQuan);
        if (form.idLoaiSanPham) formData.append("idLoaiSanPham", form.idLoaiSanPham);
        if (form.idCongTy) formData.append("idCongTy", form.idCongTy);
        if (form.image) formData.append("image", form.image);
        onSubmit(formData);
    };

    if (!isOpen) return null;

    const currentImgSrc = form.imagePreview || getImgSrc(initialData?.imageURL);

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={styles.headerIcon}>{isEdit ? "✏️" : "➕"}</div>
                        <div>
                            <h2 style={styles.title}>{isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
                            <p style={styles.subtitle}>{isEdit ? `ID: ${form.idSanPham}` : "Điền đầy đủ thông tin sản phẩm"}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                <div style={styles.body}>
                    {/* Row 1: Tên + Giá */}
                    <div style={styles.row2}>
                        <div style={styles.field}>
                            <label style={styles.label}>Tên sản phẩm <span style={{ color: "#ef4444" }}>*</span></label>
                            <input type="text" name="tenSanPham" value={form.tenSanPham}
                                onChange={handleChange} placeholder="Nhập tên sản phẩm" style={styles.input} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Giá (₫)</label>
                            <input type="number" name="gia" value={form.gia}
                                onChange={handleChange} placeholder="0" style={styles.input} />
                        </div>
                    </div>

                    {/* Row 2: Số lượng */}
                    <div style={styles.field}>
                        <label style={styles.label}>Số lượng hiện còn</label>
                        <input type="number" name="soLuongHienCon" value={form.soLuongHienCon}
                            onChange={handleChange} min={0} style={{ ...styles.input, width: "160px" }} />
                    </div>

                    {/* Row 3: Loại SP + Công ty */}
                    <div style={styles.row2}>
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Loại sản phẩm {!isEdit && <span style={{ color: "#ef4444" }}>*</span>}
                                {isEdit && <span style={styles.optionalBadge}>Tùy chọn</span>}
                            </label>
                            <select name="idLoaiSanPham" value={form.idLoaiSanPham}
                                onChange={handleChange} style={styles.input}>
                                <option value="">-- Lựa chọn --</option>
                                {loaiSanPhamList.map(item => (
                                    <option key={item.idLoaiSanPham} value={item.idLoaiSanPham}>
                                        {item.tenLoaiSanPham}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Công ty {!isEdit && <span style={{ color: "#ef4444" }}>*</span>}
                                {isEdit && <span style={styles.optionalBadge}>Tùy chọn</span>}
                            </label>
                            <select name="idCongTy" value={form.idCongTy}
                                onChange={handleChange} style={styles.input}>
                                <option value="">-- Lựa chọn --</option>
                                {congTyList.map(item => (
                                    <option key={item.idCongTy} value={item.idCongTy}>
                                        {item.tenCongTy}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Ảnh chính */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Ảnh chính {isEdit && <span style={styles.optionalBadge}>Tùy chọn — bỏ trống để giữ ảnh cũ</span>}
                        </label>
                        <div style={styles.imageBox}>
                            {currentImgSrc ? (
                                <img src={currentImgSrc} alt="preview"
                                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "2px solid #e2e8f0" }} />
                            ) : (
                                <div style={styles.imagePlaceholder}>🖼️</div>
                            )}
                            <div style={{ flex: 1 }}>
                                <label style={styles.fileBtn}>
                                    📁 Chọn ảnh
                                    <input type="file" name="image" accept="image/*"
                                        onChange={handleFileChange} style={{ display: "none" }} />
                                </label>
                                {form.image && (
                                    <p style={{ fontSize: "12px", color: "#10b981", marginTop: "6px" }}>
                                        ✅ {form.image.name}
                                    </p>
                                )}
                                {isEdit && !form.image && initialData?.imageURL && (
                                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                                        Ảnh hiện tại: {initialData.imageURL}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ảnh liên quan */}
                    <div style={styles.field}>
                        <label style={styles.label}>Ảnh liên quan <span style={{ color: "#94a3b8", fontWeight: 400 }}>(tên file, phân cách bằng ;)</span></label>
                        <input type="text" name="imageLienQuan" value={form.imageLienQuan}
                            onChange={handleChange} placeholder="VD: CPU_1.png;CPU_2.jpg" style={styles.input} />
                    </div>

                    {/* Mô tả */}
                    <div style={styles.field}>
                        <label style={styles.label}>Mô tả</label>
                        <textarea name="moTa" value={form.moTa} onChange={handleChange}
                            placeholder="Nhập mô tả sản phẩm..." rows={3}
                            style={{ ...styles.input, resize: "vertical", fontFamily: "inherit" }} />
                    </div>

                    {/* Thông số */}
                    <div style={styles.field}>
                        <label style={styles.label}>Thông số kỹ thuật</label>
                        <textarea name="thongSoSanPham" value={form.thongSoSanPham} onChange={handleChange}
                            placeholder="Nhập thông số kỹ thuật..." rows={3}
                            style={{ ...styles.input, resize: "vertical", fontFamily: "inherit" }} />
                    </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.cancelBtn}>Hủy bỏ</button>
                    <button onClick={handleSubmit} style={styles.submitBtn}>
                        {isEdit ? "💾 Cập nhật" : "✅ Thêm mới"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1000
    },
    modal: {
        background: "#fff",
        borderRadius: "16px",
        width: "600px", maxHeight: "92vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        overflow: "hidden"
    },
    header: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 24px",
        borderBottom: "1px solid #f1f5f9",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
    },
    headerIcon: {
        fontSize: "28px",
        width: "48px", height: "48px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center"
    },
    title: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#fff" },
    subtitle: { margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" },
    closeBtn: {
        background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
        width: "32px", height: "32px", borderRadius: "8px",
        cursor: "pointer", fontSize: "16px", display: "flex",
        alignItems: "center", justifyContent: "center"
    },
    body: { padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" },
    footer: {
        padding: "16px 24px",
        borderTop: "1px solid #f1f5f9",
        display: "flex", justifyContent: "flex-end", gap: "10px",
        background: "#f8fafc"
    },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    field: { display: "flex", flexDirection: "column", gap: "5px" },
    label: { fontSize: "13px", fontWeight: 600, color: "#374151" },
    optionalBadge: {
        marginLeft: "6px", fontSize: "11px", fontWeight: 500,
        background: "#eff6ff", color: "#3b82f6",
        padding: "1px 6px", borderRadius: "4px"
    },
    input: {
        padding: "9px 12px",
        border: "1.5px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "14px",
        width: "100%",
        boxSizing: "border-box",
        outline: "none",
        transition: "border-color 0.2s",
        color: "#1e293b"
    },
    imageBox: {
        display: "flex", alignItems: "center", gap: "14px",
        padding: "12px", background: "#f8fafc",
        borderRadius: "10px", border: "1.5px dashed #cbd5e1"
    },
    imagePlaceholder: {
        width: "80px", height: "80px",
        background: "#e2e8f0", borderRadius: "8px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "28px"
    },
    fileBtn: {
        display: "inline-block", cursor: "pointer",
        padding: "7px 14px",
        background: "#3b82f6", color: "#fff",
        borderRadius: "8px", fontSize: "13px", fontWeight: 600
    },
    cancelBtn: {
        padding: "10px 20px", borderRadius: "8px",
        border: "1.5px solid #e2e8f0", background: "#fff",
        color: "#374151", cursor: "pointer", fontWeight: 500, fontSize: "14px"
    },
    submitBtn: {
        padding: "10px 24px", borderRadius: "8px",
        border: "none",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "14px",
        boxShadow: "0 4px 12px rgba(16,185,129,0.4)"
    }
};

export default ProductFormModal;