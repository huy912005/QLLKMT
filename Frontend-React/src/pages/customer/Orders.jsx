import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import orderService from '../../services/order/orderService';
import authService from '../../services/auth/authService';
import './Orders.css';

// Hình ảnh từ public/images
const getImageUrl = (imageURL) => {
  if (!imageURL) return '/images/placeholder.jpg';
  if (imageURL.startsWith('http')) return imageURL;
  return `/images/${imageURL}`;
};

// Status badge styling
const getStatusBadge = (status) => {
  const statusMap = {
    CHO_XAC_NHAN: { label: 'Chờ xác nhận', color: 'warning' },
    DANG_GIAO: { label: 'Đang giao', color: 'info' },
    DA_GIAO: { label: 'Đã giao', color: 'success' },
    DA_HUY: { label: 'Đã hủy', color: 'danger' },
    TRA_LAI: { label: 'Trả lại', color: 'secondary' }
  };

  const info = statusMap[status] || { label: status, color: 'secondary' };
  return <span className={`badge bg-${info.color}`}>{info.label}</span>;
};

// Format price
const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Skeleton loader
const SkeletonOrderItem = () => (
  <div className="skeleton-order-item">
    <div className="skeleton skeleton-text" style={{ height: '20px', marginBottom: '10px' }} />
    <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '8px', width: '80%' }} />
    <div className="skeleton skeleton-text" style={{ height: '16px', width: '60%' }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ORDERS PAGE - LỊCH SỬ ĐƠN HÀNG
// ═══════════════════════════════════════════════════════════════
const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Yêu cầu đăng nhập',
        text: 'Vui lòng đăng nhập để xem đơn hàng',
        confirmButtonText: 'Đăng nhập',
        confirmButtonColor: '#ff6b00'
      }).then(() => navigate('/login'));
      return;
    }

    fetchOrders();
  }, [userId, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getUserOrders(userId);

      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách đơn hàng');
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.message || 'Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by status
  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.trangThai === filterStatus);

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.ngayDat) - new Date(a.ngayDat)
  );

  return (
    <div className="orders-container">
      <div className="container-fluid py-5">
        {/* Header */}
        <div className="orders-header mb-4">
          <h1 className="orders-title">
            <i className="fas fa-box me-3"></i>Lịch Sử Đơn Hàng
          </h1>
          <p className="orders-subtitle">Quản lý và theo dõi các đơn hàng của bạn</p>
        </div>

        {/* Filter tabs */}
        <div className="orders-filter mb-4">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Tất cả ({orders.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'CHO_XAC_NHAN' ? 'active' : ''}`}
            onClick={() => setFilterStatus('CHO_XAC_NHAN')}
          >
            Chờ xác nhận
          </button>
          <button
            className={`filter-btn ${filterStatus === 'DANG_GIAO' ? 'active' : ''}`}
            onClick={() => setFilterStatus('DANG_GIAO')}
          >
            Đang giao
          </button>
          <button
            className={`filter-btn ${filterStatus === 'DA_GIAO' ? 'active' : ''}`}
            onClick={() => setFilterStatus('DA_GIAO')}
          >
            Đã giao
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="orders-list">
            {[1, 2, 3].map(i => <SkeletonOrderItem key={i} />)}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
            <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchOrders}>
              Thử lại
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && sortedOrders.length === 0 && (
          <div className="empty-state text-center py-5">
            <i className="fas fa-inbox empty-icon"></i>
            <h3>Chưa có đơn hàng nào</h3>
            <p className="text-muted">Hãy mua sắm ngay để có đơn hàng đầu tiên của bạn</p>
            <Link to="/" className="btn btn-primary mt-3">
              <i className="fas fa-shopping-cart me-2"></i>Tiếp tục mua sắm
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && sortedOrders.length > 0 && (
          <div className="orders-list">
            {sortedOrders.map(order => (
              <Link
                key={order.idDonDat}
                to={`/order-detail/${order.idDonDat}`}
                className="order-card"
              >
                <div className="order-card-header">
                  <div className="order-info">
                    <span className="order-id">Đơn hàng: <strong>#{order.idDonDat}</strong></span>
                    <span className="order-date">{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="order-status">
                    {getStatusBadge(order.trangThai)}
                  </div>
                </div>

                <div className="order-card-body">
                  {order.chiTietDonHangs && order.chiTietDonHangs.length > 0 && (
                    <div className="order-products">
                      {order.chiTietDonHangs.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="product-preview">
                          <img
                            src={getImageUrl(item.imageURL)}
                            alt={item.tenSanPham}
                            className="product-img"
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                          <div className="product-info">
                            <p className="product-name">{item.tenSanPham}</p>
                            <p className="product-qty">x{item.soLuong}</p>
                          </div>
                        </div>
                      ))}
                      {order.chiTietDonHangs.length > 3 && (
                        <div className="product-more">
                          +{order.chiTietDonHangs.length - 3} sản phẩm khác
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="order-card-footer">
                  <div className="order-total">
                    <span className="label">Tổng tiền:</span>
                    <span className="price">{formatPrice(order.tongTien)}</span>
                  </div>
                  <div className="order-action">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
