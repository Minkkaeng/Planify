// src/utils/profileStorage.js
export const PROFILE_KEY = 'planify_profile';

const EMPTY_PROFILE = {
   nickname: '',
   email: '',
   bio: '',
};

export function loadProfile() {
   try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return { ...EMPTY_PROFILE };

      const parsed = JSON.parse(raw);

      return {
         nickname: parsed.nickname || '',
         email: parsed.email || '',
         bio: parsed.bio || '',
      };
   } catch {
      localStorage.removeItem(PROFILE_KEY);
      return { ...EMPTY_PROFILE };
   }
}

export function saveProfile(profile) {
   const safe = {
      nickname: profile.nickname || '',
      email: profile.email || '',
      bio: profile.bio || '',
   };
   localStorage.setItem(PROFILE_KEY, JSON.stringify(safe));
}

export function resetProfile() {
   localStorage.removeItem(PROFILE_KEY);
}
