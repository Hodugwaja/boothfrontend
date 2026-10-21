/** 커스터마이징: 부스 소개 / 시작 번호 / 굿즈 관리 */
import { useState } from 'react';
import { Check, Edit3, Plus, RefreshCw, Store, Ticket, Trash2 } from 'lucide-react';
import { Button, FormField, Modal, Notice, ProductCard } from '../../components/UI.jsx';
import { AdminLayout, ProductEditor } from './AdminShared.jsx';
export function SettingsPage({ booth, go, updateBooth, upsertProduct, removeProduct, resetDemo }) {
    const [name, setName] = useState(booth.name);
    const [tagline, setTagline] = useState(booth.tagline);
    const [description, setDescription] = useState(booth.description);
    const [hall, setHall] = useState(booth.hall);
    const [boothNumber, setBoothNumber] = useState(booth.boothNumber);
    const [startDate, setStartDate] = useState(booth.startDate);
    const [endDate, setEndDate] = useState(booth.endDate);
    const [openTime, setOpenTime] = useState(booth.openTime);
    const [closeTime, setCloseTime] = useState(booth.closeTime);
    const [onsite, setOnsite] = useState(String(booth.startNumbers.onsite));
    const [recall, setRecall] = useState(String(booth.startNumbers.recall));
    const [productModal, setProductModal] = useState(null);
    const [confirmReset, setConfirmReset] = useState(false);
    const saveInfo = e => {
        e.preventDefault();
        if (endDate < startDate)
            return;
        updateBooth(booth.id, { name: name.trim(), tagline: tagline.trim(), description: description.trim(), hall: hall.trim(), boothNumber: boothNumber.trim(), startDate, endDate, openTime, closeTime });
    };
    const saveNumbers = e => { e.preventDefault(); updateBooth(booth.id, { startNumbers: { onsite: Number(onsite), recall: Number(recall) } }); };
    return <AdminLayout booth={booth} go={go} active="settings" eyebrow="CUSTOMIZATION" title="부스 설정" description="운영 시간, 시작 번호, 판매 상품을 우리 부스에 맞게 변경해요.">
      <div className="settings-section surface-card">
        <div className="card-section-heading">
          <div>
            <span className="eyebrow">BOOTH PROFILE</span>
            <h2>부스 기본 정보</h2>
            <p>방문객 페이지에 표시되는 내용을 관리해요.</p>
          </div>
          <Store size={24} className="subtle-icon"/>
        </div>
        <form onSubmit={saveInfo}>
          <div className="form-row cols-2">
            <FormField label="부스 이름">
              <input required value={name} onChange={e => setName(e.target.value)}/>
            </FormField>
            <FormField label="한 줄 소개">
              <input required value={tagline} onChange={e => setTagline(e.target.value)}/>
            </FormField>
          </div>
          <FormField label="상세 소개">
            <textarea required rows="4" value={description} onChange={e => setDescription(e.target.value)}/>
          </FormField>
          <div className="form-row cols-2">
            <FormField label="행사 위치">
              <input required value={hall} onChange={e => setHall(e.target.value)}/>
            </FormField>
            <FormField label="부스 번호">
              <input required value={boothNumber} onChange={e => setBoothNumber(e.target.value)}/>
            </FormField>
          </div>
          <div className="form-row cols-2">
            <FormField label="운영 시작일">
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}/>
            </FormField>
            <FormField label="운영 종료일">
              <input type="date" required min={startDate} value={endDate} onChange={e => setEndDate(e.target.value)}/>
            </FormField>
          </div>
          <div className="form-row cols-2">
            <FormField label="운영 시작 시간">
              <input type="time" required value={openTime} onChange={e => setOpenTime(e.target.value)}/>
            </FormField>
            <FormField label="운영 종료 시간">
              <input type="time" required value={closeTime} onChange={e => setCloseTime(e.target.value)}/>
            </FormField>
          </div>
          <div className="settings-form-footer">
              <Button type="submit">기본 정보 저장 <Check size={16}/>
            </Button>
          </div>
        </form>
      </div>
      <div className="settings-section surface-card">
        <div className="card-section-heading">
          <div>
            <span className="eyebrow">TICKET NUMBERING</span>
            <h2>번호표 시작 번호</h2>
            <p>현장대기와 추후소집은 번호 체계를 각각 설정할 수 있어요.</p>
          </div>
          <Ticket size={24} className="subtle-icon"/>
        </div>
        <form onSubmit={saveNumbers}>
          <div className="form-row cols-2">
            <FormField label="현장대기 시작 번호">
              <input type="number" min="1" required value={onsite} onChange={e => setOnsite(e.target.value)}/>
            </FormField>
            <FormField label="추후소집 시작 번호">
              <input type="number" min="1" required value={recall} onChange={e => setRecall(e.target.value)}/>
            </FormField>
          </div>
          <Notice>이미 발급된 번호표는 변경되지 않으며, 다음 발급 번호는 설정한 시작 번호와 기존 최댓값 중 큰 값을 기준으로 계산됩니다.</Notice>
          <div className="settings-form-footer">
              <Button type="submit">시작 번호 저장 <Check size={16}/>
            </Button>
          </div>
        </form>
      </div>
      <div className="settings-section surface-card">
        <div className="card-section-heading">
          <div>
            <span className="eyebrow">PRODUCT CATALOG</span>
              <h2>판매 상품 관리 <span className="count-pill">{booth.products.length}</span>
            </h2>
            <p>상품명, 판매 가격, 남은 수량을 등록·수정할 수 있어요.</p>
          </div>
          <Button size="sm" onClick={() => setProductModal({ id: '', name: '', detail: '', price: '', stock: '', emoji: '🎁' })}>
          <Plus size={16}/> 상품 추가</Button>
        </div>
          <div className="product-list">{booth.products.map(p => <ProductCard key={p.id} product={p}>
            <div className="product-management-actions">
              <button title="상품 수정" aria-label={`${p.name} 수정`} onClick={() => setProductModal({ ...p })}>
                <Edit3 size={16}/>
              </button>
              <button title="상품 삭제" aria-label={`${p.name} 삭제`} onClick={() => {
                if (window.confirm(`${p.name} 상품을 삭제할까요? 과거 주문내역은 유지됩니다.`))
                    removeProduct(booth.id, p.id);
            }}>
                <Trash2 size={16}/>
              </button>
            </div>
        </ProductCard>)}</div>
      </div>
      <div className="settings-section surface-card danger-zone">
        <div>
          <span className="eyebrow">DEMO OPTIONS</span>
          <h2>데모 데이터 초기화</h2>
          <p>체험 중 변경된 부스, 번호표, 주문 데이터를 처음 상태로 되돌립니다.</p>
        </div>
        <Button variant="outline-danger" onClick={() => setConfirmReset(true)}>
        <RefreshCw size={16}/> 전체 초기화</Button>
      </div>
    {productModal && <ProductEditor booth={booth} product={productModal} onClose={() => setProductModal(null)} onSave={p => { upsertProduct(booth.id, p); setProductModal(null); }}/>}
    {confirmReset && <Modal title="데모 데이터를 초기화할까요?" description="현재 브라우저의 모든 데모 주문, 번호표, 설정, 계정이 초기화됩니다." onClose={() => setConfirmReset(false)}>
        <div className="inline-buttons modal-confirm-actions">
          <Button variant="outline" onClick={() => setConfirmReset(false)}>취소</Button>
          <Button variant="danger" onClick={() => { setConfirmReset(false); resetDemo(); }}>초기화하기</Button>
        </div>
      </Modal>}
    </AdminLayout>;
}