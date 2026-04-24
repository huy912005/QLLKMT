import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CustomerLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Cắm khối Đầu vào đây */}
      <Header />
      
      {/* 
        Outlet chính là @RenderBody() của C#
        Mỗi khi bấm Link, ruột bên trong thẻ <main> này thay đổi mượt mà! 
      */}
      <main role="main" className="pb-3" style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Cắm khối Đuôi vào đây */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
