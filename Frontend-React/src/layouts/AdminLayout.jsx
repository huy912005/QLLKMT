import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const NAV_ITEMS = [
    {
        to: "/admin/products",
        icon: "📦",
        label: "Sản phẩm",
        desc: "Quản lý kho hàng"
    },
    {
        to: "/admin/orders",
        icon: "🛒",
        label: "Đơn hàng",
        desc: "Theo dõi đơn hàng"
    },
    {
        to: "/admin/users",
        icon: "👥",
        label: "Người dùng",
        desc: "Tài khoản khách hàng"
    },
    {
        to: "/admin/categories",
        icon: "🏷️",
        label: "Danh mục",
        desc: "Loại sản phẩm"
    },
    {
        to: "/admin/companies",
        icon: "🏢",
        label: "Công ty",
        desc: "Nhãn hàng"
    },
];

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={styles.root}>
            {/* ───── SIDEBAR ───── */}
            <aside style={{ ...styles.sidebar, width: collapsed ? "72px" : "240px" }}>
                {/* Logo */}
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>⚡</div>
                    {!collapsed && (
                        <div>
                            <div style={styles.logoTitle}>AdminPanel</div>
                            <div style={styles.logoSub}>QL-LINH KIỆN</div>
                        </div>
                    )}
                </div>

                {/* Toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    style={styles.toggleBtn}
                    title={collapsed ? "Mở rộng" : "Thu gọn"}
                >
                    {collapsed ? "▶" : "◀"}
                </button>

                {/* Nav */}
                <nav style={styles.nav}>
                    {!collapsed && (
                        <p style={styles.navSection}>MENU CHÍNH</p>
                    )}
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname.startsWith(item.to);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                title={collapsed ? item.label : ""}
                                style={{
                                    ...styles.navItem,
                                    ...(isActive ? styles.navItemActive : {}),
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    padding: collapsed ? "12px" : "11px 14px",
                                }}
                            >
                                <span style={styles.navIcon}>{item.icon}</span>
                                {!collapsed && (
                                    <div>
                                        <div style={styles.navLabel}>{item.label}</div>
                                        <div style={styles.navDesc}>{item.desc}</div>
                                    </div>
                                )}
                                {isActive && !collapsed && (
                                    <div style={styles.activeDot} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div style={{ ...styles.userBox, padding: collapsed ? "12px 0" : "14px" }}>
                    <div style={styles.avatar}>A</div>
                    {!collapsed && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={styles.userName}>Administrator</div>
                            <div style={styles.userRole}>Super Admin</div>
                        </div>
                    )}
                    {!collapsed && (
                        <button onClick={handleLogout} style={styles.logoutBtn} title="Đăng xuất">
                            ⏻
                        </button>
                    )}
                </div>
            </aside>

            {/* ───── MAIN ───── */}
            <div style={styles.main}>
                {/* Topbar */}
                <header style={styles.topbar}>
                    <div style={styles.topbarLeft}>
                        <div style={styles.breadcrumb}>
                            🏠 Admin &nbsp;/&nbsp;
                            <span style={{ color: "#1e293b", fontWeight: 600 }}>
                                {NAV_ITEMS.find(n => location.pathname.startsWith(n.to))?.label ?? "Dashboard"}
                            </span>
                        </div>
                    </div>
                    <div style={styles.topbarRight}>
                        <div style={styles.topbarBadge}>🔔</div>
                        <div style={styles.topbarBadge}>⚙️</div>
                        <div style={styles.topbarAvatar}>A</div>
                    </div>
                </header>

                {/* Content */}
                <main style={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const styles = {
    root: {
        display: "flex",
        height: "100vh",
        background: "#f0f4f8",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    sidebar: {
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
        position: "relative",
        zIndex: 10,
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "20px 16px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
    },
    logoIcon: {
        width: "40px", height: "40px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px", flexShrink: 0,
    },
    logoTitle: { fontSize: "15px", fontWeight: 700, color: "#fff", lineHeight: 1.2 },
    logoSub: { fontSize: "11px", color: "#64748b", marginTop: "2px" },
    toggleBtn: {
        position: "absolute",
        top: "22px", right: "12px",
        background: "rgba(255,255,255,0.08)",
        border: "none", color: "#94a3b8",
        width: "24px", height: "24px",
        borderRadius: "6px", cursor: "pointer",
        fontSize: "10px", display: "flex",
        alignItems: "center", justifyContent: "center",
    },
    nav: { flex: 1, padding: "12px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" },
    navSection: { fontSize: "10px", fontWeight: 700, color: "#475569", letterSpacing: "1px", margin: "6px 4px 8px", textTransform: "uppercase" },
    navItem: {
        display: "flex", alignItems: "center", gap: "10px",
        borderRadius: "10px", textDecoration: "none",
        color: "#94a3b8", transition: "all 0.2s",
        position: "relative",
    },
    navItemActive: {
        background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
        color: "#818cf8",
        boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.3)",
    },
    navIcon: { fontSize: "18px", width: "24px", textAlign: "center", flexShrink: 0 },
    navLabel: { fontSize: "13px", fontWeight: 600, lineHeight: 1.2 },
    navDesc: { fontSize: "10px", color: "#475569", marginTop: "1px" },
    activeDot: {
        width: "6px", height: "6px",
        background: "#6366f1", borderRadius: "50%",
        marginLeft: "auto",
    },
    userBox: {
        display: "flex", alignItems: "center", gap: "10px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        margin: "0 10px 10px",
    },
    avatar: {
        width: "36px", height: "36px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", fontWeight: 700, color: "#fff", flexShrink: 0,
    },
    userName: { fontSize: "13px", fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    userRole: { fontSize: "10px", color: "#64748b" },
    logoutBtn: {
        background: "rgba(239,68,68,0.15)", border: "none",
        color: "#f87171", width: "28px", height: "28px",
        borderRadius: "8px", cursor: "pointer",
        fontSize: "14px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    topbar: {
        height: "60px",
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        flexShrink: 0,
    },
    topbarLeft: {},
    breadcrumb: { fontSize: "13px", color: "#94a3b8" },
    topbarRight: { display: "flex", alignItems: "center", gap: "8px" },
    topbarBadge: {
        width: "36px", height: "36px",
        background: "#f8fafc", borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "16px", cursor: "pointer", border: "1px solid #e2e8f0",
    },
    topbarAvatar: {
        width: "36px", height: "36px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", fontWeight: 700, color: "#fff", cursor: "pointer",
    },
    content: {
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        background: "#f0f4f8",
    },
};

export default AdminLayout;