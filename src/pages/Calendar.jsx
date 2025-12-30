// src/pages/Calendar.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { loadTasks, createTaskForDate } from '../utils/taskStorage';
import './Calendar.css';

dayjs.locale('ko');

const PROJECT_LABEL = {
   personal: '개인',
   study: '공부',
   work: '일',
   etc: '기타',
};

function Calendar() {
   const [tasks, setTasks] = useState(() => loadTasks());
   const [currentMonth, setCurrentMonth] = useState(dayjs());
   const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

   const today = dayjs().format('YYYY-MM-DD');

   const [newTask, setNewTask] = useState({
      title: '',
      project: 'personal',
      priority: 'medium',
      memo: '',
   });
   const [modalDate, setModalDate] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const pressTimerRef = useRef(null);
   const LONG_PRESS_MS = 800;

   const tasksByDate = useMemo(() => {
      const map = new Map();
      tasks.forEach((t) => {
         if (!t.dueDate) return;
         if (!map.has(t.dueDate)) map.set(t.dueDate, []);
         map.get(t.dueDate).push(t);
      });
      return map;
   }, [tasks]);

   const selectedTasks = useMemo(() => {
      return (tasksByDate.get(selectedDate) || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
   }, [tasksByDate, selectedDate]);

   const monthGrid = useMemo(() => {
      const start = currentMonth.startOf('month').startOf('week');
      const end = currentMonth.endOf('month').endOf('week');

      const days = [];
      let cursor = start;

      while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
         const dateStr = cursor.format('YYYY-MM-DD');
         const count = (tasksByDate.get(dateStr) || []).length;

         days.push({
            key: dateStr,
            label: cursor.date(),
            dateStr,
            isCurrentMonth: cursor.month() === currentMonth.month(),
            isToday: dateStr === today,
            isSelected: dateStr === selectedDate,
            count,
         });

         cursor = cursor.add(1, 'day');
      }

      return days;
   }, [currentMonth, today, selectedDate, tasksByDate]);

   const goPrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, 'month'));
   const goNextMonth = () => setCurrentMonth((prev) => prev.add(1, 'month'));

   const startLongPress = (dateStr) => {
      cancelLongPress();
      pressTimerRef.current = setTimeout(() => {
         openModal(dateStr);
      }, LONG_PRESS_MS);
   };

   const cancelLongPress = () => {
      if (pressTimerRef.current) {
         clearTimeout(pressTimerRef.current);
         pressTimerRef.current = null;
      }
   };

   const openModal = (dateStr) => {
      setModalDate(dateStr);
      setIsModalOpen(true);
      setNewTask({
         title: '',
         project: 'personal',
         priority: 'medium',
         memo: '',
      });
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setModalDate(null);
   };

   useEffect(() => {
      return () => {
         cancelLongPress();
      };
   }, []);

   const changeNewTask = (field, value) => {
      setNewTask((prev) => ({ ...prev, [field]: value }));
   };

   const addTaskToModalDate = (e) => {
      e.preventDefault();
      if (!newTask.title.trim()) {
         alert('할 일 제목을 입력해 주세요.');
         return;
      }

      const targetDate = modalDate || selectedDate;

      const next = createTaskForDate(targetDate, newTask);
      setTasks(next);

      setNewTask({
         title: '',
         project: 'personal',
         priority: 'medium',
         memo: '',
      });

      closeModal();
   };

   return (
      <>
         <div className="calendar-page">
            <section className="calendar-card">
               <header className="calendar-head">
                  <div className="calendar-head-left">
                     <button type="button" className="calendar-month-btn" onClick={goPrevMonth}>
                        ‹
                     </button>

                     <h2>
                        {currentMonth.format('YYYY.MM')}
                        <span className="calendar-head-sub">{currentMonth.format('MMMM')}</span>
                     </h2>

                     <button type="button" className="calendar-month-btn" onClick={goNextMonth}>
                        ›
                     </button>
                  </div>

                  <button
                     type="button"
                     className="calendar-today-btn"
                     onClick={() => {
                        setCurrentMonth(dayjs());
                        setSelectedDate(today);
                     }}>
                     오늘로
                  </button>
               </header>

               <p className="calendar-tip">
                  날짜를 탭해서 일정 보기 · <strong>길게 눌러</strong> 새 할 일 추가
               </p>

               <div className="calendar-grid">
                  <div className="calendar-weekdays">
                     <span>일</span>
                     <span>월</span>
                     <span>화</span>
                     <span>수</span>
                     <span>목</span>
                     <span>금</span>
                     <span>토</span>
                  </div>

                  <div className="calendar-days">
                     {monthGrid.map((d) => (
                        <button
                           key={d.key}
                           type="button"
                           className={[
                              'calendar-day-cell',
                              d.isCurrentMonth ? 'current-month' : 'other-month',
                              d.isToday ? 'today' : '',
                              d.isSelected ? 'selected' : '',
                              d.count > 0 ? 'has-tasks' : '',
                           ]
                              .filter(Boolean)
                              .join(' ')}
                           onClick={() => {
                              cancelLongPress();
                              setSelectedDate(d.dateStr);
                           }}
                           onMouseDown={() => startLongPress(d.dateStr)}
                           onMouseUp={cancelLongPress}
                           onMouseLeave={cancelLongPress}
                           onTouchStart={() => startLongPress(d.dateStr)}
                           onTouchEnd={cancelLongPress}
                           onTouchCancel={cancelLongPress}>
                           <span className="day-number">{d.label}</span>
                           {d.count > 0 && <span className="day-dot">{d.count > 3 ? '3+' : d.count}</span>}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="calendar-selected-header">
                  <span className="sel-date">{dayjs(selectedDate).format('YYYY.MM.DD (ddd)')}</span>
                  {selectedDate === today && <span className="calendar-badge">오늘</span>}
               </div>

               {selectedTasks.length === 0 ? (
                  <p className="calendar-empty">
                     이 날짜에 등록된 할 일이 없습니다.
                     <br />
                     날짜를 길게 눌러 새 할 일을 추가할 수 있어요.
                  </p>
               ) : (
                  <ul className="calendar-task-list">
                     {selectedTasks.map((t) => (
                        <li key={t.id} className={'calendar-task-item' + (t.done ? ' done' : '')}>
                           <span className="title">{t.title}</span>
                           <span className="meta">
                              {PROJECT_LABEL[t.project] || '기타'} · {t.priority === 'high' ? '우선순위 높음' : t.priority === 'low' ? '우선순위 낮음' : '우선순위 보통'}
                           </span>
                        </li>
                     ))}
                  </ul>
               )}
            </section>
         </div>

         {isModalOpen && (
            <div className="cal-modal-backdrop" onClick={closeModal}>
               <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
                  <header className="cal-modal-head">
                     <h3>{dayjs(modalDate || selectedDate).format('YYYY.MM.DD (ddd)')}</h3>
                     <button type="button" className="cal-modal-close" onClick={closeModal}>
                        ✕
                     </button>
                  </header>

                  <p className="cal-modal-sub">이 날짜에 새 할 일을 추가합니다.</p>

                  <form className="cal-add-form" onSubmit={addTaskToModalDate}>
                     <input type="text" value={newTask.title} onChange={(e) => changeNewTask('title', e.target.value)} placeholder="할 일 제목" />

                     <div className="cal-add-row">
                        <select value={newTask.project} onChange={(e) => changeNewTask('project', e.target.value)}>
                           <option value="personal">개인</option>
                           <option value="study">공부</option>
                           <option value="work">일</option>
                           <option value="etc">기타</option>
                        </select>

                        <select value={newTask.priority} onChange={(e) => changeNewTask('priority', e.target.value)}>
                           <option value="low">낮음</option>
                           <option value="medium">보통</option>
                           <option value="high">높음</option>
                        </select>
                     </div>

                     <textarea rows={2} value={newTask.memo} onChange={(e) => changeNewTask('memo', e.target.value)} placeholder="메모 (선택)" />

                     <div className="cal-modal-actions">
                        <button type="button" className="cal-modal-cancel" onClick={closeModal}>
                           취소
                        </button>
                        <button type="submit" className="cal-modal-submit">
                           추가하기
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </>
   );
}

export default Calendar;
