// src/pages/Tasks.jsx
import { useState } from 'react';
import Layout from '../components/Layout';
import { loadTasks, createTask, updateTask, deleteTask } from '../utils/taskStorage';
import './Tasks.css';

const PROJECT_LABEL = {
   personal: '개인',
   study: '공부',
   work: '일',
   etc: '기타',
};

const PRIORITY_LABEL = {
   low: '우선순위 낮음',
   medium: '우선순위 보통',
   high: '우선순위 높음',
};

const EMPTY_FORM = {
   title: '',
   project: 'personal',
   priority: 'medium',
   dueDate: '',
   memo: '',
};

function Tasks() {
   // ✅ 초기 로딩을 useState lazy init으로
   const [tasks, setTasks] = useState(() => loadTasks());
   const [form, setForm] = useState(EMPTY_FORM);

   // 상단 카테고리: all | active | done
   const [filter, setFilter] = useState('all');

   // 수정 모달 상태
   const [editingTask, setEditingTask] = useState(null);
   const [editForm, setEditForm] = useState(EMPTY_FORM);

   // 삭제 확인 모달 상태
   const [deleteTargetId, setDeleteTargetId] = useState(null);

   const handleChange = (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!form.title.trim()) {
         alert('할 일 제목을 입력해 주세요.');
         return;
      }
      const next = createTask(form);
      setTasks(next);
      setForm(EMPTY_FORM);
   };

   const toggleDone = (id, done) => {
      const next = updateTask(id, { done: !done });
      setTasks(next);
   };

   // 수정 모달 열기
   const openEditModal = (task) => {
      setEditingTask(task);
      setEditForm({
         title: task.title || '',
         project: task.project || 'personal',
         priority: task.priority || 'medium',
         dueDate: task.dueDate || '',
         memo: task.memo || '',
      });
   };

   const closeEditModal = () => {
      setEditingTask(null);
      setEditForm(EMPTY_FORM);
   };

   const handleEditChange = (field, value) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
   };

   const handleEditSubmit = (e) => {
      e.preventDefault();
      if (!editForm.title.trim() || !editingTask) return;

      const next = updateTask(editingTask.id, {
         title: editForm.title,
         project: editForm.project,
         priority: editForm.priority,
         dueDate: editForm.dueDate,
         memo: editForm.memo,
      });
      setTasks(next);
      closeEditModal();
   };

   // 삭제 모달 열기
   const openDeleteConfirm = (id) => {
      setDeleteTargetId(id);
   };

   const closeDeleteConfirm = () => {
      setDeleteTargetId(null);
   };

   const confirmDelete = () => {
      if (!deleteTargetId) return;
      const next = deleteTask(deleteTargetId);
      setTasks(next);
      setDeleteTargetId(null);
   };

   // 정렬: 최신 id 기준
   const sorted = [...tasks].sort((a, b) => b.id - a.id);
   const activeTasks = sorted.filter((t) => !t.done);
   const doneTasks = sorted.filter((t) => t.done);

   return (
      <Layout title="플랜 관리">
         <div className="tasks-page">
            {/* 새 할 일 추가 */}
            <section className="tasks-card">
               <header className="tasks-card-head">
                  <h2>새 할 일 추가</h2>
               </header>

               <form className="tasks-form" onSubmit={handleSubmit}>
                  <div className="tasks-field">
                     <label>제목</label>
                     <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="예: React 공부하기" />
                  </div>

                  <div className="tasks-row">
                     <div className="tasks-field">
                        <label>프로젝트</label>
                        <select value={form.project} onChange={(e) => handleChange('project', e.target.value)}>
                           <option value="personal">개인</option>
                           <option value="study">공부</option>
                           <option value="work">일</option>
                           <option value="etc">기타</option>
                        </select>
                     </div>
                     <div className="tasks-field">
                        <label>우선순위</label>
                        <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                           <option value="low">낮음</option>
                           <option value="medium">보통</option>
                           <option value="high">높음</option>
                        </select>
                     </div>
                     <div className="tasks-field">
                        <label>마감일</label>
                        <input type="date" value={form.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} />
                     </div>
                  </div>

                  <div className="tasks-field">
                     <label>메모</label>
                     <textarea rows={2} value={form.memo} onChange={(e) => handleChange('memo', e.target.value)} placeholder="간단한 메모를 남겨보세요." />
                  </div>

                  <div className="tasks-actions">
                     <button type="submit">추가하기</button>
                  </div>
               </form>
            </section>

            {/* 전체 할 일 + 카테고리 탭 */}
            <section className="tasks-card">
               <header className="tasks-card-head">
                  <h2>전체 할 일</h2>
               </header>

               {/* 카테고리 탭 */}
               <div className="tasks-filter-tabs">
                  <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                     전체
                  </button>
                  <button type="button" className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>
                     예정
                  </button>
                  <button type="button" className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>
                     완료
                  </button>
               </div>

               {/* 리스트 */}
               {sorted.length === 0 ? (
                  <p className="tasks-empty">아직 등록된 할 일이 없습니다. 위 폼에서 첫 번째 할 일을 추가해보세요.</p>
               ) : (
                  <>
                     {filter === 'all' && (
                        <>
                           <div className="tasks-section">
                              <p className="tasks-section-title">예정</p>
                              {activeTasks.length === 0 ? (
                                 <p className="tasks-empty">예정된 할 일이 없습니다.</p>
                              ) : (
                                 <ul className="tasks-list">
                                    {activeTasks.map((t) => (
                                       <li key={t.id} className="tasks-item">
                                          <div className="tasks-item-main">
                                             <label className="tasks-checkbox-label">
                                                <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id, t.done)} />
                                                <span className="tasks-title">{t.title}</span>
                                             </label>
                                             <p className="tasks-meta">
                                                {PROJECT_LABEL[t.project] || '기타'} · {PRIORITY_LABEL[t.priority] || '우선순위 보통'} {t.dueDate && `· 마감일 ${t.dueDate}`}
                                             </p>
                                             {t.memo && <p className="tasks-memo">{t.memo}</p>}
                                          </div>

                                          <div className="tasks-actions-inline">
                                             <button type="button" className="tasks-edit-btn" onClick={() => openEditModal(t)}>
                                                수정
                                             </button>
                                             <button type="button" className="tasks-done-btn" onClick={() => toggleDone(t.id, t.done)}>
                                                완료
                                             </button>
                                          </div>

                                          <button type="button" className="tasks-close-btn" onClick={() => openDeleteConfirm(t.id)} aria-label="할 일 삭제">
                                             ×
                                          </button>
                                       </li>
                                    ))}
                                 </ul>
                              )}
                           </div>

                           <div className="tasks-section">
                              <p className="tasks-section-title">완료</p>
                              {doneTasks.length === 0 ? (
                                 <p className="tasks-empty">완료된 할 일이 없습니다.</p>
                              ) : (
                                 <ul className="tasks-list">
                                    {doneTasks.map((t) => (
                                       <li key={t.id} className="tasks-item done">
                                          <div className="tasks-item-main">
                                             <label className="tasks-checkbox-label">
                                                <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id, t.done)} />
                                                <span className="tasks-title done">{t.title}</span>
                                             </label>
                                             <p className="tasks-meta">
                                                {PROJECT_LABEL[t.project] || '기타'} · {PRIORITY_LABEL[t.priority] || '우선순위 보통'} {t.dueDate && `· 마감일 ${t.dueDate}`}
                                             </p>
                                             {t.memo && <p className="tasks-memo">{t.memo}</p>}
                                          </div>

                                          <div className="tasks-actions-inline">
                                             <button type="button" className="tasks-edit-btn" onClick={() => openEditModal(t)}>
                                                수정
                                             </button>
                                             <span className="tasks-done-badge">완료됨</span>
                                          </div>

                                          <button type="button" className="tasks-close-btn" onClick={() => openDeleteConfirm(t.id)} aria-label="할 일 삭제">
                                             ×
                                          </button>
                                       </li>
                                    ))}
                                 </ul>
                              )}
                           </div>
                        </>
                     )}

                     {filter === 'active' && (
                        <div className="tasks-section">
                           {activeTasks.length === 0 ? (
                              <p className="tasks-empty">예정된 할 일이 없습니다.</p>
                           ) : (
                              <ul className="tasks-list">
                                 {activeTasks.map((t) => (
                                    <li key={t.id} className="tasks-item">
                                       <div className="tasks-item-main">
                                          <label className="tasks-checkbox-label">
                                             <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id, t.done)} />
                                             <span className="tasks-title">{t.title}</span>
                                          </label>
                                          <p className="tasks-meta">
                                             {PROJECT_LABEL[t.project] || '기타'} · {PRIORITY_LABEL[t.priority] || '우선순위 보통'} {t.dueDate && `· 마감일 ${t.dueDate}`}
                                          </p>
                                          {t.memo && <p className="tasks-memo">{t.memo}</p>}
                                       </div>

                                       <div className="tasks-actions-inline">
                                          <button type="button" className="tasks-edit-btn" onClick={() => openEditModal(t)}>
                                             수정
                                          </button>
                                          <button type="button" className="tasks-done-btn" onClick={() => toggleDone(t.id, t.done)}>
                                             완료
                                          </button>
                                       </div>

                                       <button type="button" className="tasks-close-btn" onClick={() => openDeleteConfirm(t.id)} aria-label="할 일 삭제">
                                          ×
                                       </button>
                                    </li>
                                 ))}
                              </ul>
                           )}
                        </div>
                     )}

                     {filter === 'done' && (
                        <div className="tasks-section">
                           {doneTasks.length === 0 ? (
                              <p className="tasks-empty">완료된 할 일이 없습니다.</p>
                           ) : (
                              <ul className="tasks-list">
                                 {doneTasks.map((t) => (
                                    <li key={t.id} className="tasks-item done">
                                       <div className="tasks-item-main">
                                          <label className="tasks-checkbox-label">
                                             <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id, t.done)} />
                                             <span className="tasks-title done">{t.title}</span>
                                          </label>
                                          <p className="tasks-meta">
                                             {PROJECT_LABEL[t.project] || '기타'} · {PRIORITY_LABEL[t.priority] || '우선순위 보통'} {t.dueDate && `· 마감일 ${t.dueDate}`}
                                          </p>
                                          {t.memo && <p className="tasks-memo">{t.memo}</p>}
                                       </div>

                                       <div className="tasks-actions-inline">
                                          <button type="button" className="tasks-edit-btn" onClick={() => openEditModal(t)}>
                                             수정
                                          </button>
                                          <span className="tasks-done-badge">완료됨</span>
                                       </div>

                                       <button type="button" className="tasks-close-btn" onClick={() => openDeleteConfirm(t.id)} aria-label="할 일 삭제">
                                          ×
                                       </button>
                                    </li>
                                 ))}
                              </ul>
                           )}
                        </div>
                     )}
                  </>
               )}
            </section>
         </div>

         {/* ✅ 수정 모달 */}
         {editingTask && (
            <div className="tasks-modal-backdrop" onClick={closeEditModal}>
               <div className="tasks-modal" onClick={(e) => e.stopPropagation()}>
                  <header className="tasks-modal-head">
                     <h3>할 일 수정</h3>
                     <button type="button" className="tasks-modal-close" onClick={closeEditModal}>
                        ✕
                     </button>
                  </header>

                  <form className="tasks-modal-form" onSubmit={handleEditSubmit}>
                     <div className="tasks-field">
                        <label>제목</label>
                        <input type="text" value={editForm.title} onChange={(e) => handleEditChange('title', e.target.value)} />
                     </div>

                     <div className="tasks-row">
                        <div className="tasks-field">
                           <label>프로젝트</label>
                           <select value={editForm.project} onChange={(e) => handleEditChange('project', e.target.value)}>
                              <option value="personal">개인</option>
                              <option value="study">공부</option>
                              <option value="work">일</option>
                              <option value="etc">기타</option>
                           </select>
                        </div>
                        <div className="tasks-field">
                           <label>우선순위</label>
                           <select value={editForm.priority} onChange={(e) => handleEditChange('priority', e.target.value)}>
                              <option value="low">낮음</option>
                              <option value="medium">보통</option>
                              <option value="high">높음</option>
                           </select>
                        </div>
                        <div className="tasks-field">
                           <label>마감일</label>
                           <input type="date" value={editForm.dueDate} onChange={(e) => handleEditChange('dueDate', e.target.value)} />
                        </div>
                     </div>

                     <div className="tasks-field">
                        <label>메모</label>
                        <textarea rows={2} value={editForm.memo} onChange={(e) => handleEditChange('memo', e.target.value)} />
                     </div>

                     <div className="tasks-modal-actions">
                        <button type="button" className="tasks-modal-cancel" onClick={closeEditModal}>
                           취소
                        </button>
                        <button type="submit" className="tasks-modal-submit">
                           저장
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* ✅ 삭제 확인 모달 */}
         {deleteTargetId && (
            <div className="tasks-modal-backdrop" onClick={closeDeleteConfirm}>
               <div className="tasks-modal" onClick={(e) => e.stopPropagation()}>
                  <header className="tasks-modal-head">
                     <h3>할 일 삭제</h3>
                     <button type="button" className="tasks-modal-close" onClick={closeDeleteConfirm}>
                        ✕
                     </button>
                  </header>
                  <p className="tasks-modal-message">이 할 일을 삭제하시겠습니까?</p>
                  <div className="tasks-modal-actions">
                     <button type="button" className="tasks-modal-cancel" onClick={closeDeleteConfirm}>
                        취소
                     </button>
                     <button type="button" className="tasks-modal-submit" onClick={confirmDelete}>
                        삭제
                     </button>
                  </div>
               </div>
            </div>
         )}
      </Layout>
   );
}

export default Tasks;
