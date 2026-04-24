import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import cartService from '../../services/cart/cartService';
import api from '../../services/api';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getUserCart();
      
      if (response.success) {
        setCartItems(response.data || []);
      } else {
        setError(response.message || 'Không thể tải giỏ hàng');
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
      if (err.message.includes('đăng nhập')) {
        Swal.fire({
          icon: 'warning',
          title: 'Yêu cầu đăng nhập',
          text: 'Vui lòng đăng nhập để xem giỏ hàng',
          confirmButtonText: 'Đăng nhập'
        }).then(() => navigate('/login'));
      } else {
        setError(err.message || 'Lỗi khi tải giỏ hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (idSanPham) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const response = await cartService.removeFromCart(idSanPham);
        if (response.success) {
          setCartItems(cartItems.filter(item => item.sanPham.idSanPham !== idSanPham));
          Swal.fire({
            icon: 'success',
            title: 'Đã xóa',
            text: 'Sản phẩm đã được xóa khỏi giỏ hàng',
            timer: 1500,
            showConfirmButton: false
          });
          // Phát custom event để cập nhật badge ở Header
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
      }
    } catch (err) {
      console.error('Remove item error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể xóa sản phẩm'
      });
    }
  };

  const handleIncreaseQuantity = async (idSanPham) => {
    try {
      const response = await cartService.increaseQuantity(idSanPham);
      
      // Update UI optimistically
      setCartItems(cartItems.map(item =>
        item.sanPham.idSanPham === idSanPham
          ? { ...item, soLuongTrongGio: item.soLuongTrongGio + 1 }
          : item
      ));
      
      // Phát custom event để cập nhật badge ở Header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Increase quantity error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể cập nhật số lượng'
      });
      // Revert on error
      fetchCart();
    }
  };

  const handleDecreaseQuantity = async (idSanPham) => {
    try {
      const currentItem = cartItems.find(item => item.sanPham.idSanPham === idSanPham);
      if (currentItem && currentItem.soLuongTrongGio <= 1) {
        await handleRemoveItem(idSanPham);
        return;
      }

      const response = await cartService.decreaseQuantity(idSanPham);
      
      // Update UI optimistically
      setCartItems(cartItems.map(item =>
        item.sanPham.idSanPham === idSanPham
          ? { ...item, soLuongTrongGio: item.soLuongTrongGio - 1 }
          : item
      ));
      
      // Phát custom event để cập nhật badge ở Header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Decrease quantity error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể cập nhật số lượng'
      });
      // Revert on error
      fetchCart();
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const calculateSubtotal = (product) => {
    return product.sanPham.gia * product.soLuongTrongGio;
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Giỏ hàng trống',
        text: 'Vui lòng thêm sản phẩm trước',
        confirmButtonColor: '#6c63ff',
      });
      return;
    }
    // Điều hướng sang trang thanh toán chuyên biệt
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-3">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Lỗi!</h4>
          <p>{error}</p>
          <button onClick={fetchCart} className="btn btn-danger">Thử lại</button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2 className="mb-4">Giỏ hàng của bạn trống</h2>
          <p className="text-muted mb-4">Hãy thêm một số sản phẩm để bắt đầu</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="container py-5">
        <h1 className="mb-4">Giỏ hàng của bạn</h1>

        <div className="row">
          {/* Cart Items Table */}
          <div className="col-lg-8">
            <div className="cart-items-section bg-white rounded shadow-sm p-4">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng cộng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.sanPham.idSanPham} className="align-middle">
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={`/images/${item.sanPham.imageURL}`}
                            alt={item.sanPham.tenSanPham}
                            className="cart-item-img"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div>
                            <Link 
                              to={`/product/${item.sanPham.idSanPham}`}
                              style={{ textDecoration: 'none', color: '#333' }}
                            >
                              <h6 className="mb-1">{item.sanPham.tenSanPham}</h6>
                            </Link>
                            <small className="text-muted">ID: {item.sanPham.idSanPham}</small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold text-primary">
                        {formatPrice(item.sanPham.gia)}
                      </td>
                      <td>
                        <div className="quantity-control d-flex align-items-center border rounded" style={{ width: 'fit-content' }}>
                          <button
                            className="btn btn-sm btn-light border-0"
                            onClick={() => handleDecreaseQuantity(item.sanPham.idSanPham)}
                          >
                            −
                          </button>
                          <span className="px-3 py-1">{item.soLuongTrongGio}</span>
                          <button
                            className="btn btn-sm btn-light border-0"
                            onClick={() => handleIncreaseQuantity(item.sanPham.idSanPham)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold text-success">
                        {formatPrice(calculateSubtotal(item))}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveItem(item.sanPham.idSanPham)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Link to="/" className="btn btn-outline-primary">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary bg-white rounded shadow-sm p-4">
              <h5 className="mb-4 fw-bold">Tóm tắt đơn hàng</h5>

              <div className="summary-row d-flex justify-content-between mb-3">
                <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>

              <div className="summary-row d-flex justify-content-between mb-3 text-muted">
                <small>Phí vận chuyển:</small>
                <small>Miễn phí</small>
              </div>

              <hr />

              <div className="summary-row d-flex justify-content-between mb-4 fw-bold fs-5">
                <span>Thành tiền:</span>
                <span className="text-primary">{formatPrice(calculateTotal())}</span>
              </div>

              <button
                className="btn btn-primary w-100 py-2 fw-bold mb-2"
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </button>

              <button
                className="btn btn-outline-secondary w-100 py-2"
                onClick={() => navigate('/')}
              >
                Tiếp tục mua sắm
              </button>

              {/* Additional Info */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-2">✓ Lợi ích khi mua hàng</h6>
                <ul className="small mb-0">
                  <li>Giao hàng nhanh (2-3 ngày)</li>
                  <li>Hỗ trợ trả hàng 30 ngày</li>
                  <li>Bảo hành sản phẩm</li>
                  <li>Thanh toán an toàn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
