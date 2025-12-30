// src/components/Layout.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';
import { useTheme } from '../context/ThemeContext';
import { getJellyLogo, getJellyLabel } from '../utils/jellyAssets';

function Layout({ title, children }) {
   const { pathname } = useLocation();
   const navigate = useNavigate();
   // 🔹 setColorMode 추가해서 헤더에서 토글 가능하게
   const { colorMode, jelly, setColorMode } = useTheme();

   const logoImg = getJellyLogo(jelly);
   const jellyLabel = getJellyLabel(jelly);

   const goHome = () => {
      navigate('/');
   };

   const toggleTheme = () => {
      setColorMode(colorMode === 'light' ? 'dark' : 'light');
   };

   return (
      <div className="layout">
         <header className="layout-header">
            <div className="layout-header-inner">
               <div className="layout-header-left">
                  {/* 로고 영역: PNG 로고 버튼 → 홈 이동 */}
                  <div className="layout-logo">
                     <button type="button" className="logo-button" onClick={goHome} aria-label="홈으로 이동">
                        <img src={logoImg} alt={`${jellyLabel} 로고`} className="logo-img" />
                     </button>

                     <div className="logo-text">
                        <span className="logo-title">{title}</span>
                     </div>
                  </div>
               </div>

               <div className="layout-header-right">
                  {/* 🔹 헤더에서 바로 다크/라이트 모드 토글 */}
                  <button type="button" className="layout-theme-chip" onClick={toggleTheme}>
                     {colorMode === 'light' ? '☾ 다크 모드' : '☀ 라이트 모드'}
                  </button>

                  <Link to="/settings" className="layout-settings-chip">
                     ⚙ 설정
                  </Link>
               </div>
            </div>
         </header>

         <main className="layout-body">{children}</main>

         <nav className="layout-tab">
            <Link to="/" className={pathname === '/' ? 'layout-tab-link active' : 'layout-tab-link'}>
               <span className="layout-tab-icon">🏠</span>
               <span className="layout-tab-label">홈</span>
            </Link>
            <Link to="/tasks" className={pathname === '/tasks' ? 'layout-tab-link active' : 'layout-tab-link'}>
               <span className="layout-tab-icon">📋</span>
               <span className="layout-tab-label">플랜</span>
            </Link>
            <Link to="/calendar" className={pathname === '/calendar' ? 'layout-tab-link active' : 'layout-tab-link'}>
               <span className="layout-tab-icon">📅</span>
               <span className="layout-tab-label">캘린더</span>
            </Link>
            <Link to="/settings" className={pathname === '/settings' ? 'layout-tab-link active' : 'layout-tab-link'}>
               <span className="layout-tab-icon">⚙</span>
               <span className="layout-tab-label">설정</span>
            </Link>
         </nav>
      </div>
   );
}

export default Layout;
