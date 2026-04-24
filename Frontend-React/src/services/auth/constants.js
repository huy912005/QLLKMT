export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGIN_ERROR: 'Sai tài khoản hoặc mật khẩu',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công',
  REGISTER_ERROR: 'Đăng ký thất bại',
  INVALID_EMAIL: 'Email không hợp lệ',
  PASSWORD_MISMATCH: 'Mật khẩu không khớp',
  PASSWORD_TOO_SHORT: 'Mật khẩu phải ít nhất 6 ký tự',
  USERNAME_REQUIRED: 'Vui lòng nhập username',
  PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
  FULLNAME_REQUIRED: 'Vui lòng nhập họ và tên',
  EMAIL_REQUIRED: 'Vui lòng nhập email',
  NETWORK_ERROR: 'Không thể kết nối đến server',
  FORGOT_PASSWORD_SUCCESS: 'Yêu cầu reset mật khẩu đã được gửi',
};

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  HOME: '/',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USERNAME: 'username',
  USER_ID: 'userId',
};
