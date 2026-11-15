const overlay=document.querySelector('#surf-overlay');
const trigger=document.querySelector('.d-menu-trigger');
const closeButton=overlay?.querySelector('.d-overlay-close');
let previousFocus=null;
function closeMenu(){
 if(!overlay||!trigger)return;
 overlay.classList.remove('is-open');
 overlay.setAttribute('aria-hidden','true');
 overlay.inert=true;
 trigger.setAttribute('aria-expanded','false');
 trigger.setAttribute('aria-label','メニューを開く');
 document.documentElement.classList.remove('surf-menu-open');
 (previousFocus?.isConnected?previousFocus:trigger).focus();
}
function openMenu(){
 if(!overlay||!trigger)return;
 previousFocus=document.activeElement;
 overlay.inert=false;
 overlay.setAttribute('aria-hidden','false');
 overlay.classList.add('is-open');
 trigger.setAttribute('aria-expanded','true');
 trigger.setAttribute('aria-label','メニューを閉じる');
 document.documentElement.classList.add('surf-menu-open');
 closeButton?.focus();
}
trigger?.addEventListener('click',()=>overlay?.classList.contains('is-open')?closeMenu():openMenu());
closeButton?.addEventListener('click',closeMenu);
overlay?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{
 if(!overlay?.classList.contains('is-open'))return;
 if(event.key==='Escape'){event.preventDefault();closeMenu();return;}
 if(event.key!=='Tab')return;
 const focusables=[...overlay.querySelectorAll('a,button:not([disabled])')];
 if(!focusables.length)return;
 const first=focusables[0],last=focusables[focusables.length-1];
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
