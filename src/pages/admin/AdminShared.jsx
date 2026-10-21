/** 관리자 페이지에서 함께 사용하는 레이아웃 및 폼 */
import { useState } from 'react';
import { ArrowRight, Check, ChevronRight, LayoutDashboard, Settings, ShoppingBag, Ticket } from 'lucide-react';
import { BreadCrumb, Button, FormField, Modal } from '../../components/UI.jsx';
export function AdminLayout({ booth, go, active, eyebrow, title, description, actions, children }) {
    const base = `/admin/${booth.id}`;
    const links = [{ id: 'overview', label: '대시보드', icon: LayoutDashboard, path: base }, { id: 'people', label: '인원·번호표 관리', icon: Ticket, path: `${base}/people` }, { id: 'sales', label: '판매·주문 관리', icon: ShoppingBag, path: `${base}/sales` }, { id: 'settings', label: '부스 설정', icon: Settings, path: `${base}/settings` }];
    return <div className="container admin-page">
      <BreadCrumb items={[{ text: '내 부스', action: () => go('/admin') }, { text: booth.name, action: () => go(base) }, { text: links.find(l => l.id === active)?.label || '관리' }]}/>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="sidebar-booth">
            <div className={`sidebar-booth-emoji tone-${booth.tone}`}>{booth.emoji}</div>
            <div>
              <span>현재 관리 중</span>
              <strong>{booth.name}</strong>
              <small>{booth.boothNumber}</small>
            </div>
          </div>
            <nav aria-label="부스 관리자 메뉴">{links.map(l => <button key={l.id} className={active === l.id ? 'selected' : ''} onClick={() => go(l.path)}>
              <l.icon size={18}/>
          <span>{l.label}</span>{active === l.id && <ChevronRight size={16} className="sidebar-chevron"/>}</button>)}</nav>
            <button className="sidebar-public-link" onClick={() => go(`/booth/${booth.id}`)}>방문객 페이지 보기 <ArrowRight size={15}/>
          </button>
        </aside>
        <div className="admin-main">
          <div className="admin-page-heading">
            <div>
              <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="admin-page-actions">{actions}</div>}</div>{children}</div>
      </div>
    </div>;
}
export function Metric({ icon: Icon, label, value, unit, note, tone }) {
    return <div className="metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon size={21}/>
      </div>
      <p>{label}</p>
      <div className="metric-value">
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
      <small>{note}</small>
    </div>;
}
export function ProductEditor({ product, onClose, onSave }) {
    const [form, setForm] = useState({ ...product });
    const change = (key, value) => setForm(f => ({ ...f, [key]: value }));
    const submit = e => {
        e.preventDefault();
        if (Number(form.price) < 0 || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
            return;
        onSave({ ...form, name: form.name.trim(), detail: form.detail.trim(), emoji: form.emoji.trim() || '🎁' });
    };
    return <Modal title={product.id ? '판매 상품 수정' : '새 판매 상품 추가'} description="변경 사항은 방문객 페이지의 상품 정보에 바로 반영됩니다." onClose={onClose}>
      <form className="product-editor" onSubmit={submit}>
        <div className="form-row emoji-product-row">
          <FormField label="대표 이모지">
            <input required value={form.emoji} maxLength={6} onChange={e => change('emoji', e.target.value)} placeholder="🎁"/>
          </FormField>
          <FormField label="상품명">
            <input required value={form.name} onChange={e => change('name', e.target.value)} placeholder="예: 아크릴 키링"/>
          </FormField>
        </div>
        <FormField label="상품 설명">
          <input value={form.detail} onChange={e => change('detail', e.target.value)} placeholder="크기, 구성 등을 입력하세요"/>
        </FormField>
        <div className="form-row cols-2">
          <FormField label="판매 가격 (원)">
            <input required type="number" min="0" step="100" value={form.price} onChange={e => change('price', e.target.value)}/>
          </FormField>
          <FormField label="남은 재고 (개)">
            <input required type="number" min="0" step="1" value={form.stock} onChange={e => change('stock', e.target.value)}/>
          </FormField>
        </div>
        <div className="modal-form-footer">
          <Button variant="outline" onClick={onClose} type="button">취소</Button>
            <Button type="submit">저장하기 <Check size={16}/>
          </Button>
        </div>
      </form>
    </Modal>;
}