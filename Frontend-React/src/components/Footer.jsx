const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-column">
                        <h3>Thông tin cửa hàng</h3>
                        <p>Electro - Cửa hàng điện tử hàng đầu Việt Nam.</p>
                    </div>
                    <div className="footer-column">
                        <h3>Dịch vụ khách hàng</h3>
                        <ul>
                            <li><a href="#">Liên hệ</a></li>
                            <li><a href="#">Trả hàng</a></li>
                            <li><a href="#">Đơn hàng</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Thông tin</h3>
                        <ul>
                            <li><a href="#">Về chúng tôi</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                            <li><a href="#">Điều khoản sử dụng</a></li>
                        </ul>
                    </div>
                    <div className="footer-column newsletter">
                        <h3>Đăng ký nhận tin</h3>
                        <input type="email" placeholder="Email của bạn" />
                        <button>Đăng ký</button>
                    </div>
                </div>
                <div className="footer-bottom">
                    <a href="https://github.com/ThoKhang/PJWeb.git" style={{ color: 'white', textDecoration: 'none' }}>Git nhóm 5ae</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
