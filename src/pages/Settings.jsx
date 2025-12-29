// src/pages/Settings.jsx
import { useEffect, useState } from "react";
import "./Settings.css";

import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

import yellowLogo from "../assets/gummy-bear-yellow.png";
import purpleLogo from "../assets/gummy-bear-purple.png";
import pinkLogo from "../assets/gummy-bear-pink.png";

const PROFILE_KEY = "planify_profile";
const TASK_KEY = "planify_tasks_v1";
const COLOR_MODE_KEY = "planify_color_mode";
const JELLY_KEY = "planify_jelly";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { nickname: "", intro: "" };
    const parsed = JSON.parse(raw);
    return {
      nickname: parsed.nickname || "",
      intro: parsed.intro || "",
    };
  } catch {
    return { nickname: "", intro: "" };
  }
}

function Settings() {
  const { colorMode, setColorMode, jelly, setJelly } = useTheme();

  const [profile, setProfile] = useState({
    nickname: "",
    intro: "",
  });

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      alert("프로필이 저장되었습니다.");
    } catch {
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  const changeMode = (mode) => {
    setColorMode(mode);
  };

  const changeJelly = (theme) => {
    setJelly(theme);
  };

  const resetAllData = () => {
    const ok = window.confirm("모든 할 일, 프로필, 테마 설정을 초기화할까요?\n이 작업은 되돌릴 수 없습니다.");
    if (!ok) return;

    try {
      localStorage.removeItem(TASK_KEY);
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(COLOR_MODE_KEY);
      localStorage.removeItem(JELLY_KEY);
      alert("데이터가 초기화되었습니다. 페이지를 새로고침합니다.");
      window.location.reload();
    } catch {
      alert("데이터 초기화 중 오류가 발생했습니다.");
    }
  };

  return (
    <Layout title="설정">
      <div className="settings-page">
        {/* 프로필 */}
        <section className="settings-card">
          <h2 className="settings-title">프로필</h2>

          <div className="settings-field">
            <label>닉네임</label>
            <input
              type="text"
              value={profile.nickname}
              onChange={(e) => handleProfileChange("nickname", e.target.value)}
              placeholder="홈 상단에 보여질 이름"
            />
          </div>

          <div className="settings-field">
            <label>한 줄 소개</label>
            <textarea
              rows={2}
              value={profile.intro}
              onChange={(e) => handleProfileChange("intro", e.target.value)}
              placeholder="오늘의 나를 표현하는 한 줄"
            />
          </div>

          <button type="button" className="settings-save-btn" onClick={saveProfile}>
            프로필 저장
          </button>
        </section>

        {/* 화면 모드 */}
        <section className="settings-card">
          <h2 className="settings-title">화면 모드</h2>
          <div className="settings-mode-row">
            <button
              type="button"
              className={colorMode === "light" ? "settings-mode-btn active" : "settings-mode-btn"}
              onClick={() => changeMode("light")}
            >
              ☀ 라이트
            </button>
            <button
              type="button"
              className={colorMode === "dark" ? "settings-mode-btn active" : "settings-mode-btn"}
              onClick={() => changeMode("dark")}
            >
              🌙 다크
            </button>
          </div>
        </section>

        {/* 젤리 테마 선택 (PNG 이미지) */}
        <section className="settings-card">
          <h2 className="settings-title">젤리 테마</h2>
          <p className="settings-help">마음에 드는 젤리 곰 이미지를 선택해 테마를 변경해 보세요.</p>

          <div className="settings-jelly-grid">
            <button
              type="button"
              className={jelly === "yellow" ? "settings-jelly-item active" : "settings-jelly-item"}
              onClick={() => changeJelly("yellow")}
            >
              <img src={yellowLogo} alt="Lemon Jelly" className="settings-jelly-img" />
              <span className="settings-jelly-label">Lemon Jelly</span>
            </button>

            <button
              type="button"
              className={jelly === "purple" ? "settings-jelly-item active" : "settings-jelly-item"}
              onClick={() => changeJelly("purple")}
            >
              <img src={purpleLogo} alt="Grape Jelly" className="settings-jelly-img" />
              <span className="settings-jelly-label">Grape Jelly</span>
            </button>

            <button
              type="button"
              className={jelly === "pink" ? "settings-jelly-item active" : "settings-jelly-item"}
              onClick={() => changeJelly("pink")}
            >
              <img src={pinkLogo} alt="Peach Jelly" className="settings-jelly-img" />
              <span className="settings-jelly-label">Peach Jelly</span>
            </button>
          </div>
        </section>

        {/* 데이터 초기화 */}
        <section className="settings-card settings-danger">
          <h2 className="settings-title">데이터 초기화</h2>
          <p className="settings-help">Planify에 저장된 모든 할 일, 프로필, 테마 설정을 삭제합니다.</p>
          <button type="button" className="settings-reset-btn" onClick={resetAllData}>
            데이터 초기화 (모든 할 일 / 설정 삭제)
          </button>
        </section>
      </div>
    </Layout>
  );
}

export default Settings;
