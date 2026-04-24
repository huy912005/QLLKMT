import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth/authService';
import cartService from '../services/cart/cartService';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          setUsername(user.username);
          // Fetch giỏ hàng khi đã đăng nhập
          await fetchCartCount();
        }
      } else {
        setIsAuthenticated(false);
        setUsername('');
        setCartCount(0);
      }
    };

    checkAuth();

    // Lắng nghe custom event khi giỏ hàng thay đổi
    const handleCartUpdate = () => {
      if (authService.isAuthenticated()) {
        fetchCartCount();
      }
    };

    // Lắng nghe sự kiện storage để cập nhật khi đăng nhập/đăng xuất từ tab khác
    window.addEventListener('storage', checkAuth);
    // Lắng nghe custom event để cập nhật ngay khi đăng nhập/đăng ký trên tab hiện tại
    window.addEventListener('authStateChanged', checkAuth);
    // Lắng nghe sự kiện giỏ hàng thay đổi
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChanged', checkAuth);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Hàm fetch số lượng sản phẩm trong giỏ hàng
  const fetchCartCount = async () => {
    try {
      const response = await cartService.getUserCart();
      // API trả về { success: true, data: [...] }
      if (response && response.data && Array.isArray(response.data)) {
        setCartCount(response.data.length);
      } else if (Array.isArray(response)) {
        setCartCount(response.length);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.log('Không thể load giỏ hàng:', error.message);
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername('');
    setCartCount(0);
    navigate('/');
  };

  return (
    <header className="main-header shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light py-2 py-lg-3">
        <div className="container-fluid px-4 px-lg-5">

          {/* Logo */}
          {/* 
                  Thay thẻ <a> thành thẻ <Link to="/"> để nhảy về Trang Chủ (Home) 
                  Không còn các thuộc tính rườm rà asp-area, asp-action nữa!
                */}
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <div className="header-logo-icon d-flex align-items-center justify-content-center">
              <i className="fas fa-store-alt"></i>
            </div>
            <span className="fw-bold fs-4 header-logo-text">LTM</span>
          </Link>

          {/* Nút Toggle cho Mobile BootStrap 5 vẫn giữ nguyên */}
          <button className="navbar-toggler border-0 shadow-none" type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarMain">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            {/* Menu trái */}
            <ul className="navbar-nav me-auto align-items-center gap-2 gap-lg-4">
              <li className="nav-item">
                <Link className="nav-link header-nav-link" to="/">
                  <i className="fas fa-home me-1"></i> Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link header-nav-link" to="/san-pham">
                  <i className="fas fa-th-large me-1"></i> Sản phẩm
                </Link>
              </li>
            </ul>

            {/* Thanh tìm kiếm */}
            {/* Nhớ thêm dâu "/" cuối thẻ input */}
            <form className="header-search mx-lg-4 flex-grow-1" action="/search" method="get">
              <div className="input-group input-group-lg">
                <span className="input-group-text border-0 bg-transparent">
                  <i className="fas fa-search"></i>
                </span>
                <input type="search"
                  className="form-control border-0"
                  name="searchQuery"
                  placeholder="Bạn muốn tìm gì hôm nay?..." />
              </div>
            </form>

            {/* Menu phải (Giỏ hàng & User) */}
            <ul className="navbar-nav align-items-center gap-2 gap-lg-3 ms-lg-2">
              {/* Giỏ hàng */}
              <li className="nav-item">
                <Link className="nav-link header-icon-btn position-relative" to="/cart">
                  <i className="fas fa-shopping-cart"></i>
                  {/* Chuyển chuỗi Style thành Object {{ styleName: 'value' }} */}
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.65rem' }}>
                    {cartCount}
                  </span>
                </Link>
              </li>

              {/* Auth Links - Hiển thị nếu chưa đăng nhập */}
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link header-icon-btn fw-bold" to="/register" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-user-plus me-1"></i> Đăng ký
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link header-icon-btn fw-bold" to="/login" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-user-circle me-1"></i> Đăng nhập
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* User Info - Hiển thị khi đã đăng nhập */}
                  <li className="nav-item dropdown">
                    <a className="nav-link header-icon-btn fw-bold dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-user-circle me-1"></i> Hello {username}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li>
                        <Link className="dropdown-item" to="/orders">
                          <i className="fas fa-box me-2"></i> Đơn hàng của tôi
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
