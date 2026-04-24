# 📚 HƯỚNG DẪN REACT SHOPPING CART - CHI TIẾT ĐẦY ĐỦ

## 🎯 Mục tiêu
Hiểu cách xây dựng giỏ hàng trong React từ A-Z

---

## 📊 KIẾN TRÚC GIỎ HÀNG

```
┌─────────────────────────────────────────────┐
│          Frontend React (Người dùng)        │
│  - Header (Click giỏ hàng → /cart)         │
│  - ProductDetail (Click Thêm vào giỏ)      │
│  - Cart.jsx (Hiển thị & quản lý giỏ)       │
└──────────────┬──────────────────────────────┘
               │ (gọi API)
               ↓
┌─────────────────────────────────────────────┐
│        Backend (Java Spring Boot)           │
│  - GET /api/cart → Lấy giỏ hàng             │
│  - POST /api/cart/add → Thêm sản phẩm       │
│  - PUT /api/cart/update → Cập nhật số lượng │
│  - DELETE /api/cart/:id → Xóa sản phẩm      │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│         Database (MySQL)                    │
│  - Lưu trữ giỏ hàng của user                │
└─────────────────────────────────────────────┘
```

---

## 🔑 KHÁI NIỆM CHÍNH TRONG REACT

### 1. **useState - Quản lý State (Trạng thái)**

```javascript
// Cú pháp:
const [state, setState] = useState(initialValue);

// Ví dụ trong Cart:
const [cart, setCart] = useState([]);           // Mảng sản phẩm
const [isLoading, setIsLoading] = useState(true); // Đang tải?
const [isEmpty, setIsEmpty] = useState(false);   // Giỏ có trống?

// setState sẽ trigger re-render (vẽ lại giao diện)
setCart([...newItems]); // React sẽ tự render lại UI
```

### 2. **useEffect - Lifecycle (Vòng đời Component)**

```javascript
// Cú pháp:
useEffect(() => {
  // Chạy khi component mount hoặc dependency thay đổi
  return () => {
    // Cleanup (tùy chọn)
  };
}, [dependency1, dependency2]); // Dependency array

// Ví dụ:
useEffect(() => {
  const fetchCart = async () => {
    const res = await cartService.getCart();
    setCart(res.data);
  };
  
  fetchCart();
}, []); // [] = chạy 1 lần khi component mount

// Giải thích:
// [] = Chạy 1 lần khi component vừa xuất hiện (similar to ngOnInit)
// [variable] = Chạy mỗi khi variable thay đổi
// (không có) = Chạy sau mỗi lần render
```

### 3. **Re-render - Vẽ lại giao diện**

```javascript
// Bất cứ khi nào setState được gọi, React sẽ tự động:
// 1. Cập nhật state
// 2. Vẽ lại component (re-render)
// 3. DOM cập nhật với dữ liệu mới

// Ví dụ:
const [quantity, setQuantity] = useState(1);

// Khi click nút +
<button onClick={() => setQuantity(quantity + 1)}>+</button>

// React sẽ:
// 1. setQuantity(2)
// 2. Component re-render với quantity = 2
// 3. UI hiển thị 2
```

---

## 🛒 LUỒNG HOẠT ĐỘNG CHI TIẾT

### **Bước 1: User Click Giỏ hàng (Header)**
```javascript
// Header.jsx
<Link to="/cart">
  <i className="fas fa-shopping-cart"></i>
</Link>
// → Chuyển hướng đến /cart
```

### **Bước 2: Cart Component Mount (Tải dữ liệu)**
```javascript
// Cart.jsx
useEffect(() => {
  // 1. Kiểm tra user đã đăng nhập
  if (!authService.isAuthenticated()) {
    navigate('/login');
    return;
  }

  // 2. Gọi API lấy giỏ hàng
  const fetchCart = async () => {
    const res = await cartService.getCart(); // GET /api/cart
    setCart(res.data); // Lưu vào state
  };

  fetchCart();
}, []); // [] = chạy 1 lần khi component mount
```

### **Bước 3: Hiển thị Sản phẩm (Render)**
```javascript
// Cart.jsx
return (
  <table>
    <tbody>
      {cart.map((item) => (
        // Lặp qua từng sản phẩm và hiển thị
        <tr key={item.idSanPham}>
          <td>{item.tenSanPham}</td>
          <td>{item.soLuong}</td>
          <td>{calculateSubtotal(item)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

### **Bước 4: User Click Tăng/Giảm Số Lượng**
```javascript
// Cart.jsx
const handleQuantityChange = async (idSanPham, soLuong) => {
  // 1. Gọi API cập nhật backend
  const res = await cartService.updateCart(idSanPham, soLuong);
  
  // 2. Cập nhật state (UI sẽ tự render lại)
  setCart(prevCart =>
    prevCart.map(item =>
      item.idSanPham === idSanPham 
        ? { ...item, soLuong } // Cập nhật số lượng
        : item
    )
  );
};

// User click +
<button onClick={() => handleQuantityChange(123, quantity + 1)}>+</button>
// → Backend cập nhật → State cập nhật → UI render lại
```

### **Bước 5: User Click Xóa**
```javascript
const handleRemoveItem = async (idSanPham) => {
  // 1. Gọi API xóa
  const res = await cartService.removeFromCart(idSanPham);
  
  // 2. Xóa khỏi state
  const newCart = cart.filter(item => item.idSanPham !== idSanPham);
  setCart(newCart);
};
```

### **Bước 6: User Click Thanh Toán**
```javascript
const handleCheckout = () => {
  // Chuyển hướng đến trang thanh toán
  navigate('/checkout', { state: { cartItems: cart } });
};
```

---

## 💡 CÁC TỠI LẦM THƯỜNG GẶP

### ❌ KHÔNG NÊN: Thay đổi state trực tiếp
```javascript
// ❌ SAI (React sẽ không detect được thay đổi)
cart[0].soLuong = 2;
setCart(cart);

// ✅ ĐÚNG (Tạo object mới)
setCart(prevCart =>
  prevCart.map((item, index) =>
    index === 0 ? { ...item, soLuong: 2 } : item
  )
);
```

### ❌ KHÔNG NÊN: Gọi setState trong vòng lặp
```javascript
// ❌ SAI (React sẽ render lại nhiều lần)
cart.forEach(item => {
  setCart(...);
});

// ✅ ĐÚNG (Tính toán 1 lần, setState 1 lần)
const newCart = cart.map(item => ({...item}));
setCart(newCart);
```

### ❌ KHÔNG NÊN: Quên dependency array
```javascript
// ❌ SAI (useEffect chạy mỗi lần render → gọi API liên tục)
useEffect(() => {
  fetchCart();
});

// ✅ ĐÚNG (useEffect chạy 1 lần khi mount)
useEffect(() => {
  fetchCart();
}, []);
```

---

## 🎨 CẤU TRÚC MÃ CART.JSX

```javascript
const Cart = () => {
  // ====== 1. STATE ======
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ====== 2. HÀM TÍNH TOÁN ======
  const calculateSubtotal = (item) => item.giaSanPham * item.soLuong;
  
  const calculateTotal = () =>
    cart.reduce((total, item) => total + calculateSubtotal(item), 0);

  // ====== 3. HÀM XỬ LÝ ======
  const handleQuantityChange = (id, qty) => { /* ... */ };
  const handleRemoveItem = (id) => { /* ... */ };
  const handleCheckout = () => { /* ... */ };

  // ====== 4. LIFECYCLE ======
  useEffect(() => {
    fetchCart();
  }, []);

  // ====== 5. RENDER ======
  return (
    <div className="container">
      {isLoading ? (
        <Spinner />
      ) : isEmpty ? (
        <EmptyCart />
      ) : (
        <CartTable />
      )}
    </div>
  );
};
```

---

## 📦 API ENDPOINTS (Backend)

| Phương thức | Endpoint | Mục đích |
|---|---|---|
| GET | `/api/cart` | Lấy toàn bộ giỏ |
| POST | `/api/cart/add` | Thêm sản phẩm |
| PUT | `/api/cart/update` | Cập nhật số lượng |
| DELETE | `/api/cart/:id` | Xóa sản phẩm |
| DELETE | `/api/cart` | Xóa toàn bộ giỏ |

### Ví dụ Request/Response:

```javascript
// GET /api/cart
Response: {
  success: true,
  data: [
    {
      idSanPham: 1,
      tenSanPham: "Laptop",
      giaSanPham: 15000000,
      soLuong: 1,
      imageURL: "laptop.jpg"
    }
  ]
}

// POST /api/cart/add
Request: {
  idSanPham: 1,
  soLuongTrongGio: 2
}
Response: {
  success: true,
  message: "Đã thêm vào giỏ"
}
```

---

## 🚀 BƯỚC TIẾP THEO

1. **Tạo Checkout Page** (thanh toán)
2. **Tạo Order History** (lịch sử đơn hàng)
3. **Thêm Discount Code** (mã giảm giá)
4. **Tối ưu Performance** (lazy loading, memoization)

---

## 🎓 TÀI LIỆU THAM KHẢO

- React Documentation: https://react.dev
- React Hooks: https://react.dev/reference/react
- State Management: https://react.dev/learn/adding-interactivity
- Best Practices: https://react.dev/learn/you-might-not-need-an-effect

---

## ❓ CÂU HỎI THƯỜNG GẶP

**Q: Tại sao phải dùng useState thay vì biến thường?**
A: useState tự động trigger re-render khi state thay đổi. Biến thường không thể.

**Q: Khi nào nên dùng useEffect?**
A: Dùng để lấy dữ liệu, subscribe events, setup timers, etc.

**Q: Làm sao để tránh render lại quá nhiều lần?**
A: Dùng useMemo, useCallback, hoặc React.memo.

**Q: Có thể lưu giỏ hàng vào localStorage không?**
A: Được, nhưng nên lưu vào backend để an toàn. Có thể dùng localStorage cho cache.

---

**Chúc bạn học tốt! 🎉**
