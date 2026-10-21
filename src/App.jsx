import { ArrowRight, Store } from 'lucide-react';
import { AppHeader, MobileBottomNav } from './components/AppNavigation.jsx';
import { Button } from './components/UI.jsx';
import { useBoothApp } from './hooks/useBoothApp.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import {
  AuthPage,
  BoothDetailPage,
  HomePage,
  MemberDetailPage,
  MembersPage,
  OrderHistoryPage,
} from './pages/PublicPages.jsx';
import {
  AdminBoothPage,
  AdminHomePage,
  PeoplePage,
  SalesPage,
  SettingsPage,
} from './pages/AdminPages.jsx';

/** URL에 맞는 페이지를 선택합니다. 새 페이지는 여기서 연결하세요. */
function renderPage(route, publicProps, adminProps, login, register) {
  const { db, go } = publicProps;
  const { admin } = adminProps;
  const [section, boothId, subPage, memberId] = route.split('/').filter(Boolean);

  if (section === 'booth' && boothId) {
    const booth = db.booths.find((item) => item.id === boothId);
    if (!booth) return <NotFound go={go} />;

    if (subPage === 'members' && memberId) {
      return <MemberDetailPage {...publicProps} booth={booth} memberId={memberId} />;
    }
    if (subPage === 'members') {
      return <MembersPage {...publicProps} booth={booth} />;
    }
    return <BoothDetailPage {...publicProps} booth={booth} />;
  }

  if (section === 'orders') return <OrderHistoryPage {...publicProps} />;
  if (section === 'auth') {
    return <AuthPage {...publicProps} login={login} register={register} admin={admin} />;
  }

  if (section === 'admin') {
    if (!admin) {
      return <AuthPage {...publicProps} login={login} register={register} admin={admin} restricted />;
    }
    if (!boothId) return <AdminHomePage {...adminProps} />;

    // 다른 부스 소속 운영자는 관리 페이지를 열 수 없습니다 (데모용 확인).
    const booth = db.booths.find(
      (item) => item.id === boothId && admin.boothIds.includes(item.id),
    );
    if (!booth) return <NotFound go={go} />;

    switch (subPage) {
      case 'people':
        return <PeoplePage {...adminProps} booth={booth} />;
      case 'sales':
        return <SalesPage {...adminProps} booth={booth} />;
      case 'settings':
        return <SettingsPage {...adminProps} booth={booth} />;
      default:
        return <AdminBoothPage {...adminProps} booth={booth} />;
    }
  }

  return <HomePage {...publicProps} />;
}

export default function App() {
  const { route, go } = useHashRoute();
  const app = useBoothApp(go);
  const { db, admin, toast, login, register, logout } = app;

  // 모든 페이지가 공유하는 값과 관리자 전용 작업을 구분해 전달합니다.
  const publicProps = {
    db,
    go,
    notify: app.notify,
    verifiedIds: app.verifiedIds,
    lookupTicket: app.lookupTicket,
    createOrder: app.createOrder,
  };
  const adminProps = {
    ...publicProps,
    admin,
    issueTicket: app.issueTicket,
    confirmTicket: app.confirmTicket,
    setOrderStatus: app.setOrderStatus,
    updateBooth: app.updateBooth,
    upsertProduct: app.upsertProduct,
    removeProduct: app.removeProduct,
    resetDemo: app.resetDemo,
  };

  return (
    <div className="app-shell">
      <AppHeader route={route} go={go} admin={admin} logout={logout} />

      <main id="main-content">
        {renderPage(route, publicProps, adminProps, login, register)}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand"><Store size={18} /> 부스메이트</span>
          <span>행사 현장을 더 가볍게, 즐겁게.</span>
          <span className="footer-note">React 프론트엔드 시연용 · 데이터는 이 브라우저에만 저장됩니다.</span>
        </div>
      </footer>

      <MobileBottomNav route={route} go={go} admin={admin} />

      {toast && (
        <div role="status" className={`toast toast-${toast.type}`} key={toast.seq}>
          {toast.type === 'error' ? '⚠️' : '✓'} {toast.message}
        </div>
      )}
    </div>
  );
}

function NotFound({ go }) {
  return (
    <div className="container not-found">
      <div className="not-found-icon">🧭</div>
      <h1>페이지를 찾을 수 없어요</h1>
      <p>주소를 다시 확인하거나 부스 목록으로 돌아가 주세요.</p>
      <Button onClick={() => go('/')}>
        부스 목록으로 <ArrowRight size={16} />
      </Button>
    </div>
  );
}
