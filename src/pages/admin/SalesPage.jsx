/** 판매 관리: 주문 현황 / 주문 상태 변경 */
import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Clock3, Package, ShoppingBag, Wallet } from 'lucide-react';
import { money, orderStatusLabel, prettyTime } from '../../lib/demo.js';
import { Button, EmptyState, ProductCard } from '../../components/UI.jsx';
import { AdminLayout, Metric } from './AdminShared.jsx';
export function SalesPage({ db, booth, go, setOrderStatus }) {
    const [tab, setTab] = useState('orders');
    const [filter, setFilter] = useState('all');
    const orders = db.orders.filter(o => o.boothId === booth.id);
    const shown = orders.filter(o => filter === 'all' || o.status === filter);
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const pending = orders.filter(o => o.status !== 'pickedup').length;
    const lowStock = booth.products.filter(p => p.stock <= 5).length;
    return <AdminLayout booth={booth} go={go} active="sales" eyebrow="ORDERS & INVENTORY" title="판매 · 주문 관리" description="사전 주문의 준비 상태와 상품 재고를 관리해요.">
      <div className="metrics-grid sales-metrics">
        <Metric icon={ShoppingBag} label="전체 주문" value={orders.length} unit="건" note="사전 주문 접수" tone="purple"/>
        <Metric icon={Clock3} label="미수령 주문" value={pending} unit="건" note="접수 또는 준비 중" tone="blue"/>
        <Metric icon={Wallet} label="총 주문 금액" value={revenue.toLocaleString()} unit="원" note="결제 기능 미포함" tone="green"/>
        <Metric icon={Package} label="재고 부족" value={lowStock} unit="종" note="잔여 5개 이하" tone="orange"/>
      </div>
      <div className="segment-tabs">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
        <ShoppingBag size={17}/> 주문 목록</button>
        <button className={tab === 'stock' ? 'active' : ''} onClick={() => setTab('stock')}>
        <Package size={17}/> 상품 재고</button>
      </div>
    {tab === 'orders' ? <section className="surface-card sales-orders">
        <div className="card-section-heading">
          <div>
            <span className="eyebrow">ORDER MANAGEMENT</span>
              <h2>사전 주문 내역 <span className="count-pill">{orders.length}</span>
            </h2>
            <p>접수 → 준비 중 → 수령 완료 순서로 상태를 변경할 수 있어요.</p>
          </div>
          <select aria-label="주문 상태 필터" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">전체 주문</option>
            <option value="received">접수 완료</option>
            <option value="preparing">준비 중</option>
            <option value="pickedup">수령 완료</option>
          </select>
        </div>
      {shown.length ? <div className="sales-order-list">{shown.map(o => {
                    const t = db.tickets.find(t => t.id === o.ticketId);
                    return <div className="sales-order" key={o.id}>
            <div className="sales-order-head">
              <div>
                <span className="eyebrow">{prettyTime(o.createdAt)}</span>
                  <h3>{t?.name || '방문객'} <small>· {t?.number}번 번호표</small>
                </h3>
              </div>
              <span className={`order-status status-order-${o.status}`}>{orderStatusLabel[o.status]}</span>
            </div>
              <div className="sales-order-products">{o.items.map((p, i) => <div key={`${p.productId}-${i}`}>
                <span>{p.name} × {p.quantity}</span>
                <strong>{money(p.price * p.quantity)}</strong>
            </div>)}</div>
            <div className="sales-order-footer">
                <div>주문 합계 <strong>{money(o.total)}</strong>
              </div>
                  <div className="sales-order-buttons">{o.status === 'received' && <Button size="sm" variant="outline" onClick={() => setOrderStatus(o.id, 'preparing')}>준비 시작 <ArrowRight size={15}/>
                </Button>}{o.status === 'preparing' && <Button size="sm" onClick={() => setOrderStatus(o.id, 'pickedup')}>
                <Check size={15}/> 수령 완료 처리</Button>}{o.status === 'pickedup' && <span className="finished-order">
              <CheckCircle2 size={17}/> 수령 완료</span>}</div>
            </div>
          </div>;
                })}</div> : <EmptyState icon={ShoppingBag} title="표시할 주문이 없어요" description="방문객이 번호표 조회 후 굿즈를 주문하면 이곳에 표시됩니다."/>}</section>
            : <section className="surface-card">
        <div className="card-section-heading">
          <div>
            <span className="eyebrow">INVENTORY</span>
              <h2>상품 재고 현황 <span className="count-pill">{booth.products.length}</span>
            </h2>
            <p>상품 정보 수정이나 추가는 부스 설정에서 할 수 있어요.</p>
          </div>
            <Button variant="outline" size="sm" onClick={() => go(`/admin/${booth.id}/settings`)}>상품 편집 <ArrowRight size={16}/>
          </Button>
        </div>
        <div className="product-list">{booth.products.map(p => <ProductCard key={p.id} product={p}/>)}</div>
      </section>}
    </AdminLayout>;
}