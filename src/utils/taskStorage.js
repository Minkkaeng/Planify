// src/utils/taskStorage.js

const TASK_KEY = "planify_tasks_v1";

// 내부에서 사용하는 정규화 함수
function normalizeTask(t) {
  return {
    id: t.id ?? Date.now(),
    title: t.title ?? "",
    done: !!t.done,
    project: t.project ?? "personal", // personal | study | work | etc
    priority: t.priority ?? "normal", // high | normal | low
    dueDate: t.dueDate ?? "",
    createdAt: t.createdAt ?? Date.now(),
  };
}

// ✅ 전체 할 일 목록 읽기
export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.map(normalizeTask);
  } catch (e) {
    console.error("taskStorage loadTasks error:", e);
    return [];
  }
}

// ✅ 전체 저장
export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    return true;
  } catch (e) {
    console.error("taskStorage saveTasks error:", e);
    return false;
  }
}

// ✅ 새 할 일 추가 (내부 공용)
export function addTask(task) {
  const list = loadTasks();
  const newTask = normalizeTask(task);
  const newList = [...list, newTask];
  saveTasks(newList);
  return newTask;
}

// ✅ Tasks.jsx 에서 쓰는 이름 맞춰주기: createTask → addTask 래핑
export function createTask(task) {
  return addTask(task);
}

// ✅ 할 일 수정
export function updateTask(id, patch) {
  const list = loadTasks();
  const newList = list.map((t) => (t.id === id ? { ...t, ...patch } : t));
  saveTasks(newList);
  return newList;
}

// ✅ 할 일 삭제
export function deleteTask(id) {
  const list = loadTasks();
  const newList = list.filter((t) => t.id !== id);
  saveTasks(newList);
  return newList;
}
