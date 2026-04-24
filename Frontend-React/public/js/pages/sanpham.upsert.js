import { API_BASE_URL } from "../config/api.config-admin.js";

/* =========================
   HELPERS
========================= */
function normalizeImageUrl(img) {
    if (!img) return "";
    // img đã là "/images/xxx.jpg"
    return img.startsWith("/") ? img : `/images/${img}`;
}

function setCurrentImage(img) {
    const src = normalizeImageUrl(img);
    if (!src) {
        $("#previewImg").hide().attr("src", "");
        return;
    }
    $("#previewImg").attr("src", src).show();
}

function previewSelectedFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    $("#previewImg").attr("src", url).show();
}

/* =========================
   LOAD DROPDOWN
========================= */
async function loadLoaiSanPham(selected) {
    const $sel = $("#idLoaiSanPham");
    $sel.prop("disabled", true).empty()
        .append(`<option value="">-- Đang tải loại sản phẩm... --</option>`);

    const res = await fetch(`${API_BASE_URL}/api/admin/loaisanpham`);
    if (!res.ok) throw new Error("Không tải được loại sản phẩm");

    const data = await res.json();
    $sel.empty().append(`<option value="">-- Chọn loại sản phẩm --</option>`);
    data.forEach(x => {
        $sel.append(`<option value="${x.idLoaiSanPham}">${x.tenLoaiSanPham}</option>`);
    });

    if (selected) $sel.val(selected);
    $sel.prop("disabled", false);
}

async function loadCongTy(selected) {
    const $sel = $("#idCongTy");
    $sel.prop("disabled", true).empty()
        .append(`<option value="">-- Đang tải công ty... --</option>`);

    const res = await fetch(`${API_BASE_URL}/api/admin/congty`);
    if (!res.ok) throw new Error("Không tải được công ty");

    const data = await res.json();
    $sel.empty().append(`<option value="">-- Chọn công ty --</option>`);
    data.forEach(x => {
        $sel.append(`<option value="${x.idCongTy}">${x.tenCongTy}</option>`);
    });

    if (selected) $sel.val(selected);
    $sel.prop("disabled", false);
}

/* =========================
   MAIN
========================= */
$(async function () {

    const idSanPham = ($("#idSanPham").val() || "").trim();

    try {
        await loadLoaiSanPham(null);
        await loadCongTy(null);

        // ===== EDIT =====
        if (idSanPham) {
            const res = await fetch(`${API_BASE_URL}/api/admin/sanpham/${idSanPham}`);
            if (!res.ok) {
                Swal.fire("Lỗi", "Không tìm thấy sản phẩm", "error");
                return;
            }

            const sp = await res.json();

            $("#tenSanPham").val(sp.tenSanPham ?? "");
            $("#gia").val(sp.gia ?? 0);
            $("#soLuong").val(sp.soLuongHienCon ?? 0);
            $("#moTa").val(sp.moTa ?? "");
            $("#thongSoSanPham").val(sp.thongSoSanPham ?? "");
            $("#imageLienQuan").val(sp.imageLienQuan ?? "");

            await loadLoaiSanPham(sp.idLoaiSanPham);
            await loadCongTy(sp.idCongTy);

            setCurrentImage(sp.imageURL);
            $("#currentImageURL").val(sp.imageURL ?? "");
        }
        // ===== CREATE =====
        else {
            setCurrentImage("");
            $("#currentImageURL").val("");
        }

    } catch (e) {
        console.error(e);
        Swal.fire("Lỗi", e?.message || "Không thể tải dữ liệu", "error");
    }

    // preview ảnh
    $("#image").on("change", function () {
        const file = this.files?.[0];
        if (file) previewSelectedFile(file);
    });

    /* =========================
       SUBMIT
    ========================= */
    $("#frmSanPham").on("submit", async function (e) {
        e.preventDefault();

        const id = ($("#idSanPham").val() || "").trim();
        const tenSanPham = ($("#tenSanPham").val() || "").trim();
        const gia = $("#gia").val();
        const soLuongHienCon = $("#soLuong").val();
        const idLoaiSanPham = $("#idLoaiSanPham").val();
        const idCongTy = $("#idCongTy").val();
        const moTa = $("#moTa").val()?.trim() || "";
        const thongSoSanPham = $("#thongSoSanPham").val()?.trim() || "";
        const imageLienQuan = $("#imageLienQuan").val()?.trim() || "";

        if (!tenSanPham || !idLoaiSanPham || !idCongTy) {
            Swal.fire("Thiếu dữ liệu", "Vui lòng nhập đầy đủ thông tin", "warning");
            return;
        }

        const formData = new FormData();

        // chỉ gửi id khi update
        if (id) formData.append("idSanPham", id);

        formData.append("tenSanPham", tenSanPham);
        formData.append("gia", gia ?? 0);
        formData.append("soLuongHienCon", soLuongHienCon ?? 0);
        formData.append("idLoaiSanPham", idLoaiSanPham);
        formData.append("idCongTy", idCongTy);
        formData.append("moTa", moTa);
        formData.append("thongSoSanPham", thongSoSanPham);
        formData.append("imageLienQuan", imageLienQuan);

        const file = $("#image")[0]?.files?.[0];

        if (file) {
            formData.append("image", file);
        } else {
            const oldImg = ($("#currentImageURL").val() || "").trim();
            if (oldImg) formData.append("imageURL", oldImg);
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/sanpham/upsert`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                Swal.fire("Lỗi", JSON.stringify(err.errors || err, null, 2), "error");
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Lưu thành công",
                timer: 1200,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "/Admin/SanPham";
            });

        } catch (err) {
            console.error(err);
            Swal.fire("Lỗi", "Không thể kết nối server", "error");
        }
    });
});
