import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import api from '../../services/api';
import cartService from '../../services/cart/cartService';
import Swal from 'sweetalert2';
import './ProductDetail.css'; 

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [activeTab, setActiveTab] = useState('mota');
  const [mainDisplayImage, setMainDisplayImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // 1. Lấy chi tiết sản phẩm
    api.get(`/customer/products/${id}`)
      .then(response => {
        const prodData = response.data.data || response.data;
        setProduct(prodData);
        if (prodData && prodData.imageURL) {
            setMainDisplayImage(`/images/${prodData.imageURL}`);
        }
      })
      .catch(error => console.error("Lỗi lấy chi tiết sp:", error));

    // 2. Lấy toàn bộ sản phẩm
    api.get('/customer/products')
      .then(response => {
        setAllProducts(response.data.data || response.data || []);
      })
      .catch(error => console.error("Lỗi lấy danh sách sp:", error));

    // 3. Lấy đánh giá
    api.get(`/DanhGia?idSanPham=${id}`)
      .then(response => {
          setReviews(response.data || []);
      })
      .catch(error => console.error("Lỗi lấy đánh giá:", error));

    setQuantity(1);
  }, [id]);

  const formatSpace = (price) => {
    return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleAddToCart = async () => {
      try {
          const response = await cartService.addToCart(id, quantity);
          
          if (response.success) {
              Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Đã thêm vào giỏ hàng",
                  showConfirmButton: false,
                  timer: 1500
              });
              
              // Phát custom event để cập nhật badge ở Header
              window.dispatchEvent(new CustomEvent('cartUpdated'));
          }
      } catch (error) {
          if (error.message && error.message.includes('đăng nhập')) {
              Swal.fire({
                  icon: 'warning',
                  title: 'Yêu cầu đăng nhập',
                  text: 'Vui lòng đăng nhập để thêm vào giỏ hàng',
                  confirmButtonText: 'Đăng nhập'
              }).then(() => navigate(`/login?returnUrl=${encodeURIComponent(`/product/${id}`)}`));
          } else {
              Swal.fire({ 
                  icon: "error", 
                  title: "Thất bại", 
                  text: error.message || "Vui lòng thử lại sau!" 
              });
          }
      }
  };

  const handleBuyNow = async (phone = null, address = null) => {
      try {
          const payload = {
              soLuong: quantity,
              sdt: phone,
              diaChi: address
          };

          const res = await api.post(`/customer/products/${id}`, payload);
          const data = res.data;

          if (data.success === false && data.requiresInfo === true) {
              let formHtml = '';
              if (data.missingSdt) {
                  formHtml += `
                      <div style="margin-bottom: 15px; text-align: left;">
                          <label style="font-weight:bold;">Số điện thoại <span style="color:red">*</span></label>
                          <input id="swal-input-sdt" class="swal2-input" style="margin: 5px 0; width: 100%;" placeholder="Nhập số điện thoại">
                      </div>`;
              }
              if (data.missingAddress) {
                  formHtml += `
                      <div style="text-align: left;">
                          <label style="font-weight:bold;">Địa chỉ nhận hàng <span style="color:red">*</span></label>
                          <input id="swal-input-diachi" class="swal2-input" style="margin: 5px 0; width: 100%;" placeholder="Số nhà, đường, phường/xã...">
                      </div>`;
              }

              const { value: formValues } = await Swal.fire({
                  title: 'Thông tin giao hàng',
                  html: formHtml,
                  focusConfirm: false,
                  showCancelButton: true,
                  confirmButtonText: 'Xác nhận mua',
                  preConfirm: () => {
                      let sdtVal = phone; 
                      let diaChiVal = address;

                      if (data.missingSdt) {
                          sdtVal = document.getElementById('swal-input-sdt').value;
                          if (!sdtVal || !/^\d{10,11}$/.test(sdtVal)) {
                              Swal.showValidationMessage('Số điện thoại không hợp lệ');
                              return false;
                          }
                      }
                      if (data.missingAddress) {
                          diaChiVal = document.getElementById('swal-input-diachi').value;
                          if (!diaChiVal || diaChiVal.trim().length < 5) {
                              Swal.showValidationMessage('Vui lòng nhập địa chỉ cụ thể');
                              return false;
                          }
                      }
                      return { sdt: sdtVal, diaChi: diaChiVal };
                  }
              });

              if (formValues) {
                  handleBuyNow(formValues.sdt, formValues.diaChi);
              }
          } 
          else if (data.success) {
              Swal.fire({
                  icon: 'success',
                  title: 'Đặt hàng thành công!',
                  showConfirmButton: false,
                  timer: 1500
              }).then(() => {
                  if (data.redirectUrl) navigate(data.redirectUrl);
              });
          } else {
              Swal.fire({ icon: "error", title: "Lỗi", text: data.message || "Đã có lỗi xảy ra" });
          }
      } catch (error) {
          if (error.response && error.response.status === 401) {
              navigate('/login');
          } else {
              Swal.fire({ icon: "error", title: "Lỗi hệ thống", text: "Không thể kết nối đến server." });
          }
      }
  };

  if (!product) return <div className="container py-5 text-center"><h2>Đang tải sản phẩm...</h2></div>;

  const topProducts = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 10);
  const relatedProducts = allProducts
        .filter(p => String(p.idSanPham) !== String(id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

  let thumbImages = [];
  try {
      if (product.imageLienQuan) thumbImages = JSON.parse(product.imageLienQuan);
  } catch (error) {}

  if (thumbImages.length === 0) {
      thumbImages = [product.imageURL, product.imageURL, product.imageURL, product.imageURL];
  }

  const renderReviews = () => {
      const danhGiaList = Array.isArray(reviews) ? reviews : (reviews.danhGiaList || []);
      if (danhGiaList.length === 0) return <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>;

      return danhGiaList.map((dg, index) => (
          <div key={index} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between">
                  <strong>{dg.userName ?? "Ẩn danh"}</strong>
                  <span className="text-warning">{dg.soSao} ★</span>
              </div>
              <p className="mt-2 mb-1">{dg.noiDung ?? ""}</p>
              <small className="text-muted">{new Date(dg.ngayDanhGia).toLocaleString('vi-VN')}</small>
          </div>
      ));
  };

  return (
    <section className="main-content container py-5">
        <aside className="sidebar">
            <h3>Danh mục sản phẩm</h3>
            <div className="filter-group">
                <label><input type="checkbox" /> Điện thoại</label>
                <label><input type="checkbox" /> Laptop</label>
                <label><input type="checkbox" /> Tai nghe</label>
                <label><input type="checkbox" /> Phụ kiện</label>
            </div>

            <div className="featured-products">
                <h3>Sản phẩm nổi bật</h3>
                {topProducts.map(sp => (
                    <div key={sp.idSanPham} className="featured-item mb-3">
                        <Link to={`/product/${sp.idSanPham}`} className="view-icon">
                            <img src={`/images/${sp.imageURL}`} alt={sp.tenSanPham} style={{ width: '60px', height: '60px', objectFit: 'cover'}} />
                        </Link>
                        <div className="featured-info ms-2">
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{sp.tenSanPham}</h4>
                            <p className="price m-0" style={{ fontSize: '0.85rem'}}>
                                {formatSpace(sp.gia)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>

        <article className="product-detail p-4 bg-white rounded shadow-sm">
            <div className="product-gallery">
                <div className="main-image">
                    <img src={mainDisplayImage} alt={product.tenSanPham} />
                </div>
                <div className="thumbnail-list d-flex flex-column gap-2">
                    {thumbImages.map((thumb, index) => (
                        <img 
                            key={index}
                            src={thumb.includes('/') ? thumb : `/images/${thumb}`} 
                            alt={`Thumb ${index + 1}`} 
                            className="thumb-img"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '1px solid #ddd' }}
                            onClick={() => setMainDisplayImage(thumb.includes('/') ? thumb : `/images/${thumb}`)}
                        />
                    ))}
                </div>
            </div>

            <div className="product-info mt-4">
                <h1 style={{ fontSize: '1.8rem', color: '#2d2d2d', fontWeight: '600' }}>{product.tenSanPham}</h1>
                <div className="product-meta d-flex gap-3 align-items-center text-muted mb-3">
                    <div className="rating text-warning">★★★★★ <span className="text-muted">(120 đánh giá)</span></div>
                    <span>|</span>
                    <span>Mã sản phẩm: {product.idSanPham}</span>
                    <span>|</span>
                    <span>Tình trạng: Còn hàng</span>
                </div>
                
                <div className="price-box my-3">
                    <span className="current-price fs-2 fw-bold text-primary">{formatSpace(product.gia)}</span>
                </div>
                
                <div className="moTa mt-4 text-muted" dangerouslySetInnerHTML={{ __html: product.moTa || 'Chưa có cập nhật mô tả.' }}></div>
                
                <div className="add-to-cart d-flex gap-3 align-items-center mt-4">
                    <div className="quantity d-flex align-items-center border rounded">
                        <button type="button" className="px-3 py-2 border-0 bg-light" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                        <input type="number" className="border-0 text-center" value={quantity} readOnly style={{ width: '50px' }} />
                        <button type="button" className="px-3 py-2 border-0 bg-light" onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>
                    <button onClick={() => handleBuyNow()} className="btn btn-primary px-4 py-2 text-white border-0 fw-bold rounded">Mua ngay</button>
                    <button onClick={handleAddToCart} className="btn btn-dark px-4 py-2 text-white border-0 fw-bold rounded">Thêm vào giỏ</button>
                </div>
            </div>

            <div className="tabs mt-5 d-flex border-bottom">
                <div className={`tab px-4 py-2 fw-bold ${activeTab === 'mota' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`} onClick={() => setActiveTab('mota')} style={{ cursor: 'pointer' }}>Mô tả</div>
                <div className={`tab px-4 py-2 fw-bold ${activeTab === 'thongso' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`} onClick={() => setActiveTab('thongso')} style={{ cursor: 'pointer' }}>Thông số kỹ thuật</div>
                <div className={`tab px-4 py-2 fw-bold ${activeTab === 'danhgia' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`} onClick={() => setActiveTab('danhgia')} style={{ cursor: 'pointer' }}>Đánh giá</div>
            </div>

            <div className={`mt-4 ${activeTab === 'mota' ? 'd-block' : 'd-none'}`}>
                <div dangerouslySetInnerHTML={{ __html: product.moTa || 'Nội dung mô tả...' }}></div>
            </div>
            <div className={`mt-4 ${activeTab === 'thongso' ? 'd-block' : 'd-none'}`}>
                <div dangerouslySetInnerHTML={{ __html: product.thongSoSanPham || 'Thông số kỹ thuật...' }}></div>
            </div>
            <div className={`mt-4 ${activeTab === 'danhgia' ? 'd-block' : 'd-none'}`}>
                {renderReviews()}
            </div>

            {/* Sản phẩm liên quan */}
            <div className="related-products mt-5">
                <h3 className="mb-4">Sản phẩm liên quan</h3>
                <div className="product-grid">
                    {relatedProducts.map((sp) => (
                        <div key={sp.idSanPham} className="product-card product-item-inner-item position-relative shadow-sm bg-white rounded border">
                            <div className="product-details">
                                <Link to={`/product/${sp.idSanPham}`} className="view-icon">
                                    <img 
                                        src={`/images/${sp.imageURL}`} 
                                        className="img-fluid w-100 rounded-top" 
                                        alt="sản phẩm liên quan" 
                                        style={{ height: '180px', objectFit: 'contain', padding: '10px' }} 
                                    />
                                </Link>
                            </div>
                            <div className="product-card-info p-3 border-top">
                                <h4 style={{ height: '45px', overflow: 'hidden', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontSize: '1rem', color: '#333' }}>
                                    {sp.tenSanPham}
                                </h4>
                                <p className="price fw-bold text-primary mt-2">{formatSpace(sp.gia)}</p>
                                <button onClick={() => handleAddToCart()} className="w-100 py-2 bg-primary text-white border-0 rounded mt-2">Thêm vào giỏ</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    </section>
  );
};

export default ProductDetail;