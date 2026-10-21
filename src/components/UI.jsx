import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Package,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react';
import { boothStatus, money, prettyDate, statusLabel } from '../lib/demo.js';

/**
 * 여러 페이지에서 공통으로 쓰는 작은 UI 컴포넌트들입니다.
 * 화면별 기능은 pages/ 폴더, 색상/여백은 styles.css에서 수정하세요.
 */
export function Button({ children, variant = 'primary', size = '', className = '', ...props }) {
  const classes = ['btn', `btn-${variant}`, size && `btn-${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function Status({ booth }) {
  const status = boothStatus(booth);

  return (
    <span className={`status-chip status-${status}`}>
      <span className="chip-dot" />
      {statusLabel[status]}
    </span>
  );
}

export function BoothArtwork({ booth, large = false }) {
  return (
    <div className={`booth-art tone-${booth.tone} ${large ? 'booth-art-large' : ''}`}>
      <div className="art-halo art-halo-1" />
      <div className="art-halo art-halo-2" />
      <span className="art-spark spark-1">✦</span>
      <span className="art-spark spark-2">✧</span>
      <span className="art-emoji">{booth.emoji}</span>
      <span className="art-caption">CREATOR MARKET · {booth.boothNumber}</span>
    </div>
  );
}

export function BoothCard({ booth, onOpen }) {
  const remain = booth.products.reduce((sum, product) => sum + product.stock, 0);

  return (
    <button className="booth-card" onClick={onOpen} aria-label={`${booth.name} 상세 보기`}>
      <div className="card-art-wrap">
        <BoothArtwork booth={booth} />
        <span className="card-status"><Status booth={booth} /></span>
      </div>

      <div className="booth-card-body">
        <div className="card-category">{booth.category}</div>
        <div className="card-title-row">
          <h3>{booth.name}</h3>
          <ArrowRight size={18} />
        </div>
        <p className="card-tagline">{booth.tagline}</p>
        <div className="card-meta">
          <span><CalendarDays size={14} />{prettyDate(booth.startDate)} ~ {prettyDate(booth.endDate)}</span>
          <span><MapPin size={14} />{booth.boothNumber}</span>
        </div>
        <div className="card-stock">
          <Package size={14} /> 굿즈 재고 <strong>{remain}개</strong> 남음
        </div>
      </div>
    </button>
  );
}

export function ProductCard({ product, children }) {
  const stockClass = product.stock === 0 ? 'sold-out' : product.stock <= 5 ? 'low-stock' : '';

  return (
    <div className="product-card">
      <div className="product-emoji">{product.emoji || '🎁'}</div>
      <div className="product-text">
        <strong>{product.name}</strong>
        <span>{product.detail || '굿즈 상품'}</span>
        <div className="product-price">{money(product.price)}</div>
      </div>
      <div className="product-side">
        <span className={`stock-count ${stockClass}`}>
          {product.stock === 0 ? '품절' : `잔여 ${product.stock}개`}
        </span>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon = Ticket, title, description, children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={29} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="page-heading-action">{children}</div>}
    </div>
  );
}

export function Modal({ title, description, onClose, children, width = 'regular' }) {
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropClick} role="presentation">
      <section className={`modal modal-${width}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-top">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button className="icon-button" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function FormField({ label, children, hint }) {
  return (
    <label className="form-field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function TicketTypeLabel({ type }) {
  return (
    <span className={`type-label type-${type}`}>
      {type === 'onsite' ? '현장대기' : '추후소집'}
    </span>
  );
}

export function Notice({ type = 'info', children }) {
  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Sparkles;
  return (
    <div className={`notice notice-${type}`}>
      <Icon size={18} />
      <div>{children}</div>
    </div>
  );
}

export function BreadCrumb({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={`${item.text}-${index}`}>
          {index > 0 && <ChevronRight size={14} />}
          {item.action ? (
            <button onClick={item.action}>{item.text}</button>
          ) : (
            <span>{item.text}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
