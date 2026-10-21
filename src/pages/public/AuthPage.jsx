/** 운영자 데모 로그인 / 회원가입 화면 */
import { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Store } from 'lucide-react';
import { Button, FormField } from '../../components/UI.jsx';
export function AuthPage({ db, login, register, go, admin, restricted = false }) {
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [boothIds, setBoothIds] = useState([]);
    if (admin)
        return <div className="container auth-signed">
      <ShieldCheck size={36}/>
      <h2>이미 로그인되어 있어요</h2>
        <Button onClick={() => go('/admin')}>내 부스로 이동 <ArrowRight size={16}/>
      </Button>
    </div>;
    const submit = e => {
        e.preventDefault();
        if (mode === 'login')
            login(email, password);
        else if (!name.trim() || password.length < 4) {
            return;
        }
        else
            register({ name: name.trim(), email: email.trim(), password, boothIds });
    };
    return <div className="auth-background">
      <div className="container auth-layout">
        <div className="auth-intro">
          <div className="auth-feature-icon">
            <Store size={28}/>
          </div>
          <span className="eyebrow">FOR BOOTH OPERATORS</span>
          <h1>우리 부스 운영,<br />이제 더 편리하게.</h1>
          <p>현장대기부터 추후소집, 상품 관리와 사전 주문 확인까지 필요한 기능을 한 곳에 모았어요.</p>
          <div className="auth-checks">
            <span>
            <CheckCircle2 size={18}/> 번호표 빠른 발급과 인증</span>
            <span>
            <CheckCircle2 size={18}/> 주문 현황과 재고 관리</span>
            <span>
            <CheckCircle2 size={18}/> 부스별 맞춤 설정</span>
          </div>
          <div className="auth-decoration">✳</div>
        </div>
        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-brand-icon">
              <ShieldCheck size={23}/>
            </div>
            <h2>{mode === 'login' ? '부스 운영자 로그인' : '운영자 회원가입'}</h2>
            <p>{restricted ? '먼저 로그인하면 관리자 페이지에 접근할 수 있어요.' : mode === 'login' ? '내가 속한 부스를 선택하고 운영을 시작하세요.' : '데모용 계정을 만들어 관리자 기능을 체험해 보세요.'}</p>
          </div>
          <div className="auth-tabs">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>로그인</button>
            <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>회원가입</button>
          </div>
            <form className="auth-form" onSubmit={submit}>{mode === 'signup' && <FormField label="이름">
              <input required placeholder="운영자 이름" value={name} onChange={e => setName(e.target.value)}/>
            </FormField>}<FormField label="이메일">
              <input type="email" required placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
            </FormField>
            <FormField label="비밀번호" hint={mode === 'signup' ? '4자 이상 입력해 주세요. (데모 전용)' : undefined}>
              <input type="password" required minLength={mode === 'signup' ? 4 : 1} placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)}/>
            </FormField>
    {mode === 'signup' && <div className="form-field">
                <span className="field-label">소속 부스 선택 <span className="field-optional">(데모용)</span>
              </span>
                <div className="signup-booth-list">{db.booths.map(b => <label key={b.id}>
                  <input type="checkbox" checked={boothIds.includes(b.id)} onChange={e => setBoothIds(prev => e.target.checked ? [...prev, b.id] : prev.filter(id => id !== b.id))}/>
                  <span>{b.emoji} {b.name}</span>
              </label>)}</div>
              <small>실제 서비스에서는 부스 관리자 초대 및 승인으로 가입을 제한해야 합니다.</small>
            </div>}
              <Button type="submit" className="full-width">{mode === 'login' ? '로그인하기' : '회원가입 완료'} <ArrowRight size={17}/>
            </Button>
          </form>
    {mode === 'login' && <div className="auth-demo-account">
            <div className="demo-account-title">✳ 체험용 운영자 계정</div>
              <div>이메일 <strong>demo@boothmate.kr</strong>
            </div>
              <div>비밀번호 <strong>1234</strong>
            </div>
              <button onClick={() => { setEmail('demo@boothmate.kr'); setPassword('1234'); }}>체험 계정 입력하기 <ArrowRight size={14}/>
            </button>
          </div>}
          <p className="auth-security-note">이 화면은 React + localStorage 데모입니다. 실제 인증/보안을 제공하지 않아요.</p>
        </div>
      </div>
    </div>;
}