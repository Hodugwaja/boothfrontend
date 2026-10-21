/** 관리자 부스 선택 화면 */
import { ArrowRight, MapPin, Store } from 'lucide-react';
import { BoothArtwork, EmptyState, Status } from '../../components/UI.jsx';
export function AdminHomePage({ db, admin, go }) {
    const mine = db.booths.filter(b => admin.boothIds.includes(b.id));
    return <div className="container page-content admin-home">
      <div className="admin-hello">
        <span className="eyebrow">MY WORKSPACE</span>
        <div className="admin-hello-line">
          <div>
              <h1>안녕하세요, {admin.name}님! <span>👋</span>
            </h1>
            <p>오늘도 즐거운 부스 운영을 시작해 볼까요?</p>
          </div>
          <span className="workspace-label">
          <Store size={16}/> 운영자 워크스페이스</span>
        </div>
      </div>
      <div className="my-booths-heading">
        <div>
          <h2>내가 속한 부스</h2>
          <p>운영할 부스를 선택해 주세요.</p>
        </div>
        <span>{mine.length}개 부스</span>
      </div>
    {mine.length ? <div className="admin-booth-grid">{mine.map(b => {
                const t = db.tickets.filter(t => t.boothId === b.id), o = db.orders.filter(o => o.boothId === b.id);
                return <button className="admin-booth-card" key={b.id} onClick={() => go(`/admin/${b.id}`)}>
          <div className="admin-booth-art">
            <BoothArtwork booth={b}/>
          </div>
          <div className="admin-booth-card-body">
            <div className="admin-booth-top">
              <Status booth={b}/>
              <ArrowRight size={20}/>
            </div>
            <h3>{b.name}</h3>
            <p>
            <MapPin size={14}/>{b.hall} · {b.boothNumber}</p>
            <div className="admin-booth-numbers">
              <span>
                <strong>{t.length}</strong>
                <small>번호표</small>
              </span>
              <span>
                <strong>{o.length}</strong>
                <small>사전 주문</small>
              </span>
              <span>
                <strong>{b.products.length}</strong>
                <small>판매 굿즈</small>
              </span>
            </div>
              <div className="admin-booth-open">이 부스 관리하기 <ArrowRight size={16}/>
            </div>
          </div>
        </button>;
            })}</div> : <EmptyState icon={Store} title="소속된 부스가 없어요" description="데모 회원가입 시 부스를 선택하면 운영자 워크스페이스에 표시됩니다."/>}
      <div className="admin-tip">
        <div>✨</div>
        <p>
        <strong>데모를 처음 사용하시나요?</strong> 달빛상점 또는 픽셀가든을 선택하고 번호표 발급, 주문 관리, 맞춤 설정을 체험해 보세요.</p>
      </div>
    </div>;
}