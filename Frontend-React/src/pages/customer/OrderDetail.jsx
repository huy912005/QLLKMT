import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import orderService from '../../services/order/orderService';
import authService from '../../services/auth/authService';
import './OrderDetail.css';

// Hình ảnh từ public/images
const getImageUrl = (imageURL) => {
  if (!imageURL) return '/images/placeholder.jpg';
  if (imageURL.startsWith('http')) return imageURL;
  return `/images/${imageURL}`;
};

// Status timeline component
const StatusTimeline = ({ status, ngayDat, ngayGiaoDuKien }) => {
  const statuses = [
    { key: 'CHO_XAC_NHAN', label: 'Chờ xác nhận', icon: 'fas fa-clipboard-list' },
    { key: 'DANG_GIAO', label: 'Đang giao', icon: 'fas fa-truck' },
    { key: 'DA_GIAO', label: 'Đã giao', icon: 'fas fa-check-circle' }
  ];

  const currentIndex = statuses.findIndex(s => s.key === status);

  return (
    <div className="status-timeline">
      {statuses.map((s, idx) => (
        <div key={s.key} className="timeline-item">
          <div className={`timeline-dot ${idx <= currentIndex ? 'active' : ''}`}>
            <i className={s.icon}></i>
          </div>
          <div className="timeline-label">
            <p className="timeline-title">{s.label}</p>
            {s.key === 'CHO_XAC_NHAN' && ngayDat && (
              <p className="timeline-date">{new Date(ngayDat).toLocaleDateString('vi-VN')}</p>
            )}
            {s.key === 'DA_GIAO' && ngayGiaoDuKien && (
              <p className="timeline-date">{new Date(ngayGiaoDuKien).toLocaleDateString('vi-VN')}</p>
            )}
          </div>
          {idx < statuses.length - 1 && (
            <div className={`timeline-line ${idx < currentIndex ? 'completed' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Format price
const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Skeleton loader
const SkeletonLoader = () => (
  <div className="order-detail-skeleton">
    <div className="skeleton skeleton-block" style={{ height: '100px', marginBottom: '20px' }} />
    <div className="skeleton skeleton-block" style={{ height: '200px', marginBottom: '20px' }} />
    <div className="skeleton skeleton-block" style={{ height: '150px' }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// ORDER DETAIL PAGE
// ═══════════════════════════════════════════════════════════════
const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
      return;
    }
    fetchOrderDetail();
  }, [orderId, navigate]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderDetail(orderId);

      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.message || 'Không thể tải chi tiết đơn hàng');
      }
    } catch (err) {
      console.error('Fetch order detail error:', err);
      setError(err.message || 'Lỗi khi tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnRequest = () => {
    Swal.fire({
      title: 'Yêu cầu đổi trả',
      text: 'Bạn muốn tạo yêu cầu đổi trả cho đơn hàng này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff6b00',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yêu cầu',
      cancelButtonText: 'Hủy'
    }).then(result => {
      if (result.isConfirmed) {
        navigate(`/return-request/${orderId}`);
      }
    });
  };

  const handleCancelOrder = () => {
    Swal.fire({
      title: 'Hủy đơn hàng',
      text: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Không'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const user = authService.getCurrentUser();
          if (!user || !user.userId) throw new Error("Chưa đăng nhập");
          const response = await orderService.cancelOrder(orderId, user.userId);
          if (response.success) {
            Swal.fire('Thành công', 'Đơn hàng đã được hủy', 'success');
            fetchOrderDetail(); // reload order details
          } else {
            Swal.fire('Lỗi', response.message || 'Không thể hủy đơn hàng', 'error');
          }
        } catch (err) {
          Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra khi hủy đơn hàng', 'error');
        }
      }
    });
  };

  const handleReorder = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.userId) throw new Error("Chưa đăng nhập");
      const response = await orderService.reorder(orderId, user.userId);
      if (response.success) {
        Swal.fire({
          title: 'Thành công',
          text: 'Đã sao chép các sản phẩm vào giỏ hàng',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Đến giỏ hàng',
          cancelButtonText: 'Ở lại'
        }).then((result) => {
          // Kích hoạt sự kiện để Header cập nhật số giỏ hàng
          window.dispatchEvent(new Event('cartUpdated'));
          if (result.isConfirmed) {
            navigate('/cart');
          } else {
            navigate('/orders');
          }
        });
      } else {
        Swal.fire('Lỗi', response.message || 'Không thể mua lại', 'error');
      }
    } catch (err) {
      Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleReview = () => {
    navigate(`/review/${orderId}`);
  };

  return (
    <div className="order-detail-container">
      <div className="container-fluid py-5">
        {/* Header */}
        <div className="order-detail-header mb-4">
          <Link to="/orders" className="btn-back">
            <i className="fas fa-chevron-left"></i> Quay lại
          </Link>
          <h1 className="order-detail-title">Chi tiết đơn hàng</h1>
        </div>

        {/* Loading state */}
        {loading && <SkeletonLoader />}

        {/* Error state */}
        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
            <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchOrderDetail}>
              Thử lại
            </button>
          </div>
        )}

        {/* Order details */}
        {!loading && !error && order && (
          <div className="order-detail-content">
            {/* Status tracking */}
            <div className="card order-status-card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Trạng thái đơn hàng</h5>
                {order.trangThai === 'DA_HUY' ? (
                  <div className="alert alert-danger text-center m-0">
                    <i className="fas fa-times-circle me-2"></i> Đơn hàng đã được hủy
                  </div>
                ) : order.trangThai === 'TRA_LAI' ? (
                  <div className="alert alert-warning text-center m-0">
                    <i className="fas fa-undo-alt me-2"></i> Đơn hàng đang trong quá trình đổi trả
                  </div>
                ) : (
                  <StatusTimeline
                    status={order.trangThai}
                    ngayDat={order.ngayDat}
                    ngayGiaoDuKien={order.ngayGiaoDuKien}
                  />
                )}
              </div>
            </div>

            {/* Order info and delivery address */}
            <div className="row gap-4 mb-4">
              {/* Order Info */}
              <div className="col-lg-6">
                <div className="card order-info-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-info-circle me-2"></i>Thông tin đơn hàng
                    </h5>
                    <table className="info-table">
                      <tbody>
                        <tr>
                          <td className="label">Mã đơn:</td>
                          <td className="value">
                            <strong>{order.idDonDat}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="label">Ngày đặt:</td>
                          <td className="value">
                            {new Date(order.ngayDat).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td className="label">Phương thức thanh toán:</td>
                          <td className="value">
                            {order.thanhToan === 'COD' ? '💰 Thanh toán khi nhận hàng' : '📱 Thanh toán Momo'}
                          </td>
                        </tr>
                        <tr>
                          <td className="label">Trạng thái thanh toán:</td>
                          <td className="value">
                            {order.daThanhToan ? (
                              <span className="badge bg-success">Đã thanh toán</span>
                            ) : (
                              <span className="badge bg-warning">Chưa thanh toán</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="col-lg-6">
                <div className="card order-info-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-map-marker-alt me-2"></i>Địa chỉ giao hàng
                    </h5>
                    <div className="delivery-info">
                      <p className="user-name">{order.tenNguoiDung}</p>
                      <p className="user-phone">
                        <i className="fas fa-phone me-2"></i>{order.sdtGiaoHang}
                      </p>
                      <p className="user-address">
                        <i className="fas fa-home me-2"></i>{order.soNha}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="card order-products-card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <i className="fas fa-shopping-bag me-2"></i>Sản phẩm
                </h5>
                <div className="products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-right">Đơn giá</th>
                        <th className="text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.chiTietDonHangs && order.chiTietDonHangs.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="product-cell">
                              <img
                                src={getImageUrl(item.imageURL)}
                                alt={item.tenSanPham}
                                className="product-img"
                                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                              />
                              <div>
                                <p className="product-name">{item.tenSanPham}</p>
                                <p className="product-id">#{item.idSanPham}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{item.soLuong}</td>
                          <td className="text-right">{formatPrice(item.donGia)}</td>
                          <td className="text-right">
                            <strong>{formatPrice(item.thanhTien)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="row gap-4 mb-4">
              <div className="col-lg-6"></div>
              <div className="col-lg-6">
                <div className="card order-summary-card">
                  <div className="card-body">
                    <div className="summary-row">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(order.tongTien)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Phí vận chuyển:</span>
                      <span>Miễn phí</span>
                    </div>
                    <div className="summary-row total">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(order.tongTien)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="order-actions">
              {order.trangThai === 'CHO_XAC_NHAN' && (
                <button className="btn btn-outline-danger" onClick={handleCancelOrder}>
                  <i className="fas fa-times-circle me-2"></i>Hủy đơn hàng
                </button>
              )}
              {order.trangThai === 'DA_GIAO' && (
                <>
                  <button className="btn btn-review" onClick={handleReview}>
                    <i className="fas fa-star me-2"></i>Đánh giá sản phẩm
                  </button>
                  <button className="btn btn-return-request" onClick={handleReturnRequest}>
                    <i className="fas fa-undo me-2"></i>Yêu cầu đổi trả
                  </button>
                </>
              )}
              {/* Nút Mua Lại (Hiện lúc đã hủy, đã giao, hoặc bất kỳ lúc nào nếu phù hợp, ở đây cho hiện khi Đã Hủy hoặc Đã Giao) */}
              {(order.trangThai === 'DA_HUY' || order.trangThai === 'DA_GIAO' || order.trangThai === 'TRA_LAI') && (
                <button className="btn btn-success" onClick={handleReorder}>
                  <i className="fas fa-cart-plus me-2"></i>Mua lại
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
