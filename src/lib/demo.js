// 브라우저에서만 동작하는 목업 데이터입니다. 운영용 개인정보/비밀번호 저장에 사용하지 마세요.
export const DB_KEY = 'boothmate-react-db-v1';
export const ADMIN_KEY = 'boothmate-react-admin-v1';
export const VERIFIED_KEY = 'boothmate-react-verified-v1';
export function dateOffset(offset) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function todayISO() { return dateOffset(0); }
export const money = (value) => `${Number(value || 0).toLocaleString('ko-KR')}원`;
export const prettyDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }) : '';
export const prettyTime = (value) => value ? new Date(value).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
export function boothStatus(booth) {
    if (todayISO() < booth.startDate)
        return 'upcoming';
    if (todayISO() > booth.endDate)
        return 'ended';
    return 'ongoing';
}
export const statusLabel = { ongoing: '운영 중', upcoming: '오픈 예정', ended: '운영 종료' };
export const ticketTypeLabel = { onsite: '현장대기', recall: '추후소집' };
export const orderStatusLabel = { received: '접수 완료', preparing: '준비 중', pickedup: '수령 완료' };
export const makeId = (prefix) => `${prefix}_${(globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`).replaceAll('-', '')}`;
export function makeCode() {
    const symbols = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => symbols[Math.floor(Math.random() * symbols.length)]).join('');
}
export function seedData() {
    const booths = [
        {
            id: 'moon', name: '달빛상점', category: '일러스트 · 굿즈', hall: 'A홀 · 1층', boothNumber: 'A-12',
            startDate: dateOffset(-1), endDate: dateOffset(2), openTime: '10:00', closeTime: '18:00',
            description: '반짝이는 밤의 장면을 작고 귀여운 굿즈에 담았어요. 일러스트 엽서와 아크릴 키링, 스티커까지 마음에 드는 달빛을 찾아가세요.',
            tagline: '작은 밤을 수집하는 공간', emoji: '🌙', tone: 'lilac', tags: ['인기 부스', '한정 굿즈'],
            startNumbers: { onsite: 101, recall: 301 },
            products: [
                { id: 'moon-p1', name: '달토끼 아크릴 키링', detail: '투명 아크릴 · 5cm', price: 7500, stock: 18, initialStock: 40, emoji: '🐰' },
                { id: 'moon-p2', name: '별빛 홀로그램 스티커', detail: '한 장에 6종 구성', price: 3500, stock: 32, initialStock: 60, emoji: '✨' },
                { id: 'moon-p3', name: '밤하늘 엽서 세트', detail: '엽서 4매 구성', price: 6000, stock: 9, initialStock: 30, emoji: '🌌' }
            ],
            members: [
                { id: 'moon-m1', name: '모리', role: '대표 · 일러스트', handle: '@mori.draw', socialType: 'Instagram', bio: '밤, 토끼, 작은 별을 그립니다. 소소한 이야기를 굿즈에 담는 일러스트레이터예요.', avatar: '🪄' },
                { id: 'moon-m2', name: '하루', role: '디자인 · 운영', handle: '@haru.studio', socialType: 'X', bio: '따뜻한 색감의 소품을 좋아하는 디자이너. 이번 마켓의 패키지를 만들었어요.', avatar: '🌷' },
                { id: 'moon-m3', name: '레오', role: '굿즈 제작', handle: '@leo.makes', socialType: 'Instagram', bio: '손에 쏙 들어오는 귀여운 물건들을 만드는 메이커입니다.', avatar: '🧸' }
            ]
        },
        {
            id: 'pixel', name: '픽셀가든', category: '게임 · 픽셀아트', hall: 'B홀 · 1층', boothNumber: 'B-08',
            startDate: dateOffset(0), endDate: dateOffset(3), openTime: '11:00', closeTime: '19:00',
            description: '8비트 감성으로 만든 작은 식물과 게임 속 친구들을 만나보세요. 키보드 위에 두기 좋은 소품이 가득합니다.',
            tagline: '도트로 피어난 작은 정원', emoji: '🕹️', tone: 'mint', tags: ['신규 굿즈', '포토존'],
            startNumbers: { onsite: 1, recall: 201 },
            products: [
                { id: 'pixel-p1', name: '픽셀 화분 키캡', detail: '1개 · 랜덤 디자인', price: 12000, stock: 14, initialStock: 30, emoji: '🪴' },
                { id: 'pixel-p2', name: '슬라임 마스킹테이프', detail: '폭 15mm · 5m', price: 4500, stock: 27, initialStock: 40, emoji: '👾' },
                { id: 'pixel-p3', name: '게임보이 미니 파우치', detail: '기기 보관용', price: 16000, stock: 6, initialStock: 20, emoji: '🎮' }
            ],
            members: [
                { id: 'pixel-m1', name: '비트', role: '대표 · 픽셀아티스트', handle: '@bitpixel', socialType: 'X', bio: '레트로 게임과 픽셀 그래픽을 사랑합니다.', avatar: '👾' },
                { id: 'pixel-m2', name: '루나', role: '굿즈 기획', handle: '@luna.plants', socialType: 'Instagram', bio: '게임 속 초록빛을 현실로 꺼내는 일을 해요.', avatar: '🪴' }
            ]
        },
        {
            id: 'cloud', name: '구름공방', category: '핸드메이드', hall: 'A홀 · 2층', boothNumber: 'A-35',
            startDate: dateOffset(2), endDate: dateOffset(5), openTime: '10:00', closeTime: '17:00',
            description: '말랑말랑 솜구름을 닮은 수제 인형과 패브릭 소품을 소개합니다.',
            tagline: '손끝에서 만들어진 포근함', emoji: '☁️', tone: 'sky', tags: ['수제품', '선착순'],
            startNumbers: { onsite: 1, recall: 101 },
            products: [
                { id: 'cloud-p1', name: '몽실이 미니 인형', detail: '수작업 · 약 10cm', price: 18000, stock: 12, initialStock: 12, emoji: '☁️' },
                { id: 'cloud-p2', name: '구름 리본 파우치', detail: '핸드메이드 파우치', price: 13500, stock: 8, initialStock: 8, emoji: '🧵' }
            ],
            members: [{ id: 'cloud-m1', name: '소솜', role: '대표 · 핸드메이드', handle: '@sosom.craft', socialType: 'Instagram', bio: '포근한 원단으로 작고 귀여운 친구들을 만들어요.', avatar: '🧶' }]
        },
        {
            id: 'afternoon', name: '오후의 문구점', category: '문구 · 스티커', hall: 'C홀 · 1층', boothNumber: 'C-04',
            startDate: dateOffset(-5), endDate: dateOffset(-1), openTime: '10:00', closeTime: '18:00',
            description: '느린 오후를 기록하는 다이어리와 스티커, 메모지.',
            tagline: '오늘도 기록하기 좋은 날', emoji: '📒', tone: 'peach', tags: ['다꾸', '베스트셀러'],
            startNumbers: { onsite: 51, recall: 151 },
            products: [
                { id: 'after-p1', name: '일상 기록 메모패드', detail: '50매', price: 4000, stock: 13, initialStock: 35, emoji: '📝' },
                { id: 'after-p2', name: '다꾸 스티커팩', detail: '5종 구성', price: 5500, stock: 7, initialStock: 40, emoji: '💌' }
            ],
            members: [{ id: 'after-m1', name: '나나', role: '대표 · 문구 디자이너', handle: '@nana.stationery', socialType: 'Instagram', bio: '기억하고 싶은 순간을 종이 위에 옮깁니다.', avatar: '✏️' }]
        },
        {
            id: 'ribbon', name: '리본동산', category: '액세서리', hall: 'B홀 · 2층', boothNumber: 'B-21',
            startDate: dateOffset(1), endDate: dateOffset(4), openTime: '12:00', closeTime: '18:00',
            description: '리본과 반짝임을 좋아하는 사람들을 위한 손수 만든 액세서리.',
            tagline: '매일을 선물처럼 묶어요', emoji: '🎀', tone: 'pink', tags: ['핸드메이드', '선물 추천'],
            startNumbers: { onsite: 1, recall: 201 },
            products: [
                { id: 'ribbon-p1', name: '새틴 리본 헤어핀', detail: '2개 한 세트', price: 8500, stock: 16, initialStock: 25, emoji: '🎀' },
                { id: 'ribbon-p2', name: '하트 참 팔찌', detail: '사이즈 조절 가능', price: 11000, stock: 12, initialStock: 20, emoji: '💗' }
            ],
            members: [{ id: 'ribbon-m1', name: '체리', role: '대표 · 제작', handle: '@cherry.ribbon', socialType: 'Instagram', bio: '일상에 작은 설렘을 더하는 액세서리를 만듭니다.', avatar: '🍒' }]
        },
        {
            id: 'acorn', name: '도토리 아틀리에', category: '캐릭터 · 굿즈', hall: 'C홀 · 2층', boothNumber: 'C-19',
            startDate: dateOffset(0), endDate: dateOffset(2), openTime: '10:00', closeTime: '18:00',
            description: '숲속 작은 친구들의 하루를 담은 오리지널 캐릭터 굿즈.',
            tagline: '귀여운 숲속 친구들과 만나요', emoji: '🐿️', tone: 'sand', tags: ['오리지널', '인기 부스'],
            startNumbers: { onsite: 1, recall: 101 },
            products: [
                { id: 'acorn-p1', name: '도토리 봉제 키링', detail: '가방에 다는 키링', price: 9500, stock: 24, initialStock: 35, emoji: '🌰' },
                { id: 'acorn-p2', name: '숲속 친구들 틴케이스', detail: '스티커 포함', price: 8500, stock: 11, initialStock: 20, emoji: '🌳' }
            ],
            members: [{ id: 'acorn-m1', name: '모모', role: '대표 · 캐릭터 디자인', handle: '@momo.forest', socialType: 'X', bio: '도토리와 숲 속 동물을 그리는 캐릭터 작가입니다.', avatar: '🐿️' }]
        }
    ];
    const tickets = [
        { id: 'sample-ticket', boothId: 'moon', type: 'onsite', number: 101, name: '김하늘', code: 'MOON27', status: 'issued', createdAt: new Date().toISOString(), verifiedAt: null },
        { id: 'sample-ticket2', boothId: 'pixel', type: 'recall', number: 201, name: '박별', code: 'PIXEL7', status: 'issued', createdAt: new Date().toISOString(), verifiedAt: null }
    ];
    return { booths, tickets, orders: [], admins: [{ id: 'admin-demo', name: '데모 운영자', email: 'demo@boothmate.kr', password: '1234', boothIds: ['moon', 'pixel'] }] };
}
export function loadDB() {
    try {
        const raw = localStorage.getItem(DB_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            if (data && Array.isArray(data.booths) && Array.isArray(data.tickets) && Array.isArray(data.orders) && Array.isArray(data.admins))
                return data;
        }
    }
    catch (err) {
        console.warn('데모 데이터 복원 실패', err);
    }
    return seedData();
}
export function readSession(key, fallback) {
    try {
        return JSON.parse(sessionStorage.getItem(key) || 'null') ?? fallback;
    }
    catch {
        return fallback;
    }
}
