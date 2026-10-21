import { useEffect, useState } from 'react';
import {
  ADMIN_KEY,
  DB_KEY,
  VERIFIED_KEY,
  loadDB,
  makeCode,
  makeId,
  readSession,
  seedData,
} from '../lib/demo.js';

/**
 * 부스 데이터와 사용자 액션을 모아 둔 데모용 상태 관리 훅입니다.
 *
 * UI 수정: src/pages/와 src/components/
 * 번호표/주문 처리 수정: 이 파일
 * 샘플 데이터 수정: src/lib/demo.js
 *
 * 실제 운영용 서비스에서는 localStorage 대신 서버 API가 필요합니다.
 */
export function useBoothApp(go) {
  const [db, setDb] = useState(loadDB);
  const [adminId, setAdminId] = useState(() => readSession(ADMIN_KEY, null));
  const [verifiedIds, setVerifiedIds] = useState(() => readSession(VERIFIED_KEY, []));
  const [toast, setToast] = useState(null);

  const admin = db.admins.find((person) => person.id === adminId) ?? null;

  // 새로고침 후에도 데모 데이터를 유지합니다.
  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    sessionStorage.setItem(ADMIN_KEY, JSON.stringify(adminId));
  }, [adminId]);

  useEffect(() => {
    sessionStorage.setItem(VERIFIED_KEY, JSON.stringify(verifiedIds));
  }, [verifiedIds]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3300);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(message, type = 'success') {
    setToast({ message, type, seq: Date.now() });
  }

  // ---------- 방문객: 번호표 조회와 사전 주문 ----------
  function lookupTicket(boothId, form) {
    const ticket = db.tickets.find(
      (item) =>
        item.boothId === boothId &&
        String(item.number) === String(form.number).trim() &&
        item.name.trim() === String(form.name).trim() &&
        item.code.toUpperCase() === String(form.code).trim().toUpperCase(),
    );

    if (!ticket) {
      notify('일치하는 번호표가 없습니다. 정보를 확인해 주세요.', 'error');
      return null;
    }

    setVerifiedIds((previous) =>
      previous.includes(ticket.id) ? previous : [...previous, ticket.id],
    );
    notify('번호표 조회 성공! 이제 사전 주문이 가능합니다.');
    return ticket;
  }

  function createOrder(boothId, ticketId, quantities) {
    const booth = db.booths.find((item) => item.id === boothId);
    const ticket = db.tickets.find(
      (item) => item.id === ticketId && item.boothId === boothId,
    );

    if (!booth || !ticket || !verifiedIds.includes(ticketId)) {
      return { error: '번호표를 조회한 뒤 주문해 주세요.' };
    }
    if (new Date(`${booth.endDate}T23:59:59`) < new Date()) {
      return { error: '운영이 종료된 부스입니다.' };
    }

    const items = booth.products
      .filter((product) => Number(quantities[product.id] || 0) > 0)
      .map((product) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: Number(quantities[product.id]),
      }));

    if (items.length === 0) {
      return { error: '주문할 굿즈를 선택해 주세요.' };
    }

    const hasInvalidItem = items.some((item) => {
      const product = booth.products.find((p) => p.id === item.productId);
      return !Number.isInteger(item.quantity) || item.quantity <= 0 || product.stock < item.quantity;
    });
    if (hasInvalidItem) {
      return { error: '재고가 부족하거나 수량이 올바르지 않습니다.' };
    }

    const order = {
      id: makeId('order'),
      boothId,
      ticketId,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'received',
      createdAt: new Date().toISOString(),
    };

    setDb((previous) => ({
      ...previous,
      booths: previous.booths.map((item) =>
        item.id === boothId
          ? {
              ...item,
              products: item.products.map((product) => ({
                ...product,
                stock: product.stock - Number(quantities[product.id] || 0),
              })),
            }
          : item,
      ),
      orders: [order, ...previous.orders],
    }));

    notify('사전 주문이 접수되었습니다!');
    return { order };
  }

  // ---------- 운영자: 번호표 발급과 방문 확인 ----------
  function issueTicket(boothId, type, name) {
    const booth = db.booths.find((item) => item.id === boothId);
    if (!booth || !name.trim()) return null;

    const issuedNumbers = db.tickets
      .filter((ticket) => ticket.boothId === boothId && ticket.type === type)
      .map((ticket) => ticket.number);
    const number = Math.max((Number(booth.startNumbers[type]) || 1) - 1, ...issuedNumbers) + 1;

    const ticket = {
      id: makeId('ticket'),
      boothId,
      type,
      number,
      name: name.trim(),
      code: makeCode(),
      status: 'issued',
      createdAt: new Date().toISOString(),
      verifiedAt: null,
    };

    setDb((previous) => ({ ...previous, tickets: [ticket, ...previous.tickets] }));
    notify(`${number}번 번호표가 발급되었습니다.`);
    return ticket;
  }

  function confirmTicket(boothId, type, form) {
    const ticket = db.tickets.find(
      (item) =>
        item.boothId === boothId &&
        item.type === type &&
        String(item.number) === String(form.number).trim() &&
        item.name.trim() === String(form.name).trim() &&
        item.code.toUpperCase() === String(form.code).trim().toUpperCase(),
    );

    if (!ticket) {
      notify('번호, 이름, 인증코드가 일치하지 않습니다.', 'error');
      return false;
    }
    if (ticket.status === 'verified') {
      notify('이미 확인 처리된 번호표입니다.', 'error');
      return false;
    }

    setDb((previous) => ({
      ...previous,
      tickets: previous.tickets.map((item) =>
        item.id === ticket.id
          ? { ...item, status: 'verified', verifiedAt: new Date().toISOString() }
          : item,
      ),
    }));
    notify(`${ticket.number}번 방문 확인을 완료했습니다.`);
    return true;
  }

  // ---------- 운영자: 판매 및 부스 정보 관리 ----------
  function setOrderStatus(orderId, status) {
    setDb((previous) => ({
      ...previous,
      orders: previous.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    }));
    notify('주문 상태가 변경되었습니다.');
  }

  function updateBooth(boothId, patch) {
    setDb((previous) => ({
      ...previous,
      booths: previous.booths.map((booth) =>
        booth.id === boothId ? { ...booth, ...patch } : booth,
      ),
    }));
    notify('부스 정보가 저장되었습니다.');
  }

  function upsertProduct(boothId, product) {
    const normalized = {
      ...product,
      id: product.id || makeId('product'),
      price: Number(product.price),
      stock: Number(product.stock),
      initialStock: Number(product.initialStock || product.stock),
    };

    setDb((previous) => ({
      ...previous,
      booths: previous.booths.map((booth) => {
        if (booth.id !== boothId) return booth;
        const exists = booth.products.some((item) => item.id === normalized.id);
        return {
          ...booth,
          products: exists
            ? booth.products.map((item) => (item.id === normalized.id ? normalized : item))
            : [...booth.products, normalized],
        };
      }),
    }));
    notify(product.id ? '상품 정보가 수정되었습니다.' : '상품이 추가되었습니다.');
  }

  function removeProduct(boothId, productId) {
    setDb((previous) => ({
      ...previous,
      booths: previous.booths.map((booth) =>
        booth.id === boothId
          ? { ...booth, products: booth.products.filter((item) => item.id !== productId) }
          : booth,
      ),
    }));
    notify('상품이 삭제되었습니다.');
  }

  // ---------- 데모 로그인과 초기화 ----------
  function login(email, password) {
    const found = db.admins.find(
      (person) =>
        person.email.toLowerCase() === email.trim().toLowerCase() &&
        person.password === password,
    );
    if (!found) {
      notify('이메일이나 비밀번호를 확인해 주세요.', 'error');
      return false;
    }

    setAdminId(found.id);
    notify(`${found.name}님, 환영합니다!`);
    go('/admin');
    return true;
  }

  function register({ name, email, password, boothIds }) {
    if (db.admins.some((person) => person.email.toLowerCase() === email.toLowerCase())) {
      notify('이미 가입된 이메일입니다.', 'error');
      return false;
    }

    const person = { id: makeId('admin'), name, email, password, boothIds };
    setDb((previous) => ({ ...previous, admins: [...previous.admins, person] }));
    setAdminId(person.id);
    notify('데모 계정이 만들어졌습니다.');
    go('/admin');
    return true;
  }

  function logout() {
    setAdminId(null);
    notify('로그아웃되었습니다.');
    go('/');
  }

  function resetDemo() {
    setDb(seedData());
    setVerifiedIds([]);
    setAdminId(null);
    notify('데모 데이터를 초기화했습니다.');
    go('/');
  }

  return {
    db,
    admin,
    verifiedIds,
    toast,
    notify,
    lookupTicket,
    createOrder,
    issueTicket,
    confirmTicket,
    setOrderStatus,
    updateBooth,
    upsertProduct,
    removeProduct,
    login,
    register,
    logout,
    resetDemo,
  };
}
