import Header from '../components/Header';
import Footer from '../components/Footer';

const AuthLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main role="main" className="pb-3" style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;
