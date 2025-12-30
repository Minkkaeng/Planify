// src/pages/Settings.jsx
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { loadProfile, saveProfile } from '../utils/profileStorage';
import { resetPlanifyData } from '../utils/resetPlanifyData';
import { getJellyLogo } from '../utils/jellyAssets';
import './Settings.css';

function Settings() {
   const { colorMode, setColorMode, jelly, setJelly } = useTheme();

   const [profile, setProfile] = useState(() => loadProfile());
   const [savedMessage, setSavedMessage] = useState('');

   const handleProfileChange = (field, value) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
   };

   const handleProfileSave = (e) => {
      e.preventDefault();
      saveProfile(profile);
      setSavedMessage('계정 설정이 저장되었습니다.');
      setTimeout(() => setSavedMessage(''), 2000);
   };

   const handleReset = () => {
      const ok = window.confirm('Planify의 모든 할 일, 계정 정보, 테마 설정을 초기화할까요?\n이 작업은 되돌릴 수 없습니다.');
      if (!ok) return;

      resetPlanifyData();
      window.location.reload();
   };

   const yellowLogo = getJellyLogo('yellow');
   const purpleLogo = getJellyLogo('purple');
   const pinkLogo = getJellyLogo('pink');

   return (
      <div className="settings-page">
         <section className="settings-card">
            <header className="settings-card-head">
               <h2>계정 정보</h2>
               {savedMessage && <span className="settings-save-msg">{savedMessage}</span>}
            </header>

            <form className="settings-form" onSubmit={handleProfileSave}>
               <div className="settings-field">
                  <label>닉네임</label>
                  <input type="text" value={profile.nickname} onChange={(e) => handleProfileChange('nickname', e.target.value)} placeholder="Planify에서 사용할 이름" />
               </div>

               <div className="settings-field">
                  <label>이메일 (선택)</label>
                  <input type="email" value={profile.email} onChange={(e) => handleProfileChange('email', e.target.value)} placeholder="연락용 이메일" />
               </div>

               <div className="settings-field">
                  <label>한 줄 소개</label>
                  <textarea rows={2} value={profile.bio} onChange={(e) => handleProfileChange('bio', e.target.value)} placeholder="예: 프론트엔드 공부 중인 개발자" />
               </div>

               <div className="settings-actions">
                  <button type="submit">저장하기</button>
               </div>
            </form>
         </section>

         <section className="settings-card">
            <header className="settings-card-head">
               <h2>앱 설정</h2>
            </header>

            <div className="settings-section">
               <h3>화면 모드</h3>
               <div className="settings-chip-group">
                  <button type="button" className={colorMode === 'light' ? 'active' : ''} onClick={() => setColorMode('light')}>
                     ☀ 라이트
                  </button>
                  <button type="button" className={colorMode === 'dark' ? 'active' : ''} onClick={() => setColorMode('dark')}>
                     ☾ 다크
                  </button>
               </div>
            </div>

            <div className="settings-section">
               <h3>젤리 테마</h3>
               <p className="settings-help">오늘 기분에 맞는 젤리 색을 선택해보세요.</p>
               <div className="settings-chip-group">
                  <button type="button" className={jelly === 'yellow' ? 'active' : ''} onClick={() => setJelly('yellow')}>
                     <img src={yellowLogo} alt="Yellow Jelly" className="settings-jelly-icon" />
                     <span>Yellow</span>
                  </button>
                  <button type="button" className={jelly === 'purple' ? 'active' : ''} onClick={() => setJelly('purple')}>
                     <img src={purpleLogo} alt="Purple Jelly" className="settings-jelly-icon" />
                     <span>Purple</span>
                  </button>
                  <button type="button" className={jelly === 'pink' ? 'active' : ''} onClick={() => setJelly('pink')}>
                     <img src={pinkLogo} alt="Pink Jelly" className="settings-jelly-icon" />
                     <span>Pink</span>
                  </button>
               </div>
            </div>

            <div className="settings-section settings-reset">
               <h3>데이터 초기화</h3>
               <p className="settings-help">모든 할 일, 계정 정보, 테마 설정을 삭제하고 처음 상태로 되돌립니다.</p>
               <button type="button" className="settings-reset-btn" onClick={handleReset}>
                  전체 데이터 초기화
               </button>
            </div>
         </section>
      </div>
   );
}

export default Settings;
