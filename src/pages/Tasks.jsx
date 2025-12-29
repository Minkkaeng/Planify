import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { loadTasks, createTask, updateTask, deleteTask } from "../utils/taskStorage";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    project: "personal",
    priority: "medium",
    dueDate: "",
    memo: "",
  });

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("할 일 제목을 입력해 주세요.");
      return;
    }
    const next = createTask(form);
    setTasks(next);
    setForm({
      title: "",
      project: "personal",
      priority: "medium",
      dueDate: "",
      memo: "",
    });
  };

  const toggleDone = (id, done) => {
    const next = updateTask(id, { done: !done });
    setTasks(next);
  };

  const handleDelete = (id) => {
    if (!window.confirm("이 할 일을 삭제할까요?")) return;
    const next = deleteTask(id);
    setTasks(next);
  };

  const sortedTasks = [...tasks].sort((a, b) => b.id - a.id);

  return (
    <Layout title="플랜 관리">
      <div className="tasks-page">
        <section className="tasks-card">
          <header className="tasks-card-head">
            <h2>새 할 일 추가</h2>
          </header>

          <form className="tasks-form" onSubmit={handleSubmit}>
            <div className="tasks-field">
              <label>제목</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="예: React 공부하기"
              />
            </div>

            <div className="tasks-row">
              <div className="tasks-field">
                <label>프로젝트</label>
                <select value={form.project} onChange={(e) => handleChange("project", e.target.value)}>
                  <option value="personal">개인</option>
                  <option value="study">공부</option>
                  <option value="work">일</option>
                  <option value="etc">기타</option>
                </select>
              </div>
              <div className="tasks-field">
                <label>우선순위</label>
                <select value={form.priority} onChange={(e) => handleChange("priority", e.target.value)}>
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
                  <option value="high">높음</option>
                </select>
              </div>
              <div className="tasks-field">
                <label>마감일</label>
                <input type="date" value={form.dueDate} onChange={(e) => handleChange("dueDate", e.target.value)} />
              </div>
            </div>

            <div className="tasks-field">
              <label>메모</label>
              <textarea
                rows={2}
                value={form.memo}
                onChange={(e) => handleChange("memo", e.target.value)}
                placeholder="간단한 메모를 남겨보세요."
              />
            </div>

            <div className="tasks-actions">
              <button type="submit">추가하기</button>
            </div>
          </form>
        </section>

        <section className="tasks-card">
          <header className="tasks-card-head">
            <h2>전체 할 일</h2>
          </header>

          {sortedTasks.length === 0 ? (
            <p className="tasks-empty">아직 등록된 할 일이 없습니다. 위 폼에서 첫 번째 할 일을 추가해보세요.</p>
          ) : (
            <ul className="tasks-list">
              {sortedTasks.map((t) => (
                <li key={t.id} className="tasks-item">
                  <div className="tasks-item-main">
                    <label className="tasks-checkbox-label">
                      <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id, t.done)} />
                      <span className={t.done ? "tasks-title done" : "tasks-title"}>{t.title}</span>
                    </label>
                    <p className="tasks-meta">
                      {t.project === "personal"
                        ? "개인"
                        : t.project === "study"
                        ? "공부"
                        : t.project === "work"
                        ? "일"
                        : "기타"}{" "}
                      ·{" "}
                      {t.priority === "high"
                        ? "우선순위 높음"
                        : t.priority === "low"
                        ? "우선순위 낮음"
                        : "우선순위 보통"}{" "}
                      {t.dueDate && `· 마감일 ${t.dueDate}`}
                    </p>
                    {t.memo && <p className="tasks-memo">{t.memo}</p>}
                  </div>
                  <button type="button" className="tasks-delete-btn" onClick={() => handleDelete(t.id)}>
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default Tasks;
