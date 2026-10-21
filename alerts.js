/* getpcnow ALERTS. The "Get a price alert" popup. Loads before app.js.
   Saves email + laptop into the Supabase table price_alerts. Only the PUBLISHABLE key lives here (safe to be public;
   the table's row-level security lets visitors add rows and nothing else). NEVER put the secret key in this file. */
var ALERTS_CFG={
 url:"https://bcfspmezuuanhmxndjsq.supabase.co",
 key:"sb_publishable_pa3gHKvmKqW2Vb-kl_n61w_8Yvp5Ie2",
 table:"price_alerts"};
/* openAlert(laptop, onSuccess). Price saved = the laptop's current price in naira-equivalent (same basis as ep() in app.js). */
function openAlert(p,done){
 var price=ep(p),prev=document.activeElement,saved="";try{saved=localStorage.getItem("gpn_email")||""}catch(e){}
 var bg=document.createElement("div");bg.className="am-bg";
 bg.innerHTML='<div class="am" role="dialog" aria-modal="true" aria-labelledby="am-t"><button class="am-x" type="button" aria-label="Close">×</button>'
  +'<h2 id="am-t">Get a price alert</h2><p class="am-l"></p><p class="am-p"></p>'
  +'<label for="am-e">Your email</label><input id="am-e" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" maxlength="254">'
  +'<input class="am-h" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
  +'<p class="am-n">We only email you when this laptop gets cheaper. Nothing else, and every email will have an unsubscribe link.</p>'
  +'<p class="am-err" role="alert"></p><button class="btn dark am-go" type="button">Alert me</button></div>';
 document.body.appendChild(bg);document.body.classList.add("am-lock");
 var box=bg.firstChild,em=box.querySelector("#am-e"),err=box.querySelector(".am-err"),go=box.querySelector(".am-go");
 box.querySelector(".am-l").textContent=p.n;
 box.querySelector(".am-p").textContent="Now: "+money(price);
 em.value=saved;
 function close(){document.removeEventListener("keydown",key);bg.remove();document.body.classList.remove("am-lock");if(prev&&prev.focus)prev.focus()}
 function key(e){if(e.key==="Escape")close();
  if(e.key==="Tab"){var f=box.querySelectorAll("button,input:not(.am-h)"),a=f[0],z=f[f.length-1];
   if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}}
 function ok(msg){close();toast(msg);if(done)done()}
 function send(){
  var v=em.value.trim().toLowerCase();err.textContent="";
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){err.textContent="Please enter a valid email address.";em.focus();return}
  if(box.querySelector(".am-h").value){ok("Alert set for "+p.n);return}   /* hidden field filled = a bot; pretend it worked */
  go.disabled=true;go.textContent="Saving…";
  fetch(ALERTS_CFG.url+"/rest/v1/"+ALERTS_CFG.table,{method:"POST",
   headers:{"apikey":ALERTS_CFG.key,"Content-Type":"application/json","Prefer":"return=minimal"},
   body:JSON.stringify({email:v,laptop:p.n,country:st.cur,price_at_signup:Math.round(price)})})
  .then(function(r){
   if(r.ok){try{localStorage.setItem("gpn_email",v)}catch(e){}ok("Alert set for "+p.n+". We will email you.")}
   else if(r.status===409){ok("You already have an alert for this laptop.")}
   else throw new Error(r.status)})
  .catch(function(){go.disabled=false;go.textContent="Alert me";err.textContent="Sorry, that did not save. Check your connection and try again."})}
 go.onclick=send;em.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();send()}};
 box.querySelector(".am-x").onclick=close;
 bg.onclick=function(e){if(e.target===bg)close()};
 document.addEventListener("keydown",key);
 setTimeout(function(){em.focus()},30)}
