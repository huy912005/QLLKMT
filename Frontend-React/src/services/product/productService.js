import api from "../api";

const productService = {
    getAll: async () => {
        try {
            const response = await api.get(`/admin/sanpham`);
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy tất cả sản phẩm :', error);
            throw error;
        }
    },
    getByID: async (id) => {
        try {
            const response = await api.get(`/admin/sanpham/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy sản phẩm theo ID!", error);
            throw error;
        }
    },
    Delete: async (id) => {
        try {
            const response = await api.delete(`/admin/sanpham/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi xóa sản phẩm", error);
            throw error;
        }
    },
    // FormData vì backend nhận MultipartFile (ảnh)
    // Backend dùng POST /upsert cho cả tạo mới LẪN cập nhật (phân biệt bằng idSanPham trong form)
    update: async (id, formData) => {
        try {
            const response = await api.post(`/admin/sanpham/upsert`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi cập nhật sản phẩm", error);
            throw error;
        }
    },
    create: async (formData) => {
        try {
            const response = await api.post(`/admin/sanpham/upsert`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi tạo sản phẩm", error);
            throw error;
        }
    }
}

export default productService;