// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./Home.css";

import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";
import { getJellyLogo, getJellyLabel } from "../utils/jellyAssets";
import { loadTasks } from "../utils/taskStorage";

function loadProfile() {
  try {
    const raw = localStorage.getItem("planify_profile");
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

function Home() {
  const navigate = useNavigate();
  const { jelly } = useTheme();

  const [tasks, setTasks] = useState([]);

  const logo = getJellyLogo(jelly);
  const jellyLabel = getJellyLabel(jelly);

  const { nickname, intro } = loadProfile();

  const todayStr = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const { todayTotal, todayDone, todayPending, todayTasks } = useMemo(() => {
    const todayList = tasks.filter((t) => t.dueDate === todayStr);
    const doneCount = todayList.filter((t) => t.done).length;
    const pendingCount = todayList.length - doneCount;
    return {
      todayTotal: todayList.length,
      todayDone: doneCount,
      todayPending: pendingCount,
      todayTasks: todayList
        .slice()
        .sort((a, b) => b.id - a.id)
        .slice(0, 3),
    };
  }, [tasks, todayStr]);

  const upcomingTasks = useMemo(() => {
    const list = tasks
      .filter((t) => t.dueDate && t.dueDate > todayStr)
      .sort((a, b) => {
        if (a.dueDate === b.dueDate) return b.id - a.id;
        return a.dueDate.localeCompare(b.dueDate);
      })
      .slice(0, 5);
    return list;
  }, [tasks, todayStr]);

  const displayName = nickname || "오늘의 플랜";
  const displayIntro = intro || "세 가지 젤리 테마로 오늘 하루를 말랑하게 정리해보자.";

  const goTasks = () => navigate("/tasks");
  const goCalendar = () => navigate("/calendar");

  return (
    <Layout title="홈">
      <div className="home-page">
        {/* 상단 카드 */}
        <section className="home-hero-card">
          <div className="home-hero-left">
            <img src={logo} alt={`${jellyLabel} 로고`} className="home-hero-logo" />
            <div>
              <p className="home-hero-eyebrow">{jellyLabel} 모드</p>
              <h1 className="home-hero-title">{displayName}</h1>
              <p className="home-hero-sub">{displayIntro}</p>
            </div>
          </div>
        </section>

        {/* 이하 요약/다가오는 일정/빠른 이동 ... (앞에서 준 코드 그대로) */}
      </div>
    </Layout>
  );
}

export default Home;
