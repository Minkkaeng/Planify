// src/utils/taskStorage.js

export const TASK_KEY = 'planify_tasks_v1';

// ID 생성 (브라우저 crypto 우선, 없으면 fallback)
function generateTaskId() {
   if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
   }
   return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadTasks() {
   try {
      const raw = localStorage.getItem(TASK_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
         localStorage.removeItem(TASK_KEY);
         return [];
      }
      return parsed;
   } catch {
      localStorage.removeItem(TASK_KEY);
      return [];
   }
}

export function saveTasks(tasks) {
   localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

// 기본 생성 (Tasks 페이지에서 사용)
export function createTask(data) {
   const tasks = loadTasks();
   const now = Date.now();

   const newTask = {
      id: generateTaskId(),
      title: data.title || '',
      project: data.project || 'personal', // personal | study | work | etc
      priority: data.priority || 'medium', // low | medium | high
      dueDate: data.dueDate || '',
      memo: data.memo || '',
      done: false,
      createdAt: now,
   };

   const next = [newTask, ...tasks];
   saveTasks(next);
   return next;
}

// 캘린더에서 특정 날짜에 바로 생성
export function createTaskForDate(date, data) {
   const tasks = loadTasks();
   const now = Date.now();

   const newTask = {
      id: generateTaskId(),
      title: data.title || '',
      project: data.project || 'personal',
      priority: data.priority || 'medium',
      dueDate: date, // 선택된 날짜
      memo: data.memo || '',
      done: false,
      createdAt: now,
   };

   const next = [newTask, ...tasks];
   saveTasks(next);
   return next;
}

export function updateTask(id, patch) {
   const tasks = loadTasks();
   const next = tasks.map((t) =>
      t.id === id
         ? {
              ...t,
              ...patch,
           }
         : t
   );
   saveTasks(next);
   return next;
}

export function deleteTask(id) {
   const tasks = loadTasks();
   const next = tasks.filter((t) => t.id !== id);
   saveTasks(next);
   return next;
}
