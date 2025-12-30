// src/pages/Home.jsx
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Layout from '../components/Layout';
import { loadTasks } from '../utils/taskStorage';
import { loadProfile } from '../utils/profileStorage';
import './Home.css';

const PROJECT_LABEL = {
   personal: '개인',
   study: '공부',
   work: '일',
   etc: '기타',
};

function sortByDueDate(list) {
   return [...list].sort((a, b) => {
      const da = a.dueDate || '';
      const db = b.dueDate || '';

      if (da && db && da !== db) return da.localeCompare(db);
      if (da && !db) return -1;
      if (!da && db) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
   });
}

function Home() {
   // ⭕ 초기값에서 바로 localStorage 읽기
   const [tasks] = useState(() => loadTasks());
   const [profile] = useState(() => loadProfile());

   const todayStr = dayjs().format('YYYY-MM-DD');

   const { todayActive, todayDone, upcoming, noDue, totalActive, totalDone } = useMemo(() => {
      const active = tasks.filter((t) => !t.done);
      const done = tasks.filter((t) => t.done);

      const todayActive = active.filter((t) => t.dueDate === todayStr);
      const todayDone = done.filter((t) => t.dueDate === todayStr);

      const upcoming = active.filter((t) => t.dueDate && t.dueDate > todayStr);
      const noDue = active.filter((t) => !t.dueDate);

      return {
         todayActive: sortByDueDate(todayActive),
         todayDone: sortByDueDate(todayDone),
         upcoming: sortByDueDate(upcoming),
         noDue: sortByDueDate(noDue),
         totalActive: active.length,
         totalDone: done.length,
      };
   }, [tasks, todayStr]);

   return (
      <Layout title="Planify">
         <div className="home-page">
            {/* 프로필 */}
            <section className="home-card home-profile">
               <div className="home-profile-left">
                  <div className="home-profile-avatar">✨</div>
                  <div className="home-profile-texts">
                     <p className="home-profile-hello">
                        {profile.nickname ? `${profile.nickname}님, 오늘 젤리 플랜 시작해볼까요?` : '오늘 할 일을 젤리처럼 조각조각 정리해보세요.'}
                     </p>
                     <p className="home-profile-bio">{profile.bio ? profile.bio : 'Settings에서 닉네임과 한 줄 소개를 설정할 수 있어요.'}</p>
                  </div>
               </div>
               {profile.email && <p className="home-profile-email">{profile.email}</p>}
            </section>

            {/* 요약 */}
            <section className="home-card home-summary">
               <header className="home-card-head">
                  <h2>오늘 요약</h2>
                  <span>{dayjs().format('YYYY.MM.DD')}</span>
               </header>

               <div className="home-summary-grid">
                  <div className="home-summary-item">
                     <p className="label">오늘 해야 할 일</p>
                     <p className="value">{todayActive.length}</p>
                  </div>
                  <div className="home-summary-item">
                     <p className="label">오늘 완료</p>
                     <p className="value">{todayDone.length}</p>
                  </div>
                  <div className="home-summary-item">
                     <p className="label">진행 중</p>
                     <p className="value">{totalActive}</p>
                  </div>
                  <div className="home-summary-item">
                     <p className="label">전체 완료</p>
                     <p className="value">{totalDone}</p>
                  </div>
               </div>
            </section>

            {/* 오늘 할 일 */}
            <section className="home-card">
               <header className="home-card-head">
                  <h2>오늘 할 일</h2>
               </header>

               {todayActive.length === 0 && todayDone.length === 0 ? (
                  <p className="home-empty">오늘로 지정된 할 일이 없습니다. 플랜 탭에서 새 할 일을 추가해보세요.</p>
               ) : (
                  <>
                     {todayActive.length > 0 && (
                        <ul className="home-list">
                           {todayActive.slice(0, 5).map((t) => (
                              <li key={t.id} className="home-list-item">
                                 <span className="home-task-title">{t.title}</span>
                                 <span className="home-task-meta">프로젝트 {PROJECT_LABEL[t.project] || '기타'} · 진행 중</span>
                              </li>
                           ))}
                        </ul>
                     )}

                     {todayDone.length > 0 && (
                        <div className="home-subblock">
                           <p className="home-subblock-title">오늘 완료</p>
                           <ul className="home-list">
                              {todayDone.slice(0, 5).map((t) => (
                                 <li key={t.id} className="home-list-item home-list-item-done">
                                    <span className="home-task-title">{t.title}</span>
                                    <span className="home-task-meta">프로젝트 {PROJECT_LABEL[t.project] || '기타'} · 완료</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     )}
                  </>
               )}
            </section>

            {/* 다가오는 일정 */}
            <section className="home-card">
               <header className="home-card-head">
                  <h2>다가오는 일정</h2>
               </header>
               {upcoming.length === 0 ? (
                  <p className="home-empty">앞으로 마감일이 있는 할 일이 없습니다. 마감일을 지정해두면 관리하기 좋아요.</p>
               ) : (
                  <ul className="home-list">
                     {upcoming.slice(0, 5).map((t) => (
                        <li key={t.id} className="home-list-item">
                           <span className="home-task-title">{t.title}</span>
                           <span className="home-task-meta">
                              {dayjs(t.dueDate).format('MM.DD')} · {t.priority === 'high' ? '우선순위 높음' : t.priority === 'low' ? '우선순위 낮음' : '우선순위 보통'}
                           </span>
                        </li>
                     ))}
                  </ul>
               )}
            </section>

            {/* 마감일 없는 할 일 */}
            <section className="home-card">
               <header className="home-card-head">
                  <h2>마감일 없는 할 일</h2>
               </header>
               {noDue.length === 0 ? (
                  <p className="home-empty">마감일이 없는 할 일이 없습니다. 언젠가 하고 싶은 일들을 여기에 모아둘 수 있어요.</p>
               ) : (
                  <ul className="home-list">
                     {noDue.slice(0, 5).map((t) => (
                        <li key={t.id} className="home-list-item">
                           <span className="home-task-title">{t.title}</span>
                           <span className="home-task-meta">프로젝트 {PROJECT_LABEL[t.project] || '기타'}</span>
                        </li>
                     ))}
                  </ul>
               )}
            </section>
         </div>
      </Layout>
   );
}

export default Home;
