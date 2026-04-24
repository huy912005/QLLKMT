import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import userService from "../../services/user/userService";
import Swal from "sweetalert2";

const ROWS_PER_PAGE = 7;

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, roles = [] }) => {
    const isEdit = !!initialData?.id;
    const [form, setForm] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        password: "",
        roleName: ""
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                userName: initialData.userName || "",
                email: initialData.email || "",
                phoneNumber: initialData.phone || "",
                password: "", // password clear on edit
                roleName: initialData.role || ""
            });
        } else {
            setForm({ userName: "", email: "", phoneNumber: "", password: "", roleName: "" });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        if (!isEdit && !form.userName) return alert("Vui lòng nhập tên tài khoản");
        if (!form.email) return alert("Vui lòng nhập email");
        if (!form.phoneNumber) return alert("Vui lòng nhập số điện thoại");
        if (!isEdit && !form.password) return alert("Vui lòng nhập mật khẩu");
        onSubmit(form);
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000}}>
            <div style={{ background: "#fff", borderRadius: "12px", width: "450px", overflow: "hidden" }}>
                <div style={{ background: "#1e293b", padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between" }}>
                    <h3 style={{ margin: 0 }}>{isEdit ? "Sửa Người Dùng" : "Thêm Người Dùng"}</h3>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "bold" }}>Tên tài khoản {!isEdit && <span style={{color:"red"}}>*</span>}</label>
                        <input type="text" name="userName" value={form.userName} onChange={handleChange} disabled={isEdit} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "bold" }}>Email <span style={{color:"red"}}>*</span></label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "bold" }}>Số điện thoại <span style={{color:"red"}}>*</span></label>
                        <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "bold" }}>Mật khẩu {isEdit ? "(Đổi mật khẩu thì nhập, không thì để trống)" : <span style={{color:"red"}}>*</span>}</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "bold" }}>Vai trò / Quyền</label>
                        <select name="roleName" value={form.roleName} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "6px", background: "#fff" }}>
                            <option value="">-- Chọn vai trò --</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ padding: "16px 20px", background: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}>Hủy</button>
                    <button onClick={handleSubmit} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#10b981", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>Lưu</button>
                </div>
            </div>
        </div>
    );
};

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [roles, setRoles] = useState([]);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data || []);
        } catch (err) {
            setError(err.message || "Lỗi lấy danh sách người dùng");
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await userService.getRoles();
            setRoles(data || []);
        } catch (err) {
            console.error("Lỗi lấy vai trò", err);
        }
    };

    useEffect(() => { 
        fetchUsers(); 
        fetchRoles();
    }, []);

    const handleRemove = async (id) => {
        const row = await Swal.fire({ title: "Xác nhận xóa", text: "Bạn chắc chắn muốn xóa?", icon: "warning", showCancelButton: true });
        if (row.isConfirmed) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
                Swal.fire("Đã xóa", "", "success");
            } catch (err) { Swal.fire("Lỗi", err.message, "error"); }
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, formData);
                Swal.fire("Thành công", "Đã cập nhật", "success");
            } else {
                await userService.createUser(formData);
                Swal.fire("Thành công", "Đã thêm người dùng", "success");
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            Swal.fire("Lỗi", err.message, "error");
        }
    };

    const filtered = users.filter(u => `${u.userName} ${u.email} ${u.phone} ${u.id}`.toLowerCase().includes(filterText.toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    return (
        <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "22px" }}>Quản lý người dùng</h2>
                <button onClick={() => { setEditingUser(null); setShowModal(true); }} style={{ background: "#4bc26d", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", display: "flex", gap: "6px", cursor: "pointer" }}>
                    <Plus size={18} /> Thêm người dùng
                </button>
            </div>
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            <input type="text" placeholder="Tìm kiếm..." value={filterText} onChange={e => { setFilterText(e.target.value); setCurrentPage(1); }} style={{ padding: "8px", width: "300px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "16px" }} />
            
            <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#2c3e50", color: "#fff", textAlign: "left" }}>
                        <tr>
                            <th style={{ padding: "10px" }}>Tài khoản</th>
                            <th style={{ padding: "10px" }}>Email</th>
                            <th style={{ padding: "10px" }}>Số điện thoại</th>
                            <th style={{ padding: "10px" }}>Quyền</th>
                            <th style={{ padding: "10px" }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(u => (
                            <tr key={u.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                                <td style={{ padding: "10px" }}>{u.userName}</td>
                                <td style={{ padding: "10px" }}>{u.email}</td>
                                <td style={{ padding: "10px" }}>{u.phone}</td>
                                <td style={{ padding: "10px" }}>{u.role}</td>
                                <td style={{ padding: "10px", display: "flex", gap: "6px" }}>
                                    <button onClick={() => { setEditingUser(u); setShowModal(true); }} style={{ background: "#0d6efd", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer" }}><Pencil size={14} /></button>
                                    <button onClick={() => handleRemove(u.id)} style={{ background: "#dc3545", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "6px", cursor: "pointer" }}><Trash2 size={14} /></button>
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

            <UserFormModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleModalSubmit} initialData={editingUser} roles={roles} />
        </div>
    );
};
export default UserPage;
