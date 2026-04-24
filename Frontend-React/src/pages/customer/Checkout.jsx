import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import cartService from '../../services/cart/cartService';
import checkoutService from '../../services/checkout/checkoutService';
import api from '../../services/api';
import './Checkout.css';

const BACKEND_URL = 'http://localhost:8080';

const formatPrice = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const getImageUrl = (imageURL) => {
  if (!imageURL) return 'https://via.placeholder.com/60x60?text=SP';
  if (imageURL.startsWith('http')) return imageURL;
  return `${BACKEND_URL}/images/${imageURL}`;
};

// ─── Skeleton Loader ───────────────────────────────────────────
const SkeletonItems = () => (
  <>
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton-item">
        <div className="skeleton skeleton-img" />
        <div className="skeleton-text">
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      </div>
    ))}
  </>
);

// ─── Payment Option Component ───────────────────────────────────
const PaymentOption = ({ id, value, icon, iconClass, title, desc, badge, checked, onChange }) => (
  <label className="payment-option">
    <input
      type="radio"
      name="paymentMethod"
      id={id}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
    />
    <div className="payment-option-label">
      <div className={`payment-icon ${iconClass}`}>
        <i className={icon} />
      </div>
      <div className="payment-info">
        <div className="payment-name">{title}</div>
        <div className="payment-desc">{desc}</div>
      </div>
      {badge && <span className="payment-badge">{badge}</span>}
      <div className="payment-check">
        {checked && <i className="fas fa-check" />}
      </div>
    </div>
  </label>
);

// ═══════════════════════════════════════════════════════════════
// MAIN CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════
const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [userProfile, setUserProfile] = useState(null); // thông tin đầy đủ từ backend

  // ── Đọc thông tin cơ bản từ localStorage (authService lưu riêng lẻ) ──
  const username = localStorage.getItem('username');
  const token    = localStorage.getItem('token');

  // ── Fetch cart + profile on mount ──────────────────────────
  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Yêu cầu đăng nhập',
        text: 'Vui lòng đăng nhập để tiến hành thanh toán',
        confirmButtonText: 'Đăng nhập',
        confirmButtonColor: '#6c63ff',
      }).then(() => navigate('/login'));
      return;
    }
    fetchCart();
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/user/me');
      if (res.data?.data) {
        setUserProfile(res.data.data);
      }
    } catch (err) {
      // Nếu API /user/me chưa có, dùng username từ localStorage
      console.warn('fetchUserProfile failed, fallback to localStorage:', err.message);
      setUserProfile({ userName: username, hoTen: username });
    }
  };

  const fetchCart = async () => {
    try {
      setLoadingCart(true);
      const response = await cartService.getUserCart();
      if (response.success) {
        if (!response.data || response.data.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Giỏ hàng trống',
            text: 'Vui lòng thêm sản phẩm trước khi thanh toán',
            confirmButtonColor: '#6c63ff',
          }).then(() => navigate('/cart'));
          return;
        }
        setCartItems(response.data);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể tải giỏ hàng' });
    } finally {
      setLoadingCart(false);
    }
  };

  // ── Pricing helpers ──────────────────────────────────────────
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.sanPham.gia * item.soLuongTrongGio, 0
  );
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  // ── Handle payment ───────────────────────────────────────────
  const handlePay = async () => {
    if (cartItems.length === 0) return;

    try {
      setPaying(true);

      if (selectedMethod === 'cod') {
        // COD: confirm order directly
        const res = await checkoutService.confirmOrder('cod');
        if (res.success !== false) {
          Swal.fire({
            icon: 'success',
            title: 'Đặt hàng thành công!',
            html: '<p>Cảm ơn bạn đã mua hàng!<br>Đơn hàng sẽ được giao trong 2-3 ngày.</p>',
            confirmButtonColor: '#6c63ff',
            confirmButtonText: 'Xem đơn hàng',
          }).then(() => navigate('/orders'));
        }
      } else if (selectedMethod === 'momo') {
        // MOMO: call backend to get payment URL
        const res = await checkoutService.createMomoPayment({
          fullName: userProfile?.hoTen || username || 'Khach hang',
          orderInfo: 'Thanh toan don hang',
          amount: total,
        });

        if (res.payUrl) {
          // Redirect to MoMo payment gateway
          window.location.href = res.payUrl;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi MoMo',
            text: res.message || 'Không thể tạo liên kết thanh toán MoMo',
          });
        }
      } else if (selectedMethod === 'banking') {
        navigate('/banking-transfer');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi thanh toán',
        text: err.response?.data?.message || err.message || 'Vui lòng thử lại sau',
      });
    } finally {
      setPaying(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Page Header ── */}
      <div className="checkout-header">
        <div className="container text-center">
          <h1>PHƯƠNG THỨC THANH TOÁN</h1>
          <nav>
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/cart">Giỏ hàng</Link>
              </li>
              <li className="breadcrumb-item active">Thanh toán</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="checkout-page">
        <div className="container">
          <div className="row g-4">
            {/* ─── LEFT COL ─────────────────────────────────── */}
            <div className="col-lg-8">

              {/* User Info */}
              <div className="checkout-card">
                <h4>
                  <span className="section-icon"><i className="fas fa-user" /></span>
                  Thông tin người nhận
                </h4>
                {token ? (
                  <div className="user-info-box">
                    <div className="user-avatar">
                      <i className="fas fa-user" />
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {userProfile?.hoTen || username || 'Khách hàng'}
                      </div>
                      <div className="user-contact">
                        <span>
                          <i className="fas fa-phone" />
                          {userProfile?.phoneNumber || 'Chưa cập nhật SĐT'}
                        </span>
                        <span>
                          <i className="fas fa-map-marker-alt" />
                          {userProfile?.soNha || 'Chưa cập nhật địa chỉ'}
                        </span>
                        <span>
                          <i className="fas fa-envelope" />
                          {userProfile?.email || username || ''}
                        </span>
                      </div>
                    </div>
                    <Link to="/profile" className="btn-edit-profile">
                      <i className="fas fa-edit" /> Thay đổi
                    </Link>
                  </div>
                ) : (
                  <p className="text-muted">
                    <Link to="/login" style={{ color: '#6c63ff' }}>Đăng nhập</Link> để xem thông tin
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="checkout-card">
                <h4>
                  <span className="section-icon"><i className="fas fa-credit-card" /></span>
                  Chọn phương thức thanh toán
                </h4>

                <div className="payment-methods">
                  <PaymentOption
                    id="cod"
                    value="cod"
                    icon="fas fa-money-bill-wave"
                    iconClass="cod"
                    title="Thanh toán khi nhận hàng (COD)"
                    desc="Thanh toán bằng tiền mặt khi nhận hàng"
                    checked={selectedMethod === 'cod'}
                    onChange={setSelectedMethod}
                  />

                  <PaymentOption
                    id="momo"
                    value="momo"
                    icon="fas fa-mobile-alt"
                    iconClass="momo"
                    title="Ví điện tử MoMo"
                    desc="Thanh toán nhanh chóng qua ứng dụng MoMo"
                    badge="Khuyến nghị"
                    checked={selectedMethod === 'momo'}
                    onChange={setSelectedMethod}
                  />

                  {/* MoMo extra info */}
                  <div className={`momo-promo ${selectedMethod === 'momo' ? 'visible' : ''}`}>
                    <div className="momo-logo-ring" style={{ width: 36, height: 36, borderRadius: 8 }}>
                      <span style={{ fontSize: '0.85rem' }}>M</span>
                    </div>
                    <span>
                      Bạn sẽ được chuyển đến cổng thanh toán <strong>MoMo</strong> an toàn.
                      Quét mã QR hoặc nhập số điện thoại để thanh toán.
                    </span>
                  </div>

                  <PaymentOption
                    id="banking"
                    value="banking"
                    icon="fas fa-university"
                    iconClass="banking"
                    title="Chuyển khoản ngân hàng"
                    desc="Chuyển khoản qua internet banking hoặc ATM"
                    checked={selectedMethod === 'banking'}
                    onChange={setSelectedMethod}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="checkout-actions">
                <Link to="/cart" className="btn-back-cart">
                  <i className="fas fa-arrow-left" /> Quay lại giỏ hàng
                </Link>
                <button
                  className={`btn-pay ${paying ? 'loading' : ''}`}
                  onClick={handlePay}
                  disabled={paying || loadingCart}
                >
                  {paying ? (
                    <>
                      <div className="spinner" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      {selectedMethod === 'momo' ? (
                        <>Thanh toán MoMo <i className="fas fa-mobile-alt" /></>
                      ) : selectedMethod === 'banking' ? (
                        <>Chuyển khoản <i className="fas fa-arrow-right" /></>
                      ) : (
                        <>Đặt hàng (COD) <i className="fas fa-check" /></>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ─── RIGHT COL: Order Summary ─────────────────── */}
            <div className="col-lg-4">
              <div className="order-summary-panel">
                <h4>
                  <i className="fas fa-receipt" style={{ color: '#6c63ff' }} />
                  Đơn hàng của bạn
                </h4>

                {/* Items */}
                <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                  {loadingCart ? (
                    <SkeletonItems />
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.sanPham.idSanPham} className="order-item">
                        <img
                          src={getImageUrl(item.sanPham.imageURL)}
                          alt={item.sanPham.tenSanPham}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=SP'; }}
                        />
                        <div className="order-item-info">
                          <div className="order-item-name" title={item.sanPham.tenSanPham}>
                            {item.sanPham.tenSanPham}
                          </div>
                          <div className="order-item-qty">
                            {formatPrice(item.sanPham.gia)} × {item.soLuongTrongGio}
                          </div>
                        </div>
                        <div className="order-item-price">
                          {formatPrice(item.sanPham.gia * item.soLuongTrongGio)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Price Summary */}
                <div className="price-rows">
                  <div className="price-row">
                    <span>Tạm tính ({cartItems.length} SP)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="price-row">
                    <span>Phí vận chuyển</span>
                    {shipping === 0 ? (
                      <span className="shipping-free">✓ Miễn phí</span>
                    ) : (
                      <span>{formatPrice(shipping)}</span>
                    )}
                  </div>
                  {shipping === 0 && (
                    <div className="price-row" style={{ fontSize: '0.78rem', color: '#059669', paddingTop: 2 }}>
                      <span>🎉 Miễn phí với đơn từ 500.000₫</span>
                    </div>
                  )}
                  <div className="price-row total">
                    <span>Tổng tiền</span>
                    <span className="amount">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="info-alert">
                  <i className="fas fa-shield-alt" />
                  <span>
                    Giao dịch được bảo mật bởi SSL 256-bit.
                    Vui lòng kiểm tra kỹ đơn hàng trước khi thanh toán.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
