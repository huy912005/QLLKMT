import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import authService from '../../services/auth/authService';
import { AUTH_MESSAGES, AUTH_ROUTES } from '../../services/auth/constants';
import AuthLayout from '../../layouts/AuthLayout';
import './Auth.css';

/**
 * ForgotPassword Page - Bootstrap Style
 * @component
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS,
          showConfirmButton: false,
          timer: 2000,
        });
        setEmail('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: res.message || 'Đã có lỗi xảy ra',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Không thể kết nối đến server',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-wrapper">
        <div className="card shadow-lg border-0 auth-card" style={{ maxWidth: '600px' }}>
        <div className="row g-0">
          <div className="col-12">
            <div className="form-wrapper" style={{ minHeight: 'auto', borderRadius: '12px' }}>
              <h2 className="text-center mb-4">Quên mật khẩu?</h2>
              <p className="text-center text-muted mb-4">
                Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn reset mật khẩu
              </p>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({});
                      }
                    }}
                    disabled={isLoading}
                  />
                  <label htmlFor="email">Email</label>
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Submit button */}
                <div className="d-grid gap-2 mb-3">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang gửi...' : 'Gửi hướng dẫn reset'}
                  </button>
                </div>

                {/* Link to login */}
                <div className="text-center">
                  <p className="mb-0">
                    Nhớ mật khẩu rồi? <Link to={AUTH_ROUTES.LOGIN} className="fw-bold">Đăng nhập</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
