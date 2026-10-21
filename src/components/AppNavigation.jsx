import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ClipboardList,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Store,
  X,
} from 'lucide-react';
import { Button } from './UI.jsx';

function isActiveTab(path, route, adminPath) {
  if (path === adminPath) return route.startsWith('/admin') || route === '/auth';
  if (path === '/') return route === '/' || route.startsWith('/booth/');
  return route === path;
}

const NAV_ITEMS = [
  { path: '/', label: '부스 찾기', Icon: House },
  { path: '/orders', label: '주문내역', Icon: ClipboardList },
];

export function AppHeader({ route, go, admin, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // 다른 화면으로 이동하면 펼쳐진 메뉴도 닫습니다.
  useEffect(() => setMenuOpen(false), [route]);

  function navigate(path) {
    setMenuOpen(false);
    go(path);
  }

  const adminPath = admin ? '/admin' : '/auth';
  const adminActive = route.startsWith('/admin') || route === '/auth';

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <button className="brand" onClick={() => navigate('/')} aria-label="부스메이트 홈">
          <span className="brand-mark"><Store size={21} strokeWidth={2.5} /></span>
          <span>부스메이트<span className="brand-dot">.</span></span>
        </button>

        <nav id="main-navigation" className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="주 메뉴">
          <button className={route === '/' ? 'nav-active' : ''} onClick={() => navigate('/')}>부스 찾기</button>
          <button className={route === '/orders' ? 'nav-active' : ''} onClick={() => navigate('/orders')}>내 주문내역</button>
          <span className="nav-divider" />
          <button className={adminActive ? 'nav-active' : ''} onClick={() => navigate(adminPath)}>
            <ShieldCheck size={16} /> {admin ? '운영자 대시보드' : '부스 참가자'}
          </button>
          {admin && (
            <button className="mobile-logout" onClick={logout}>
              <LogOut size={16} /> 로그아웃
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {admin ? (
            <>
              <button className="admin-avatar" onClick={() => navigate('/admin')} aria-label="내 부스 관리">
                {admin.name.slice(0, 1)}
              </button>
              <button className="icon-button desktop-logout" onClick={logout} aria-label="로그아웃">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Button variant="dark" size="sm" onClick={() => navigate('/auth')}>
              운영자 로그인 <ArrowRight size={15} />
            </Button>
          )}
        </div>

        <button
          className="mobile-menu icon-button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

/** 태블릿·모바일에서 자주 쓰는 3개 화면으로 바로 이동합니다. */
export function MobileBottomNav({ route, go, admin }) {
  const adminPath = admin ? '/admin' : '/auth';
  const items = [
    ...NAV_ITEMS,
    { path: adminPath, label: '부스 관리', Icon: LayoutDashboard },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="빠른 화면 이동">
      {items.map(({ path, label, Icon }) => {
        const active = isActiveTab(path, route, adminPath);

        return (
          <button
            key={label}
            className={active ? 'active' : ''}
            onClick={() => go(path)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={21} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
