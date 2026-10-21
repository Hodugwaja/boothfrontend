/** 방문객 메인: 부스 검색 / 운영 기간 필터 / 부스 목록 */
import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Search, ShoppingBag, Sparkles, Ticket, X } from 'lucide-react';
import { boothStatus } from '../../lib/demo.js';
import { BoothCard, Button, EmptyState } from '../../components/UI.jsx';
export function HomePage({ db, go }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const booths = useMemo(() => db.booths.filter(b => {
        const q = search.trim().toLowerCase();
        const matches = !q || [b.name, b.category, b.tagline, b.description, b.boothNumber, ...b.tags].some(s => String(s).toLowerCase().includes(q));
        const period = status === 'all' || boothStatus(b) === status;
        const range = (!dateFrom || b.endDate >= dateFrom) && (!dateTo || b.startDate <= dateTo);
        return matches && period && range;
    }), [db.booths, search, status, dateFrom, dateTo]);
    const ongoing = db.booths.filter(b => boothStatus(b) === 'ongoing').length;
    const totalGoods = db.booths.reduce((s, b) => s + b.products.length, 0);
    return <>
      <section className="hero-section">
        <div className="container hero-layout">
          <div className="hero-copy">
              <h1>찾고, 기다리고,<br />
            <em>미리 준비하는</em> 부스 생활.</h1>
            <p>관심 있는 부스를 찾아 굿즈 재고를 확인하고,<br className="desktop-break"/> 번호표 조회부터 사전 주문까지 한 곳에서.</p>
            <div className="hero-buttons">
                <Button onClick={() => document.getElementById('booth-list')?.scrollIntoView({ behavior: 'smooth' })}>부스 둘러보기 <ArrowRight size={18}/>
              </Button>
                <Button variant="outline-light" onClick={() => go('/orders')}>내 주문 확인 <ShoppingBag size={17}/>
              </Button>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{db.booths.length.toString().padStart(2, '0')}</strong>
                <span>전체 부스</span>
              </div>
              <i />
              <div>
                <strong>{ongoing.toString().padStart(2, '0')}</strong>
                <span>현재 운영 중</span>
              </div>
              <i />
              <div>
                <strong>{totalGoods.toString().padStart(2, '0')}</strong>
                <span>등록된 굿즈</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container discovery-section" id="booth-list">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DISCOVER BOOTHS</span>
              <h2>마음에 드는 부스를 찾아보세요 <span className="heading-spark">✳</span>
            </h2>
            <p>오늘의 행사부터 곧 만날 크리에이터까지</p>
          </div>
          <div className="section-count">총 <strong>{booths.length}</strong>개 부스</div>
        </div>
        <div className="filter-panel">
          <div className="search-box">
            <Search size={20}/>
            <input aria-label="부스 검색" value={search} onChange={e => setSearch(e.target.value)} placeholder="부스 이름, 카테고리, 굿즈 검색"/>{search && <button aria-label="검색어 지우기" onClick={() => setSearch('')}>
              <X size={17}/>
          </button>}</div>
          <div className="filter-bottom">
            <div className="filter-chips">{[['all', '전체'], ['ongoing', '운영 중'], ['upcoming', '오픈 예정'], ['ended', '운영 종료']].map(([value, label]) => <button key={value} className={`filter-chip ${status === value ? 'selected' : ''}`} onClick={() => setStatus(value)}>{label}</button>)}</div>
            <div className="date-filters">
              <CalendarDays size={17}/>
              <span>운영 기간</span>
              <input type="date" aria-label="기간 시작" value={dateFrom} onChange={e => setDateFrom(e.target.value)}/>
              <span>~</span>
            <input type="date" aria-label="기간 종료" value={dateTo} min={dateFrom || undefined} onChange={e => setDateTo(e.target.value)}/>{(dateFrom || dateTo) && <button className="clear-dates" onClick={() => { setDateFrom(''); setDateTo(''); }}>초기화</button>}</div>
          </div>
        </div>
      {booths.length > 0 ? <div className="booth-grid">{booths.map(b => <BoothCard key={b.id} booth={b} onOpen={() => go(`/booth/${b.id}`)}/>)}</div> : <EmptyState icon={Search} title="검색 결과가 없어요" description="다른 검색어나 운영 기간으로 다시 찾아보세요.">
          <Button variant="outline" onClick={() => { setSearch(''); setStatus('all'); setDateFrom(''); setDateTo(''); }}>필터 초기화</Button>
        </EmptyState>}
      </section>
      <section className="container intro-banner">
        <div className="intro-badge">
          <Sparkles size={23}/>
        </div>
        <div>
          <h3>부스 운영자이신가요?</h3>
          <p>번호표 발급부터 상품 재고와 사전 주문 관리까지, 복잡한 현장을 더 간편하게 운영해 보세요.</p>
        </div>
          <Button variant="white" onClick={() => go('/auth')}>운영자 페이지 <ArrowRight size={16}/>
        </Button>
      </section>
    </>;
}