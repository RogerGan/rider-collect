import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FormPage from './pages/FormPage.jsx';
import MarketingPage from './pages/MarketingPage.jsx';

function Nav() {
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
      <Link to="/">登记开卡</Link>
      <Link to="/marketing">营销活动</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/marketing" element={<MarketingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
