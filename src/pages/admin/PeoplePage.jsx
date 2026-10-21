/** 인원 관리: 번호표 발급 / 인증 */
import { useState } from 'react';
import { CheckCircle2, Clock3, Plus, Search, Ticket, UserCheck } from 'lucide-react';
import { prettyTime, ticketTypeLabel } from '../../lib/demo.js';
import { Button, EmptyState, FormField, Modal } from '../../components/UI.jsx';
import { AdminLayout } from './AdminShared.jsx';
export function PeoplePage({ db, booth, go, issueTicket, confirmTicket }) {
    const [type, setType] = useState('onsite');
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');
    const [issued, setIssued] = useState(null);
    const [form, setForm] = useState({ number: '', name: '', code: '' });
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const tickets = db.tickets.filter(t => t.boothId === booth.id);
    const typed = tickets.filter(t => t.type === type);
    const shown = typed.filter(t => (filter === 'all' || t.status === filter) && (!search || t.name.includes(search) || String(t.number).includes(search)));
    const pending = typed.filter(t => t.status === 'issued').length;
    const verified = typed.filter(t => t.status === 'verified').length;
    const submitIssue = e => {
        e.preventDefault();
        const t = issueTicket(booth.id, type, name);
        if (t) {
            setIssued(t);
            setName('');
        }
    };
    const submitCheck = e => {
        e.preventDefault();
        if (confirmTicket(booth.id, type, form))
            setForm({ number: '', name: '', code: '' });
    };
    return <AdminLayout booth={booth} go={go} active="people" eyebrow="TICKET & QUEUE" title="인원 · 번호표 관리" description="현장대기와 추후소집 번호표를 발급하고 확인해요." actions={<Button onClick={() => { setModal(true); setIssued(null); }}>
      <Plus size={17}/> 번호표 발급</Button>}>
      <div className="segment-tabs">
        <button className={type === 'onsite' ? 'active' : ''} onClick={() => setType('onsite')}>
          <Ticket size={17}/> 현장대기 <span>{tickets.filter(t => t.type === 'onsite').length}</span>
        </button>
        <button className={type === 'recall' ? 'active' : ''} onClick={() => setType('recall')}>
          <Clock3 size={17}/> 추후소집 <span>{tickets.filter(t => t.type === 'recall').length}</span>
        </button>
      </div>
      <div className="people-stats">
        <div>
          <span>발급된 번호표</span>
            <strong>{typed.length} <small>건</small>
          </strong>
        </div>
        <div>
          <span>확인 대기</span>
            <strong>{pending} <small>명</small>
          </strong>
        </div>
        <div>
          <span>방문 확인 완료</span>
            <strong>{verified} <small>명</small>
          </strong>
        </div>
        <div>
          <span>설정된 시작 번호</span>
            <strong>{booth.startNumbers[type]} <small>번</small>
          </strong>
        </div>
      </div>
      <div className="surface-card check-panel">
        <div className="card-section-heading">
          <div>
            <span className="eyebrow">VERIFY TICKET</span>
            <h2>번호표 확인 · 인증</h2>
            <p>방문객이 제출한 번호·이름·인증코드를 확인 처리합니다.</p>
          </div>
          <UserCheck size={26} className="subtle-icon"/>
        </div>
        <form onSubmit={submitCheck}>
          <div className="form-row cols-3">
            <FormField label="번호표 번호">
              <input required type="number" min="1" placeholder="번호" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })}/>
            </FormField>
            <FormField label="방문객 이름">
              <input required placeholder="이름" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
            </FormField>
            <FormField label="인증 코드">
              <input required placeholder="영문+숫자" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}/>
            </FormField>
          </div>
          <Button type="submit">
          <CheckCircle2 size={17}/> 방문 확인 처리</Button>
        </form>
      </div>
      <section className="surface-card tickets-panel">
        <div className="card-section-heading">
          <div>
            <span className="eyebrow">TICKET LIST</span>
              <h2>{ticketTypeLabel[type]} 명단 <span className="count-pill">{typed.length}</span>
            </h2>
          </div>
          <div className="tickets-list-filter">
            <div className="small-search">
              <Search size={17}/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름·번호 검색" aria-label="명단 검색"/>
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="인증 상태 필터">
              <option value="all">전체 상태</option>
              <option value="issued">확인 대기</option>
              <option value="verified">확인 완료</option>
            </select>
          </div>
        </div>
      {shown.length ? <div className="table-scroller">
          <table className="data-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>방문객</th>
                <th>인증코드</th>
                <th>발급 일시</th>
                <th>상태</th>
              </tr>
            </thead>
              <tbody>{shown.map(t => <tr key={t.id}>
                <td>
                  <strong className="ticket-number">#{t.number}</strong>
                </td>
                <td>
                  <strong>{t.name}</strong>
                </td>
                <td>
                  <span className="mono-code">{t.code}</span>
                </td>
                <td>{prettyTime(t.createdAt)}</td>
                <td>
                  <span className={`mini-status ${t.status === 'verified' ? 'done' : ''}`}>{t.status === 'verified' ? '확인 완료' : '확인 대기'}</span>
                </td>
            </tr>)}</tbody>
          </table>
        </div> : <EmptyState icon={Ticket} title="해당 번호표가 없어요" description="번호표를 발급하거나 검색 조건을 변경해 보세요."/>}
      </section>
    {modal && <Modal title={issued ? '번호표 발급 완료' : '새 번호표 발급'} description={issued ? '아래의 번호와 인증코드를 방문객에게 전달해 주세요.' : `${ticketTypeLabel[type]} 번호표를 발급합니다.`} onClose={() => { setModal(false); setIssued(null); }}>
      {issued ? <div className="issued-result">
          <div className="issued-ticket">
            <div className="issued-ticket-top">
              <span>BOOTHMATE TICKET</span>
              <Ticket size={21}/>
            </div>
            <span className="issued-type">{ticketTypeLabel[issued.type]}</span>
              <strong className="issued-number">{issued.number}<small>번</small>
            </strong>
            <p>{issued.name}님</p>
            <div className="issued-code-box">
              <small>인증 코드</small>
              <strong>{issued.code}</strong>
            </div>
            <small className="issued-warning">이 코드를 번호표 소지자에게만 전달하세요.</small>
          </div>
          <div className="inline-buttons">
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(`부스: ${booth.name}\n유형: ${ticketTypeLabel[issued.type]}\n번호: ${issued.number}\n이름: ${issued.name}\n코드: ${issued.code}`)}>번호표 내용 복사</Button>
              <Button onClick={() => { setIssued(null); setName(''); }}>다음 번호표 발급 <Plus size={16}/>
            </Button>
          </div>
        </div>
                : <form className="issue-form" onSubmit={submitIssue}>
          <div className="issue-type-preview">
            <span>{type === 'onsite' ? '🎟️' : '🔔'}</span>
            <div>
              <strong>{ticketTypeLabel[type]}</strong>
              <small>다음 발급 번호는 기존 발급 내역과 시작 번호를 기준으로 자동 계산됩니다.</small>
            </div>
          </div>
          <FormField label="방문객 이름">
            <input autoFocus required maxLength={30} placeholder="방문객 이름을 입력하세요" value={name} onChange={e => setName(e.target.value)}/>
          </FormField>
          <Button type="submit" className="full-width">
          <Plus size={18}/> 번호표 발급하기</Button>
        </form>}
      </Modal>}
    </AdminLayout>;
}