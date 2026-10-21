/** 참가자 프로필 / SNS 링크 */
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import { BreadCrumb, Button, EmptyState } from '../../components/UI.jsx';
export function MemberDetailPage({ booth, memberId, go }) {
    const member = booth.members.find(m => m.id === memberId);
    if (!member)
        return <EmptyState title="참가자를 찾을 수 없어요" description="다른 참가자를 선택해 주세요.">
      <Button onClick={() => go(`/booth/${booth.id}/members`)}>참가자 목록</Button>
    </EmptyState>;
    const handle = member.handle.replace(/^@/, '');
    const snsLink = member.socialType === 'X' ? `https://x.com/${encodeURIComponent(handle)}` : `https://www.instagram.com/${encodeURIComponent(handle)}/`;
    return <div className="container page-content">
      <BreadCrumb items={[{ text: '부스 찾기', action: () => go('/') }, { text: booth.name, action: () => go(`/booth/${booth.id}`) }, { text: '참가자', action: () => go(`/booth/${booth.id}/members`) }, { text: member.name }]}/>
      <div className="member-profile">
        <div className={`profile-visual tone-${booth.tone}`}>
          <span>{member.avatar}</span>
          <div className="profile-visual-label">CREATOR PROFILE ✳</div>
        </div>
        <div className="profile-content">
          <span className="eyebrow">MEET THE MAKER</span>
          <div className="profile-booth">{booth.name} · {booth.boothNumber}</div>
          <h1>{member.name}</h1>
          <span className="profile-role">{member.role}</span>
          <p>{member.bio}</p>
          <div className="profile-social">
            <span>{member.socialType}</span>
            <strong>{member.handle}</strong>
            <a href={snsLink} target="_blank" rel="noreferrer" aria-label={`${member.socialType} 웹사이트 열기`}>
              <ExternalLink size={16}/>
            </a>
          </div>
          <p className="profile-disclaimer">SNS 계정명은 화면 시연용 예시이며 실제 계정과 일치하지 않을 수 있습니다.</p>
          <div className="inline-buttons">
              <Button onClick={() => go(`/booth/${booth.id}`)}>부스 구경하기 <ArrowRight size={16}/>
            </Button>
            <Button variant="outline" onClick={() => go(`/booth/${booth.id}/members`)}>
            <ArrowLeft size={16}/> 참가자 목록</Button>
          </div>
        </div>
      </div>
    </div>;
}