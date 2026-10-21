/** 부스 상세: 번호표 조회 / 사전 주문 / 굿즈 재고 */
import { useState } from 'react';
import { ArrowRight, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, MapPin, Minus, Package, Plus, ShieldCheck, ShoppingBag, Ticket, Users } from 'lucide-react';
import { boothStatus, money, prettyDate, ticketTypeLabel } from '../../lib/demo.js';
import { BoothArtwork, BreadCrumb, Button, EmptyState, FormField, Notice, ProductCard, Status } from '../../components/UI.jsx';
export function BoothDetailPage({ db, booth, go, verifiedIds, lookupTicket, createOrder }) {
    const [lookup, setLookup] = useState({ number: '', name: '', code: '' });
    const [lookupOpen, setLookupOpen] = useState(false);
    const tickets = db.tickets.filter(t => t.boothId === booth.id && verifiedIds.includes(t.id));
    const [chosenTicket, setChosenTicket] = useState('');
    const ticket = tickets.find(t => t.id === chosenTicket) || tickets[0] || null;
    const [quantities, setQuantities] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const ended = boothStatus(booth) === 'ended';
    const total = booth.products.reduce((s, p) => s + p.price * (quantities[p.id] || 0), 0);
    const count = Object.values(quantities).reduce((s, n) => s + n, 0);
    const adjust = (id, delta, stock) => { setQuantities(prev => ({ ...prev, [id]: Math.min(stock, Math.max(0, (prev[id] || 0) + delta)) })); setError(''); };
    const submitOrder = () => {
        const res = createOrder(booth.id, ticket?.id, quantities);
        if (res.error) {
            setError(res.error);
        }
        else {
            setResult(res.order);
            setQuantities({});
            setError('');
        }
    };
    const lookupSubmit = (e) => {
        e.preventDefault();
        const found = lookupTicket(booth.id, lookup);
        if (found) {
            setChosenTicket(found.id);
            setLookupOpen(false);
            setLookup({ number: '', name: '', code: '' });
        }
    };
    return <div className="container page-content">
      <BreadCrumb items={[{ text: '부스 찾기', action: () => go('/') }, { text: booth.name }]}/>
      <div className="booth-detail-header">
        <div className="detail-main-art">
          <BoothArtwork booth={booth} large/>
        </div>
        <div className="booth-detail-intro">
          <div className="booth-detail-pills">
            <Status booth={booth}/>
            <span className="label-pill">{booth.category}</span>
          </div>
          <span className="eyebrow">BOOTH {booth.boothNumber}</span>
          <h1>{booth.name}</h1>
          <p className="detail-tagline">{booth.tagline}</p>
          <p className="detail-description">{booth.description}</p>
          <div className="detail-info-lines">
            <div>
              <CalendarDays size={18}/>
              <span>{prettyDate(booth.startDate)} ~ {prettyDate(booth.endDate)} · {booth.openTime}–{booth.closeTime}</span>
            </div>
            <div>
              <MapPin size={18}/>
              <span>{booth.hall} / {booth.boothNumber}</span>
            </div>
            <div>
              <Users size={18}/>
              <span>참가자 {booth.members.length}명</span>
            </div>
          </div>
          <div className="detail-actions">
            <Button onClick={() => document.getElementById('ticket-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <Ticket size={17}/> 번호표 조회하기</Button>
            <Button variant="outline" onClick={() => go(`/booth/${booth.id}/members`)}>
            <Users size={17}/> 참가자 소개</Button>
          </div>
        </div>
      </div>
      <div className="booth-main-grid">
        <div className="booth-primary-column">
          <section className="surface-card detail-products">
            <div className="card-section-heading">
              <div>
                <span className="eyebrow">MERCHANDISE</span>
                  <h2>판매하는 굿즈 <span className="count-pill">{booth.products.length}</span>
                </h2>
                <p>현재 남은 수량을 실시간 데모 데이터로 표시합니다.</p>
              </div>
              <Package size={24} className="subtle-icon"/>
            </div>
            <div className="product-list">{booth.products.map(p => <ProductCard key={p.id} product={p}/>)}</div>
          </section>
          <section className="surface-card" id="ticket-section">
            <div className="card-section-heading">
              <div>
                <span className="eyebrow">TICKET LOOKUP</span>
                <h2>내 번호표 조회</h2>
                <p>부스에서 받은 번호와 인증코드를 입력하세요.</p>
              </div>
              <Ticket size={25} className="subtle-icon"/>
            </div>
        {tickets.length > 0 ? <div className="lookup-success">
              <CheckCircle2 size={22}/>
              <div>
                <strong>번호표 조회 완료</strong>
                <p>{ticket?.name}님 · {ticketTypeLabel[ticket?.type]} {ticket?.number}번 · 사전 주문 가능</p>
              </div>
            </div> : <Notice>방문객은 부스 운영자에게 번호표를 발급받은 후 이곳에서 조회할 수 있어요.</Notice>}
        {(!tickets.length || lookupOpen) && <form className="lookup-form" onSubmit={lookupSubmit}>
              <div className="form-row cols-3">
                <FormField label="번호표 번호">
                  <input required inputMode="numeric" type="number" min="1" placeholder="예: 101" value={lookup.number} onChange={e => setLookup({ ...lookup, number: e.target.value })}/>
                </FormField>
                <FormField label="이름">
                  <input required placeholder="예: 김하늘" value={lookup.name} onChange={e => setLookup({ ...lookup, name: e.target.value })}/>
                </FormField>
                <FormField label="인증 코드">
                  <input required maxLength="12" placeholder="예: MOON27" value={lookup.code} onChange={e => setLookup({ ...lookup, code: e.target.value })}/>
                </FormField>
              </div>
                <Button type="submit" className="full-width">번호표 조회하고 주문 열기 <ArrowRight size={17}/>
              </Button>
            </form>}
        {tickets.length > 0 && <button className="text-link lookup-another" onClick={() => setLookupOpen(v => !v)}>{lookupOpen ? '다른 번호표 조회 취소' : '+ 다른 번호표 조회하기'}</button>}
        {booth.id === 'moon' && <div className="demo-hint">
            <strong>체험용 번호표</strong> 번호 101 · 이름 김하늘 · 코드 MOON27</div>}
          </section>
          <section className="surface-card" id="order-section">
            <div className="card-section-heading">
              <div>
                <span className="eyebrow">PRE-ORDER</span>
                <h2>굿즈 사전 주문</h2>
                <p>미리 선택하고 현장에서는 빠르게 수령하세요.</p>
              </div>
              <ShoppingBag size={24} className="subtle-icon"/>
            </div>
        {result ? <div className="order-complete">
              <div className="complete-icon">
                <Check size={28}/>
              </div>
              <h3>주문이 접수되었어요!</h3>
              <p>{ticket?.name}님, 운영자의 수령 안내에 따라 부스로 와주세요.</p>
              <div className="complete-order">
                <span>주문 금액</span>
                <strong>{money(result.total)}</strong>
              </div>
              <div className="inline-buttons">
                  <Button onClick={() => go('/orders')}>주문내역 확인 <ArrowRight size={16}/>
                </Button>
                <Button variant="outline" onClick={() => setResult(null)}>추가 주문</Button>
              </div>
            </div>
            : ended ? <EmptyState icon={Clock3} title="부스 운영이 종료되었어요" description="해당 부스는 현재 사전 주문을 받지 않습니다."/>
                : !ticket ? <div className="order-lock">
              <div className="order-lock-icon">
                <ShieldCheck size={31}/>
              </div>
              <h3>번호표를 조회하면 주문할 수 있어요</h3>
              <p>먼저 위의 번호표 조회에서 본인 확인을 진행해 주세요.</p>
                <Button variant="outline" onClick={() => document.getElementById('ticket-section')?.scrollIntoView({ behavior: 'smooth' })}>번호표 조회하러 가기 <ArrowRight size={15}/>
              </Button>
            </div>
                    : <div className="order-form">
              <div className="order-identity">
                <Ticket size={18}/>
              <span>주문 번호표</span>{tickets.length > 1 ? <select value={ticket.id} onChange={e => setChosenTicket(e.target.value)}>{tickets.map(t => <option key={t.id} value={t.id}>{t.name} · {t.number}번</option>)}</select> : <strong>{ticket.name} · {ticket.number}번</strong>}</div>
                <div className="order-item-list">{booth.products.map(p => <div className="order-item" key={p.id}>
                  <div className="product-emoji small">{p.emoji}</div>
                  <div className="order-item-name">
                    <strong>{p.name}</strong>
                    <span>{money(p.price)} · {p.stock === 0 ? '품절' : `재고 ${p.stock}개`}</span>
                  </div>
                  <div className="quantity-control">
                    <button disabled={!(quantities[p.id] > 0)} onClick={() => adjust(p.id, -1, p.stock)} aria-label={`${p.name} 하나 줄이기`}>
                      <Minus size={15}/>
                    </button>
                    <span>{Math.min(quantities[p.id] || 0, p.stock)}</span>
                    <button disabled={p.stock === 0 || quantities[p.id] >= p.stock} onClick={() => adjust(p.id, 1, p.stock)} aria-label={`${p.name} 하나 늘리기`}>
                      <Plus size={15}/>
                    </button>
                  </div>
              </div>)}</div>
              <div className="order-total">
                <span>총 {count}개</span>
                <strong>{money(total)}</strong>
                </div>{error && <p className="inline-error">{error}</p>}<Button className="full-width" disabled={count === 0} onClick={submitOrder}>사전 주문 접수하기 <ArrowRight size={18}/>
              </Button>
              <p className="order-smallprint">데모에서는 주문 즉시 재고가 차감됩니다. 실제 결제는 이루어지지 않습니다.</p>
            </div>}
          </section>
        </div>
        <aside className="booth-side-column">
          <div className="side-panel">
            <div className="side-top-icon">
              <Users size={23}/>
            </div>
            <h3>이 부스를 만든 사람들</h3>
            <p>작품 뒤의 크리에이터를 만나보세요.</p>
              <div className="mini-members">{booth.members.slice(0, 3).map(m => <button key={m.id} onClick={() => go(`/booth/${booth.id}/members/${m.id}`)}>
                <span className="mini-avatar">{m.avatar}</span>
                <span>
                  <strong>{m.name}</strong>
                  <small>{m.role}</small>
                </span>
                <ChevronRight size={17}/>
            </button>)}</div>
              <Button variant="outline" className="full-width" onClick={() => go(`/booth/${booth.id}/members`)}>참가자 전체 보기 <ArrowRight size={15}/>
            </Button>
          </div>
          <div className="side-soft-panel">
            <span>💡 이용 안내</span>
            <h4>이렇게 이용해 보세요</h4>
            <ol>
              <li>운영자에게 번호표 발급받기</li>
              <li>번호·이름·코드로 조회하기</li>
              <li>원하는 굿즈 사전 주문하기</li>
              <li>내 주문내역에서 상태 확인</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>;
}