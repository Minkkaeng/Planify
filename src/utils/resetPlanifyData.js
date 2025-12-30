// src/utils/resetPlanifyData.js
import { TASK_KEY } from './taskStorage';
import { PROFILE_KEY } from './profileStorage';

export function resetPlanifyData() {
   // 할 일 / 프로필
   localStorage.removeItem(TASK_KEY);
   localStorage.removeItem(PROFILE_KEY);

   // 테마 관련
   localStorage.removeItem('planify_colorMode');
   localStorage.removeItem('planify_jelly');
}
