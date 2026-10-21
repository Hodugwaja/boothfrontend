/** 부스 대시보드: 통계 / 빠른 작업 */
import { ArrowRight, Package, ShoppingBag, Ticket, Wallet } from 'lucide-react';
import { money, prettyTime, ticketTypeLabel } from '../../lib/demo.js';
import { EmptyState, Status } from '../../components/UI.jsx';
import { AdminLayout, Metric } from './AdminShared.jsx';
export function AdminBoothPage({ db, booth, go }) {
    const tickets = db.tickets.filter(t => t.boothId === booth.id);
    const orders = db.orders.filter(o => o.boothId === booth.id);
    const pending = tickets.filter(t => t.status === 'issued').length;
    const completed = orders.filter(o => o.status === 'pickedup').length;
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const remaining = booth.products.reduce((s, p) => s + p.stock, 0);
    return <AdminLayout booth={booth} go={go} active="overview" eyebrow="BOOTH OVERVIEW" title="부스 대시보드" description="운영 현황을 한눈에 확인하고 바로 관리해 보세요." actions={<Status booth={booth}/>}>
      <div className="metrics-grid">
        <Metric icon={Ticket} label="대기 중 번호표" value={pending} unit="명" note={`전체 ${tickets.length}건 발급`} tone="purple"/>
        <Metric icon={ShoppingBag} label="사전 주문" value={orders.length} unit="건" note={`수령 완료 ${completed}건`} tone="blue"/>
        <Metric icon={Wallet} label="총 주문 금액" value={revenue.toLocaleString()} unit="원" note="실제 결제 금액 아님" tone="green"/>
        <Metric icon={Package} label="남은 굿즈" value={remaining} unit="개" note={`등록 상품 ${booth.products.length}종`} tone="orange"/>
      </div>
      <div className="admin-quick-grid">
        <button onClick={() => go(`/admin/${booth.id}/people`)} className="quick-action">
          <div className="quick-icon purple">
            <Ticket size={25}/>
          </div>
          <div>
            <span className="eyebrow">PEOPLE MANAGEMENT</span>
            <h3>번호표 · 인원 관리</h3>
            <p>번호표 발급과 방문 인증을 한 곳에서</p>
          </div>
          <ArrowRight size={20}/>
        </button>
        <button onClick={() => go(`/admin/${booth.id}/sales`)} className="quick-action">
          <div className="quick-icon blue">
            <ShoppingBag size={25}/>
          </div>
          <div>
            <span className="eyebrow">SALES MANAGEMENT</span>
            <h3>주문 · 판매 관리</h3>
            <p>사전 주문 현황과 재고 확인</p>
          </div>
          <ArrowRight size={20}/>
        </button>
      </div>
      <div className="admin-lower-grid">
        <section className="surface-card">
          <div className="card-section-heading">
            <div>
              <span className="eyebrow">LATEST TICKETS</span>
              <h2>최근 발급 번호표</h2>
            </div>
              <button className="text-link" onClick={() => go(`/admin/${booth.id}/people`)}>전체 보기 <ArrowRight size={15}/>
            </button>
            </div>{tickets.length ? <div className="compact-list">{tickets.slice(0, 4).map(t => <div key={t.id} className="compact-row">
              <span className="compact-round">#{t.number}</span>
              <div>
                <strong>{t.name}</strong>
                <small>{ticketTypeLabel[t.type]} · {prettyTime(t.createdAt)}</small>
              </div>
              <span className={`mini-status ${t.status === 'verified' ? 'done' : ''}`}>{t.status === 'verified' ? '확인 완료' : '대기 중'}</span>
        </div>)}</div> : <EmptyState icon={Ticket} title="발급된 번호표가 없어요" description="인원 관리에서 새 번호표를 발급해 보세요."/>}</section>
        <section className="surface-card">
          <div className="card-section-heading">
            <div>
              <span className="eyebrow">STOCK SUMMARY</span>
              <h2>굿즈 재고 현황</h2>
            </div>
              <button className="text-link" onClick={() => go(`/admin/${booth.id}/settings`)}>상품 관리 <ArrowRight size={15}/>
            </button>
          </div>
            <div className="compact-list">{booth.products.slice(0, 4).map(p => <div className="compact-row" key={p.id}>
              <span className="compact-round">{p.emoji}</span>
              <div>
                <strong>{p.name}</strong>
                <small>{money(p.price)}</small>
              </div>
              <span className={`mini-status ${p.stock < 6 ? 'warning' : ''}`}>{p.stock}개 남음</span>
          </div>)}</div>
        </section>
      </div>
    </AdminLayout>;
}