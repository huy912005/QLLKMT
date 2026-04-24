import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import authService from '../../services/auth/authService';
import { AUTH_MESSAGES, AUTH_ROUTES } from '../../services/auth/constants';
import AuthLayout from '../../layouts/AuthLayout';
import './Auth.css';

/**
 * Register Page - Bootstrap Style
 * @component
 */
const Register = () => {
  const [formData, setFormData] = useState({
    hoTen: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

    if (!formData.hoTen?.trim()) {
      newErrors.hoTen = 'Vui lòng nhập họ và tên';
    }

    if (!formData.username?.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password?.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
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
      const res = await authService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.hoTen
      );

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Chào mừng!',
          text: AUTH_MESSAGES.REGISTER_SUCCESS,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(AUTH_ROUTES.LOGIN);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: res.message || AUTH_MESSAGES.REGISTER_ERROR,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || AUTH_MESSAGES.REGISTER_ERROR,
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
          <div className="col-md-6 register-image"></div>

          {/* Cột phải: Form */}
          <div className="col-md-6">
            <div className="form-wrapper">
              <h2 className="text-center mb-4">Tạo tài khoản mới</h2>

              <form onSubmit={handleSubmit}>
                {/* Họ và tên */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={`form-control ${errors.hoTen ? 'is-invalid' : ''}`}
                    id="hoTen"
                    placeholder="Họ và tên"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="hoTen">Họ và tên</label>
                  {errors.hoTen && (
                    <div className="invalid-feedback">{errors.hoTen}</div>
                  )}
                </div>

                {/* Email */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="email">Email</label>
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Username */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    id="username"
                    placeholder="Tên đăng nhập"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="username">Tên đăng nhập</label>
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

                {/* Confirm Password */}
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>

                {/* Submit button */}
                <div className="d-grid gap-2 mb-3">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký ngay'}
                  </button>
                </div>

                {/* Link to login */}
                <div className="text-center">
                  <p className="mb-0">
                    Đã có tài khoản? <Link to={AUTH_ROUTES.LOGIN} className="fw-bold">Đăng nhập</Link>
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

export default Register;
