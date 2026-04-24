import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import authService from '../../services/auth/authService';
import { AUTH_MESSAGES, AUTH_ROUTES } from '../../services/auth/constants';
import AuthLayout from '../../layouts/AuthLayout';
import './Auth.css';

/**
 * Login Page - Bootstrap Style
 * @component
 */
const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username?.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập hoặc email';
    }
    if (!formData.password?.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.login(formData.username, formData.password);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: AUTH_MESSAGES.LOGIN_SUCCESS,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          const returnUrl = searchParams.get('returnUrl');
          navigate(returnUrl || AUTH_ROUTES.HOME);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: res.message || AUTH_MESSAGES.LOGIN_ERROR,
        });
      }
    } catch (error) {
      // authService throw { message: '...', success: false } (từ response.data của backend)
      const errorMsg = error?.message || AUTH_MESSAGES.LOGIN_ERROR;
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-wrapper">
        <div className="card shadow-lg border-0 auth-card">
        <div className="row g-0">
          {/* Cột trái: Ảnh nền */}
          <div className="col-md-6 login-image"></div>

          {/* Cột phải: Form */}
          <div className="col-md-6">
            <div className="form-wrapper">
              <h2 className="text-center mb-4">Đăng nhập</h2>

              <form onSubmit={handleSubmit}>
                {/* Username/Email */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    id="username"
                    placeholder="Tên đăng nhập hoặc email"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="username">Tên đăng nhập / Email</label>
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                {/* Password */}
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="Mật khẩu"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="password">Mật khẩu</label>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* Remember me */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                {/* Submit button */}
                <div className="d-grid gap-2 mb-3">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                </div>

                {/* Links */}
                <div className="text-center">
                  <p className="mb-2">
                    <Link to={AUTH_ROUTES.FORGOT_PASSWORD}>Quên mật khẩu?</Link>
                  </p>
                  <p className="mb-0">
                    Chưa có tài khoản? <Link to={AUTH_ROUTES.REGISTER} className="fw-bold">Đăng ký ngay</Link>
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

export default Login;
