import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/customer/products')
            .then(response => {
                setProducts(response.data.data);
            })
            .catch(error => {
                console.error("Ôi mạng mẽo chán quá, Java mất tiêu:", error);
            });
    }, []);

    const formatSpace = (price) => {
        return price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <>
            <div className="container-fluid product py-5">
                <div className="container py-5">
                    <div className="tab-class">
                        <div className="row g-4">
                            <div className="col-lg-6 text-start">
                                <h1>Sản phẩm của chúng tôi</h1>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="row g-4">
                                {products.map((sp) => {
                                    // ĐÃ XÓA MARGIN BỰ: Trả về nguyên mẫu C#
                                    return (
                                        <div className="col-md-6 col-lg-4 col-xl-3" key={sp.idSanPham}>
                                            <div className="product-item rounded border">
                                                <div className="product-item-inner border rounded">
                                                    <div className="product-item-inner-item position-relative">
                                                        {/* Ảnh Sản Phẩm động */}
                                                        <img src={`/images/${sp.imageURL}`}
                                                            onError={(e) => { e.target.onerror = null; e.target.src = '/vite.svg'; }}
                                                            className="img-fluid w-100 rounded-top"
                                                            style={{ height: '220px', objectFit: 'cover' }}
                                                            alt={sp.tenSanPham} />

                                                        {/* Badge Sale/New giống hệt C# */}
                                                        <div className="product-new text-white">New</div>

                                                        {/* Hiệu ứng mắt xem (Hover) C# */}
                                                        <div className="product-details">
                                                            <Link to={`/product/${sp.idSanPham}`} className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                                <i className="fa fa-eye fa-1x text-white"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="text-center rounded-bottom p-4">

                                                        {/* ĐÃ SỬA: sp.maLoai -> sp.tenLoaiSanPham */}
                                                        <span className="d-block mb-2 text-primary fw-bold">
                                                            Dòng {sp.tenLoaiSanPham || 'VIP'}
                                                        </span>

                                                        {/* ĐÃ SỬA: sp.id -> sp.idSanPham (ĐỂ NÓ KHÔNG BỊ TRANG WEB UNDEFINED NỮA) */}
                                                        <Link to={`/product/${sp.idSanPham}`} className="d-block h4 text-decoration-none text-dark">
                                                            {sp.tenSanPham}
                                                        </Link>

                                                        <span className="text-danger fs-4 fw-bold">{formatSpace(sp.gia)}</span>
                                                    </div>
                                                </div>
                                                <div className="product-item-add border border-top-0 rounded-bottom text-center p-4 pt-0">
                                                    <button className="btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4">
                                                        <i className="fas fa-shopping-cart me-2"></i> Thêm vào giỏ
                                                    </button>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex">
                                                            <i className="fas fa-star text-primary"></i>
                                                            <i className="fas fa-star text-primary"></i>
                                                            <i className="fas fa-star text-primary"></i>
                                                            <i className="fas fa-star text-primary"></i>
                                                            <i className="fas fa-star text-muted"></i>
                                                        </div>
                                                        <div className="d-flex">
                                                            <Link to="#" className="text-primary d-flex align-items-center justify-content-center me-3">
                                                                <span className="rounded-circle btn-sm-square border">
                                                                    <i className="fas fa-random"></i>
                                                                </span>
                                                            </Link>
                                                            <Link to="#" className="text-primary d-flex align-items-center justify-content-center me-0">
                                                                <span className="rounded-circle btn-sm-square border">
                                                                    <i className="fas fa-heart"></i>
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {products.length === 0 && (
                                    <div className="col-12 text-center text-secondary">
                                        <i className="fas fa-spinner fa-spin fs-2"></i>
                                        <p className="mt-2">Đang tải chôm chỉa dữ liệu từ Java qua...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
