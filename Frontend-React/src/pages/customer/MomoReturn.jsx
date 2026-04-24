import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Checkout.css';

const formatPrice = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0);

const formatDate = (timestamp) => {
  if (!timestamp) return '—';
  const d = new Date(Number(timestamp));
  return isNaN(d.getTime())
    ? timestamp
    : d.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
};

// ═══════════════════════════════════════════════════════════════
// MOMO RETURN PAGE - shown after MoMo redirects back
// ═══════════════════════════════════════════════════════════════
const MomoReturn = () => {
  const location = useLocation();
  const [result, setResult] = useState(null);

  useEffect(() => {
    // MoMo redirects back with query params like:
    // ?resultCode=0&orderId=...&amount=...&orderInfo=...&transId=...
    const params = new URLSearchParams(location.search);

    const resultCode = params.get('resultCode') ?? params.get('errorCode') ?? '1';
    const orderId    = params.get('orderId')    ?? '—';
    const amount     = params.get('amount')     ?? '0';
    const orderInfo  = params.get('orderInfo')  ?? '—';
    const transId    = params.get('transId')    ?? params.get('transactionId') ?? '—';
    const message    = params.get('message')    ?? params.get('localMessage')  ?? '';
    const payType    = params.get('payType')    ?? '—';
    const responseTime = params.get('responseTime') ?? '';

    setResult({ resultCode, orderId, amount, orderInfo, transId, message, payType, responseTime });
  }, [location.search]);

  if (!result) {
    return (
      <div className="momo-return-page">
        <div className="momo-result-card" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            width: 48, height: 48, border: '4px solid #e0e7ff',
            borderTopColor: '#6c63ff', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 20px'
          }} />
          <p style={{ color: '#64748b' }}>Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  const isSuccess = result.resultCode === '0';

  return (
    <div className="momo-return-page">
      <div className="momo-result-card">
        {/* MoMo Logo */}
        <div className="momo-logo-ring" style={{ marginBottom: 24 }}>
          <span>M</span>
        </div>

        {/* Result Icon */}
        <div className={`momo-result-icon ${isSuccess ? 'success' : 'failed'}`}>
          {isSuccess ? (
            <i className="fas fa-check-circle" />
          ) : (
            <i className="fas fa-times-circle" />
          )}
        </div>

        {/* Title */}
        <div className="momo-result-title">
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </div>

        {/* Subtitle */}
        <div className="momo-result-subtitle">
          {isSuccess
            ? 'Giao dịch MoMo của bạn đã được xác nhận.\nChúng tôi sẽ xử lý đơn hàng ngay.'
            : (result.message || 'Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.')}
        </div>

        {/* Details */}
        <div className="momo-result-details">
          <div className="momo-result-row">
            <span className="label">Mã đơn hàng</span>
            <span className="value">{result.orderId}</span>
          </div>
          <div className="momo-result-row">
            <span className="label">Số tiền</span>
            <span className="value amount">{formatPrice(result.amount)}</span>
          </div>
          {result.transId !== '—' && (
            <div className="momo-result-row">
              <span className="label">Mã giao dịch</span>
              <span className="value" style={{ fontSize: '0.82rem' }}>{result.transId}</span>
            </div>
          )}
          {result.responseTime && (
            <div className="momo-result-row">
              <span className="label">Thời gian</span>
              <span className="value">{formatDate(result.responseTime)}</span>
            </div>
          )}
          {result.payType && result.payType !== '—' && (
            <div className="momo-result-row">
              <span className="label">Hình thức</span>
              <span className="value" style={{ textTransform: 'capitalize' }}>
                {result.payType === 'qr' ? 'Quét mã QR' : result.payType}
              </span>
            </div>
          )}
          <div className="momo-result-row">
            <span className="label">Trạng thái</span>
            <span className="value" style={{ color: isSuccess ? '#059669' : '#dc2626' }}>
              {isSuccess ? '✓ Thành công' : '✗ Thất bại'} (Code: {result.resultCode})
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="momo-result-actions">
          <Link to="/" className="btn-home">
            <i className="fas fa-home" /> Về trang chủ
          </Link>
          {isSuccess ? (
            <Link to="/orders" className="btn-orders">
              <i className="fas fa-list-alt" /> Xem đơn hàng
            </Link>
          ) : (
            <Link to="/checkout" className="btn-orders">
              <i className="fas fa-redo" /> Thử lại
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomoReturn;
