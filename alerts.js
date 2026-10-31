/* getpcnow ALERTS. The header bell and the "new laptop listings" email signup. Loads before app.js.
   Saves the visitor's email into the Supabase table "subscribers" (see schema.sql). Only the PUBLISHABLE key lives here
   (safe to be public: row-level security lets visitors add a row and nothing else). NEVER put the secret key in this file.
   The emails themselves are sent by scripts/notify-new-listings.mjs when you add a laptop to data.js. */
var ALERTS_CFG={
 url:"https://bcfspmezuuanhmxndjsq.supabase.co",
 key:"sb_publishable_pa3gHKvmKqW2Vb-kl_n61w_8Yvp5Ie2",
 table:"subscribers"};
var BELL_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';
function subDone(){try{return!!localStorage.getItem("gpn_sub")}catch(e){return false}}

/* The bell sits in the header, just before the country switch. Added here so index.html needs no change. */
(function(){
 function mount(){
  var h=document.querySelector("header");if(!h||h.querySelector(".hbell"))return;
  var b=document.createElement("button");b.type="button";b.className="hbell"+(subDone()?" on":"");
  b.setAttribute("aria-label","Get emails about new laptop listings");b.title="Get emails about new laptops";
  b.innerHTML=BELL_SVG;b.onclick=function(){openAlert(b)};
  var seg=h.querySelector(".seg");seg?h.insertBefore(b,seg):h.appendChild(b)}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount()})();

/* openAlert(bellButton). Asks for an email, saves it, then plays a "you will be alerted" animation. */
function openAlert(bell){
 var prev=document.activeElement,saved="";try{saved=localStorage.getItem("gpn_email")||""}catch(e){}
 var bg=document.createElement("div");bg.className="am-bg";
 bg.innerHTML='<div class="am" role="dialog" aria-modal="true" aria-labelledby="am-t"><button class="am-x" type="button" aria-label="Close">×</button>'
  +'<div class="am-form"><div class="am-ico">'+BELL_SVG+'</div><h2 id="am-t">Latest laptop listings</h2>'
  +'<p class="am-p">Add your email for updates on the latest laptop listings.</p>'
  +'<label for="am-e">Your email</label><input id="am-e" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" maxlength="254">'
  +'<input class="am-h" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
  +'<p class="am-n">We only email you when a new laptop is added. Nothing else, and every email has an unsubscribe link.</p>'
  +'<p class="am-err" role="alert"></p><button class="btn dark am-go" type="button">Alert me</button></div>'
  +'<div class="am-ok" aria-live="polite" hidden><svg class="am-check" viewBox="0 0 52 52" aria-hidden="true"><circle class="am-c" cx="26" cy="26" r="23" fill="none"/><path class="am-t" fill="none" d="M15 27l8 8 15-17"/></svg>'
  +'<h2>You will be alerted!</h2><p class="am-p am-okp"></p></div></div>';
 document.body.appendChild(bg);document.body.classList.add("am-lock");
 var box=bg.firstChild,em=box.querySelector("#am-e"),err=box.querySelector(".am-err"),go=box.querySelector(".am-go"),timer;
 em.value=saved;
 function close(){clearTimeout(timer);document.removeEventListener("keydown",key);bg.remove();document.body.classList.remove("am-lock");if(prev&&prev.focus)prev.focus()}
 function key(e){if(e.key==="Escape")close();
  if(e.key==="Tab"){var f=box.querySelectorAll("button:not([hidden]),input:not(.am-h)"),a=f[0],z=f[f.length-1];
   if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}}
 function success(again){
  try{localStorage.setItem("gpn_sub","1")}catch(e){}
  if(bell){bell.classList.add("on","ring");setTimeout(function(){bell.classList.remove("ring")},700)}
  box.querySelector(".am-form").hidden=true;
  box.querySelector(".am-okp").textContent=again?"This email is already on the list. We will email you when a new laptop is added.":"We will email you whenever a new laptop is added.";
  box.querySelector(".am-ok").hidden=false;box.classList.add("done");
  timer=setTimeout(close,3200)}
 function send(){
  var v=em.value.trim().toLowerCase();err.textContent="";
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){err.textContent="Please enter a valid email address.";em.focus();return}
  if(box.querySelector(".am-h").value){success();return}   /* hidden field filled = a bot; pretend it worked */
  go.disabled=true;go.textContent="Saving…";
  fetch(ALERTS_CFG.url+"/rest/v1/"+ALERTS_CFG.table,{method:"POST",
   headers:{"apikey":ALERTS_CFG.key,"Content-Type":"application/json","Prefer":"return=minimal"},
   body:JSON.stringify({email:v})})
  .then(function(r){
   if(r.ok){try{localStorage.setItem("gpn_email",v)}catch(e){}success(false)}
   else if(r.status===409){try{localStorage.setItem("gpn_email",v)}catch(e){}success(true)}
   else throw new Error(r.status)})
  .catch(function(){go.disabled=false;go.textContent="Alert me";err.textContent="Sorry, that did not save. Check your connection and try again."})}
 go.onclick=send;em.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();send()}};
 box.querySelector(".am-x").onclick=close;
 bg.onclick=function(e){if(e.target===bg)close()};
 document.addEventListener("keydown",key);
 setTimeout(function(){em.focus()},30)}

/* /unsubscribe?t=<token> : the link at the bottom of every email. Calls the unsubscribe() function in Supabase. */
function unsubPage(){
 var t=(new URLSearchParams(location.search)).get("t")||"",a=document.getElementById("app");
 a.innerHTML='<section class="page"><a class="back" href="/">← Home</a><h1>Unsubscribe</h1><p class="un-msg">Working…</p></section>';
 document.title="Unsubscribe – getpcnow";
 var m=a.querySelector(".un-msg");
 if(!/^[0-9a-f-]{36}$/i.test(t)){m.textContent="This unsubscribe link looks incomplete. Open the link from the email again.";return}
 fetch(ALERTS_CFG.url+"/rest/v1/rpc/unsubscribe",{method:"POST",headers:{"apikey":ALERTS_CFG.key,"Content-Type":"application/json"},body:JSON.stringify({t:t})})
 .then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})
 .then(function(ok){try{localStorage.removeItem("gpn_sub")}catch(e){}
  var b=document.querySelector(".hbell");if(b)b.classList.remove("on");
  m.textContent=ok?"You are unsubscribed. You will not get any more emails from us.":"This email is already unsubscribed."})
 .catch(function(){m.textContent="Sorry, that did not work. Please try again in a moment."})}
