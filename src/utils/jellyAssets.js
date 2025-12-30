// src/utils/jellyAssets.js

import yellowLogo from '../assets/gummy-bear-yellow.png';
import purpleLogo from '../assets/gummy-bear-purple.png';
import pinkLogo from '../assets/gummy-bear-pink.png';

export function getJellyLogo(jelly) {
   switch (jelly) {
      case 'purple':
         return purpleLogo;
      case 'pink':
         return pinkLogo;
      case 'yellow':
      default:
         return yellowLogo;
   }
}

export function getJellyLabel(jelly) {
   switch (jelly) {
      case 'purple':
         return 'Grape Jelly';
      case 'pink':
         return 'Peach Jelly';
      case 'yellow':
      default:
         return 'Lemon Jelly';
   }
}
