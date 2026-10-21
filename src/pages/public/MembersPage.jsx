/** 참가자 목록 화면 */
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BreadCrumb, Button, PageHeading } from '../../components/UI.jsx';
export function MembersPage({ booth, go }) {
    return <div className="container page-content">
      <BreadCrumb items={[{ text: '부스 찾기', action: () => go('/') }, { text: booth.name, action: () => go(`/booth/${booth.id}`) }, { text: '참가자 소개' }]}/>
      <PageHeading eyebrow="MEET THE CREATORS" title={`${booth.name}의 참가자들`} description="굿즈를 만든 크리에이터들의 이야기를 만나보세요.">
        <Button variant="outline" onClick={() => go(`/booth/${booth.id}`)}>
        <ArrowLeft size={16}/> 부스로 돌아가기</Button>
      </PageHeading>
        <div className="member-grid">{booth.members.map(m => <button className="member-card" key={m.id} onClick={() => go(`/booth/${booth.id}/members/${m.id}`)}>
          <div className={`member-card-art tone-${booth.tone}`}>
            <span>{m.avatar}</span>
          </div>
          <div className="member-card-content">
            <small>{m.role}</small>
            <h3>{m.name}</h3>
            <p>{m.bio}</p>
            <div className="member-card-bottom">
              <span>{m.handle}</span>
              <ArrowRight size={18}/>
            </div>
          </div>
      </button>)}</div>
    </div>;
}