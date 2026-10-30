/* getpcnow dark mode. Put <script src="theme.js"></script> inside <head> (before the stylesheets finish) so there is no white flash.
   Follows the visitor's device setting until they press the moon/sun button. Their choice is then remembered. */
(function(){
var K="gpn_theme",r=document.documentElement,mq=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)");
function saved(){try{var s=localStorage.getItem(K);return s==="dark"||s==="light"?s:null}catch(e){return null}}
function cur(){return saved()||(mq&&mq.matches?"dark":"light")}
function apply(t){
  r.setAttribute("data-theme",t);
  var b=document.getElementById("themebtn");
  if(b){b.setAttribute("aria-label",t==="dark"?"Switch to light mode":"Switch to dark mode");b.setAttribute("title",t==="dark"?"Light mode":"Dark mode")}}
apply(cur());
if(mq&&mq.addEventListener)mq.addEventListener("change",function(){if(!saved())apply(cur())});
var MOON='<svg class="tb-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
var SUN='<svg class="tb-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
function mount(){
  if(document.getElementById("themebtn"))return;
  var h=document.querySelector("header");if(!h)return;
  var b=document.createElement("button");
  b.type="button";b.id="themebtn";b.className="theme-btn";b.innerHTML=MOON+SUN;
  b.onclick=function(){var t=cur()==="dark"?"light":"dark";try{localStorage.setItem(K,t)}catch(e){}apply(t)};
  h.appendChild(b);apply(cur())}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();
