import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import orderService from '../../services/order/orderService';
import returnService from '../../services/return/returnService';
import './ReturnRequest.css';

const ReturnRequest = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lyDo, setLyDo] = useState('');

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderDetail(orderId);
      if (response.success) {
        setOrder(response.data);
      } else {
        Swal.fire('Lỗi', response.message, 'error');
        navigate('/orders');
      }
    } catch (err) {
      console.error(err);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lyDo.trim()) {
      Swal.fire('Chú ý', 'Vui lòng nhập lý do đổi trả', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('idDonDat', orderId);
      formData.append('lyDo', lyDo);

      const response = await returnService.submitReturnRequest(formData);
      if (response.success) {
        await Swal.fire('Thành công', 'Yêu cầu đổi trả của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất.', 'success');
        navigate(`/order-detail/${orderId}`);
      } else {
        Swal.fire('Lỗi', response.message, 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra khi gửi yêu cầu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container">Đang tải...</div>;

  return (
    <div className="return-request-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-0 overflow-hidden" style={{ borderRadius: '20px' }}>
              <div className="card-header bg-danger text-white py-4 px-5">
                <h3 className="mb-0 fw-bold">Yêu cầu đổi trả</h3>
                <p className="mb-0 small opacity-75">Đơn hàng: #{orderId}</p>
              </div>
              <div className="card-body p-5">
                <div className="order-summary-mini mb-4 p-4 rounded-4 bg-light">
                  <h6 className="fw-bold mb-3">Sản phẩm trong đơn hàng:</h6>
                  {order && order.chiTietDonHangs.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-3 mb-2 pb-2 border-bottom last-no-border">
                      <img 
                        src={item.imageURL.startsWith('http') ? item.imageURL : `/images/${item.imageURL}`} 
                        alt={item.tenSanPham} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div className="flex-grow-1">
                        <p className="mb-0 small fw-semibold line-clamp-1">{item.tenSanPham}</p>
                        <p className="mb-0 smaller text-muted">x{item.soLuong}</p>
                      </div>
                      <p className="mb-0 small fw-bold">
                        {(item.thanhTien)?.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between mt-3 fw-bold text-danger">
                    <span>Tổng tiền hoàn lại dự kiến:</span>
                    <span>{order && (order.tongTien)?.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Lý do đổi trả <span className="text-danger">*</span></label>
                    <textarea 
                      className="form-control" 
                      rows="6" 
                      placeholder="VD: Sản phẩm bị móp méo, giao sai màu sắc, không hoạt động..."
                      required
                      value={lyDo}
                      onChange={(e) => setLyDo(e.target.value)}
                      style={{ borderRadius: '15px', padding: '15px' }}
                    ></textarea>
                  </div>
                  
                  <div className="return-policy p-4 rounded-4 mb-4" style={{ backgroundColor: '#fff5f5', border: '1px solid #fed7d7' }}>
                    <h6 className="fw-bold text-danger mb-2"> Chính sách đổi trả</h6>
                    <ul className="small text-muted mb-0 ps-3">
                      <li>Thời gian đổi trả trong vòng 7 ngày kể từ khi nhận hàng.</li>
                      <li>Sản phẩm phải còn nguyên vẹn tem mác và vỏ hộp.</li>
                      <li>Vui lòng giữ lại hóa đơn mua hàng.</li>
                    </ul>
                  </div>

                  <div className="d-flex gap-3">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100 py-3 fw-bold"
                      style={{ borderRadius: '15px' }}
                      onClick={() => navigate(-1)}
                    >
                      HỦY BỎ
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-danger w-100 py-3 fw-bold shadow-sm"
                      style={{ borderRadius: '15px' }}
                      disabled={submitting}
                    >
                      {submitting ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequest;
