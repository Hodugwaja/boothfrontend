/** 조회한 번호표의 주문내역 화면 */
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { money, orderStatusLabel, prettyTime } from '../../lib/demo.js';
import { Button, EmptyState, Notice, PageHeading } from '../../components/UI.jsx';
export function OrderHistoryPage({ db, go, verifiedIds }) {
    const myOrders = db.orders.filter(o => verifiedIds.includes(o.ticketId));
    return <div className="container page-content narrow-content">
      <PageHeading eyebrow="MY ORDERS" title="내 주문내역" description="번호표 조회를 완료한 부스의 사전 주문 상태를 확인할 수 있어요."/>
      <Notice>주문내역은 이 브라우저에서 조회한 번호표를 기준으로 표시됩니다. 다른 기기에서는 해당 부스의 번호표를 먼저 조회해 주세요.</Notice>
      <div className="order-history-list">{myOrders.length ? myOrders.map(o => {
            const b = db.booths.find(b => b.id === o.boothId), t = db.tickets.find(t => t.id === o.ticketId);
            return <div key={o.id} className="history-card">
          <div className="history-head">
            <div>
              <span className="eyebrow">{prettyTime(o.createdAt)}</span>
              <h3>{b?.name || '부스'} <span className="tiny-separator">/</span> {t?.number}번</h3>
            </div>
            <span className={`order-status status-order-${o.status}`}>{orderStatusLabel[o.status]}</span>
          </div>
            <div className="history-items">{o.items.map((i, n) => <div key={`${i.productId}-${n}`}>
              <span>{i.name} × {i.quantity}</span>
              <strong>{money(i.price * i.quantity)}</strong>
          </div>)}</div>
          <div className="history-footer">
            <strong>합계 {money(o.total)}</strong>
              <Button variant="outline" size="sm" onClick={() => go(`/booth/${o.boothId}`)}>부스 보기 <ArrowRight size={15}/>
            </Button>
          </div>
        </div>;
        }) : <EmptyState icon={ShoppingBag} title="아직 사전 주문이 없어요" description="부스에서 번호표를 조회하고, 마음에 드는 굿즈를 사전 주문해 보세요.">
            <Button onClick={() => go('/')}>부스 찾아보기 <ArrowRight size={16}/>
          </Button>
      </EmptyState>}</div>
    </div>;
}