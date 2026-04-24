import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import orderService from '../../services/order/orderService';
import reviewService from '../../services/review/reviewService';
import './Review.css';

const Review = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // State for reviews: mapping target product ID to its review data
  // { 'SP01': { soSao: 5, noiDung: '', hinhAnhs: [] } }
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderDetail(orderId);
      if (response.success) {
        setOrder(response.data);
        // Initialize review state for each product
        const initialReviews = {};
        response.data.chiTietDonHangs.forEach(item => {
          initialReviews[item.idSanPham] = {
            idSanPham: item.idSanPham,
            soSao: 5,
            noiDung: '',
            hinhAnhs: [],
            previews: [] // for UI display
          };
        });
        setReviews(initialReviews);
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

  const handleStarClick = (productId, stars) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], soSao: stars }
    }));
  };

  const handleTextChange = (productId, text) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], noiDung: text }
    }));
  };

  const handleFileChange = (productId, e) => {
    const files = Array.from(e.target.files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    
    setReviews(prev => ({
      ...prev,
      [productId]: { 
        ...prev[productId], 
        hinhAnhs: [...prev[productId].hinhAnhs, ...files],
        previews: [...prev[productId].previews, ...previews]
      }
    }));
  };

  const removeImage = (productId, index) => {
    setReviews(prev => {
      const newHinhAnhs = [...prev[productId].hinhAnhs];
      const newPreviews = [...prev[productId].previews];
      newHinhAnhs.splice(index, 1);
      newPreviews.splice(index, 1);
      return {
        ...prev,
        [productId]: { ...prev[productId], hinhAnhs: newHinhAnhs, previews: newPreviews }
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Submit each review sequentially
      const productIds = Object.keys(reviews);
      
      for (const pid of productIds) {
        const reviewData = reviews[pid];
        if (!reviewData.noiDung.trim()) continue; // Skip empty reviews if needed, or enforce it

        const formData = new FormData();
        formData.append('idSanPham', pid);
        formData.append('soSao', reviewData.soSao);
        formData.append('noiDung', reviewData.noiDung);
        
        reviewData.hinhAnhs.forEach(file => {
          formData.append('hinhAnhs', file);
        });

        await reviewService.submitReview(formData);
      }

      await Swal.fire('Thành công', 'Cảm ơn bạn đã đánh giá sản phẩm!', 'success');
      navigate(`/order-detail/${orderId}`);
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra khi gửi đánh giá', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container">Đang tải...</div>;

  return (
    <div className="review-page">
      <div className="container py-5">
        <h2 className="mb-4 fw-bold">Đánh giá sản phẩm</h2>
        <p className="text-muted mb-4">Đơn hàng: #{orderId}</p>

        {order && order.chiTietDonHangs.map((item) => (
          <div key={item.idSanPham} className="review-card card mb-4 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex gap-3 mb-4">
                <img 
                  src={item.imageURL.startsWith('http') ? item.imageURL : `/images/${item.imageURL}`} 
                  alt={item.tenSanPham} 
                  className="review-product-img" 
                />
                <div>
                  <h5 className="fw-bold mb-1">{item.tenSanPham}</h5>
                  <p className="small text-muted mb-0">Phân loại: {item.tenLoaiSanPham}</p>
                </div>
              </div>

              <div className="rating-section mb-4">
                <p className="mb-2 fw-semibold">Vui lòng đánh giá số sao:</p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <i 
                      key={star}
                      className={`${star <= reviews[item.idSanPham].soSao ? 'fas' : 'far'} fa-star`}
                      onClick={() => handleStarClick(item.idSanPham, star)}
                    ></i>
                  ))}
                  <span className="ms-3 text-warning fw-bold">
                    {reviews[item.idSanPham].soSao === 5 ? 'Tuyệt vời' : 
                     reviews[item.idSanPham].soSao === 4 ? 'Hài lòng' :
                     reviews[item.idSanPham].soSao === 3 ? 'Bình thường' :
                     reviews[item.idSanPham].soSao === 2 ? 'Không hài lòng' : 'Tệ'}
                  </span>
                </div>
              </div>

              <div className="comment-section mb-4">
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé..."
                  value={reviews[item.idSanPham].noiDung}
                  onChange={(e) => handleTextChange(item.idSanPham, e.target.value)}
                ></textarea>
              </div>

              <div className="image-upload-section">
                <label className="upload-btn">
                  <i className="fas fa-camera me-2"></i> Thêm hình ảnh
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    hidden 
                    onChange={(e) => handleFileChange(item.idSanPham, e)} 
                  />
                </label>
                
                <div className="preview-container mt-3">
                  {reviews[item.idSanPham].previews.map((src, index) => (
                    <div key={index} className="preview-item">
                      <img src={src} alt="preview" />
                      <button className="remove-btn" onClick={() => removeImage(item.idSanPham, index)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="text-end mt-4">
          <button 
            className="btn btn-lg btn-warning px-5 fw-bold text-white shadow"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'ĐANG GỬI...' : 'HOÀN TẤT ĐÁNH GIÁ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
